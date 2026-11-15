#!/usr/bin/env node

/**
 * Assign the Firebase Auth custom claim { admin: true } to one verified
 * Google account. This script does not deploy Firestore rules and does not
 * write library documents.
 *
 * Do not run this during local rules development.
 *
 * Future production sequence, only after an explicit approval to go to
 * production:
 *
 * 1. Assign the claim to the verified Google account:
 *      node scripts/set-admin-claim.mjs --email you@gmail.com --confirm
 *    The account must already exist in Firebase Auth and emailVerified
 *    must be true. Existing custom claims are merged. { admin: true } is
 *    a boolean, not the string "true".
 *
 * 2. Refresh that account's ID token and verify the claim. Sign out of the
 *    site and sign in again, then confirm the new token:
 *      const result = await user.getIdTokenResult(true)
 *      result.claims.admin === true
 *    Tokens issued before this step do not carry the claim. Rules read the
 *    token that is presented, so deploying rules before this refresh locks
 *    the owner out of net worth, the dashboard, and presence until sign-in.
 *
 * 3. Verify admin access with that refreshed token. Before the rules deploy,
 *    the live rules ignore the claim and the site keeps its current behavior.
 *    After the refresh, the token is ready for the new rules.
 *
 * 4. Only then deploy the rules:
 *      firebase deploy --only firestore:rules
 *    Do not deploy from this script.
 *
 * 5. Before the homepage widget is added, initialize the empty pointer once:
 *      node scripts/init-current-reading.mjs --allow-production --confirm
 *    Public clients cannot create settings/currentReading.
 *
 * Credentials match scripts/seed-holdings.js: FIREBASE_SERVICE_ACCOUNT_JSON,
 * GOOGLE_APPLICATION_CREDENTIALS, or ./serviceAccountKey.json.
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
const email = (argValue('--email') || process.env.VITE_OWNER_EMAIL || '').trim()

if (!confirmed || !email) {
    console.error(
        'Refusing to write Auth claims. This script is not part of the local rules test run.\n' +
        'When production is explicitly approved, run:\n' +
        '  node scripts/set-admin-claim.mjs --email you@gmail.com --confirm\n' +
        'Then refresh the ID token, verify claims.admin === true, and only then deploy rules.\n' +
        'See the comment at the top of this file for the full sequence.',
    )
    process.exit(1)
}

initAdmin()

const user = await getAuth().getUserByEmail(email)

if (user.emailVerified !== true) {
    console.error(`Refusing to grant admin. ${email} is not a verified account.`)
    process.exit(1)
}

const existing = user.customClaims || {}
await getAuth().setCustomUserClaims(user.uid, { ...existing, admin: true })

const refreshed = await getAuth().getUser(user.uid)
if (refreshed.customClaims?.admin !== true) {
    console.error('Claim write did not stick. admin is not boolean true.')
    process.exit(1)
}

console.log(`admin claim set for uid ${refreshed.uid} (${refreshed.email}).`)
console.log('Sign out and sign in, confirm getIdTokenResult(true).claims.admin === true, then deploy rules separately.')
console.log('This script did not deploy Firestore rules.')
