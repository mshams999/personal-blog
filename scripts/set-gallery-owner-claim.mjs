#!/usr/bin/env node

/**
 * Assign the Firebase Auth custom claim { galleryOwner: true } to one
 * verified Google account. Existing claims are merged, so admin: true is
 * preserved. galleryOwner is the boolean true, not the string "true".
 *
 * This script does not deploy Firestore rules and does not write gallery
 * documents. Do not run it as part of tests or a rules deploy.
 *
 * Operator sequence:
 *
 * 1. Run this script locally with a service account that is NOT committed.
 *    Credentials match scripts/set-admin-claim.mjs: FIREBASE_SERVICE_ACCOUNT_JSON,
 *    GOOGLE_APPLICATION_CREDENTIALS, or ./serviceAccountKey.json (gitignored).
 *    Never put the service account JSON in frontend code or a VITE_ variable.
 *      node scripts/set-gallery-owner-claim.mjs --email you@gmail.com --confirm
 *    The account must already exist in Firebase Auth and emailVerified must
 *    be true. The email must be the same verified Google address stored as
 *    GALLERY_OWNER_EMAIL (server) and VITE_OWNER_EMAIL (gallery UI).
 *
 * 2. The owner signs out of the site and signs in again so the ID token
 *    refreshes. Tokens issued before this step do not carry galleryOwner.
 *    Confirm:
 *      const result = await user.getIdTokenResult(true)
 *      result.claims.galleryOwner === true
 *      result.claims.email_verified === true
 *
 * 3. Deploying rules is a separate explicit step, after that refresh:
 *      firebase deploy --only firestore:rules
 *    Do not deploy from this script. Until rules that require galleryOwner
 *    are deployed, the previous rules remain in effect.
 */

import dotenv from 'dotenv'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
dotenv.config({ path: join(root, '.env') })

function argValue(flag) {
    const index = process.argv.indexOf(flag)
    if (index === -1) return ''
    return process.argv[index + 1] || ''
}

function resolveProjectId() {
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
    const withProject = (opts) => (projectId ? { ...opts, projectId } : opts)
    const defaultKeyPath = join(root, 'serviceAccountKey.json')

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
        initializeApp(withProject({ credential: cert(sa) }))
        return
    }

    const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (gac && existsSync(gac)) {
        const sa = JSON.parse(readFileSync(gac, 'utf8'))
        initializeApp(withProject({ credential: cert(sa) }))
        return
    }

    if (existsSync(defaultKeyPath)) {
        const sa = JSON.parse(readFileSync(defaultKeyPath, 'utf8'))
        initializeApp(withProject({ credential: cert(sa) }))
        return
    }

    throw new Error(
        'No Firebase Admin credentials found. Add serviceAccountKey.json at the repo root, set GOOGLE_APPLICATION_CREDENTIALS, or set FIREBASE_SERVICE_ACCOUNT_JSON.',
    )
}

const confirmed = process.argv.includes('--confirm')
const email = (argValue('--email') || process.env.GALLERY_OWNER_EMAIL || process.env.VITE_OWNER_EMAIL || '').trim()

if (!confirmed || !email) {
    console.error(
        'Refusing to write Auth claims. This script is not part of the local rules test run.\n' +
        'Run it locally with an uncommitted service account:\n' +
        '  node scripts/set-gallery-owner-claim.mjs --email you@gmail.com --confirm\n' +
        'Then the owner signs out and signs in so the ID token refreshes.\n' +
        'Rules deploy is a separate explicit step. This script does not deploy rules or write gallery documents.\n' +
        'See the comment at the top of this file.',
    )
    process.exit(1)
}

initAdmin()

let user
try {
    user = await getAuth().getUserByEmail(email)
} catch (error) {
    const code = error?.code || 'auth-lookup-failed'
    if (code === 'auth/user-not-found') {
        console.error(`Refusing to grant galleryOwner. No Auth user exists for ${email}.`)
    } else {
        console.error(`Refusing to grant galleryOwner. Lookup failed (${code}).`)
    }
    process.exit(1)
}

if (user.emailVerified !== true) {
    console.error(`Refusing to grant galleryOwner. ${email} is not a verified account.`)
    process.exit(1)
}

const existing = user.customClaims || {}
await getAuth().setCustomUserClaims(user.uid, { ...existing, galleryOwner: true })

const refreshed = await getAuth().getUser(user.uid)
if (refreshed.customClaims?.galleryOwner !== true) {
    console.error('Claim write did not stick. galleryOwner is not boolean true.')
    process.exit(1)
}
if (existing.admin === true && refreshed.customClaims?.admin !== true) {
    console.error('Existing admin claim was not preserved.')
    process.exit(1)
}

console.log(`galleryOwner claim set for uid ${refreshed.uid} (${refreshed.email}).`)
if (refreshed.customClaims?.admin === true) {
    console.log('Existing admin claim was preserved.')
}
console.log('Sign out and sign in, then confirm getIdTokenResult(true).claims.galleryOwner === true.')
console.log('This script did not deploy Firestore rules and did not write gallery documents.')
