#!/usr/bin/env node

/**
 * One-time create of settings/currentReading:
 *   { bookId: null, sessionId: null, updatedAt: server timestamp }
 *
 * Public clients cannot create this document. The homepage widget must not
 * read it until this script has created it. A missing document denies
 * anonymous reads, because the read rule touches resource.data.
 *
 * Safe by default: this script talks to the Firestore emulator when
 * FIRESTORE_EMULATOR_HOST is set. A production write requires both
 * --allow-production and --confirm, and is not part of local rules work.
 *
 * If the document already exists, it is left unchanged. create() does not
 * overwrite a pointer that already names a session.
 *
 * Production order is documented in scripts/set-admin-claim.mjs. Run this
 * initializer after the rules deploy and before shipping the widget:
 *   node scripts/init-current-reading.mjs --allow-production --confirm
 */

import dotenv from 'dotenv'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
dotenv.config({ path: join(root, '.env') })

const confirmed = process.argv.includes('--confirm')
const allowProduction = process.argv.includes('--allow-production')
const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)

if (!confirmed) {
    console.error('Refusing to write. Re-run with --confirm. Add --allow-production only for a real project.')
    process.exit(1)
}

if (!usingEmulator && !allowProduction) {
    console.error(
        'Refusing to touch production. FIRESTORE_EMULATOR_HOST is not set.\n' +
        'Local check: run inside firebase emulators:exec.\n' +
        'Future production init, after rules are deployed and before the widget ships:\n' +
        '  node scripts/init-current-reading.mjs --allow-production --confirm',
    )
    process.exit(1)
}

function resolveProjectId() {
    if (usingEmulator) return process.env.GCLOUD_PROJECT || 'demo-reading-library'
    return (
        process.env.GCLOUD_PROJECT ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.VITE_FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID ||
        undefined
    )
}

function initAdmin() {
    if (getApps().length) return
    const projectId = resolveProjectId()

    if (usingEmulator) {
        initializeApp({ projectId })
        return
    }

    const withProject = (opts) => (projectId ? { ...opts, projectId } : opts)
    const defaultKeyPath = join(root, 'serviceAccountKey.json')

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        initializeApp(withProject({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) }))
        return
    }

    const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (gac && existsSync(gac)) {
        initializeApp(withProject({ credential: cert(JSON.parse(readFileSync(gac, 'utf8'))) }))
        return
    }

    if (existsSync(defaultKeyPath)) {
        initializeApp(withProject({ credential: cert(JSON.parse(readFileSync(defaultKeyPath, 'utf8'))) }))
        return
    }

    throw new Error('No Firebase Admin credentials found for a production init.')
}

initAdmin()

const db = getFirestore()
const ref = db.doc('settings/currentReading')

try {
    await ref.create({
        bookId: null,
        sessionId: null,
        updatedAt: FieldValue.serverTimestamp(),
    })
    console.log('Created settings/currentReading with a null bookId, null sessionId, and a server timestamp.')
} catch (error) {
    if (error?.code === 6 || error?.code === 'already-exists' || error?.message?.includes('ALREADY_EXISTS')) {
        console.log('settings/currentReading already exists. Left it unchanged.')
    } else {
        throw error
    }
}

const snap = await ref.get()
const data = snap.data() || {}
if (!snap.exists || !('bookId' in data) || !('sessionId' in data) || !('updatedAt' in data)) {
    throw new Error('Pointer document is missing required fields after init.')
}

console.log(`Pointer bookId=${data.bookId} sessionId=${data.sessionId}.`)
console.log(usingEmulator ? 'Wrote to the local emulator only.' : 'Wrote to the configured Firebase project. Rules were not deployed.')
