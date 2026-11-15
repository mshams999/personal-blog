import { existsSync, readFileSync } from 'node:fs'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const APP_NAME = 'gallery-admin'

function serviceAccount() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (raw && raw.trim().startsWith('{')) return JSON.parse(raw)

    const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (path && existsSync(path)) return JSON.parse(readFileSync(path, 'utf8'))

    const localKey = new URL('../../../serviceAccountKey.json', import.meta.url)
    if (existsSync(localKey)) return JSON.parse(readFileSync(localKey, 'utf8'))
    return null
}

export function galleryApp() {
    const existing = getApps().find((app) => app.name === APP_NAME)
    if (existing) return existing

    const account = serviceAccount()
    if (!account) {
        const error = new Error('Firebase admin credentials are not configured.')
        error.code = 'gallery/not-configured'
        throw error
    }

    return initializeApp({ credential: cert(account) }, APP_NAME)
}

/**
 * Verifies the caller ID token and checks revocation.
 * Missing service-account credentials throw gallery/not-configured, which
 * authorizeOwner turns into a closed 500. Credentials are never read from
 * a VITE_ variable.
 */
export async function verifyOwnerToken(token) {
    return getAuth(galleryApp()).verifyIdToken(token, true)
}

function database() {
    return getFirestore(galleryApp())
}

export async function readPhoto(photoId) {
    const snap = await database().collection('photos').doc(photoId).get()
    if (!snap.exists) return null
    return { id: snap.id, ...snap.data() }
}

export async function readCleanup(cleanupId) {
    const snap = await database().collection('photoCleanup').doc(cleanupId).get()
    if (!snap.exists) return null
    return { id: snap.id, ...snap.data() }
}

export async function deletePhoto(photoId) {
    await database().collection('photos').doc(photoId).delete()
}

export async function deleteCleanup(cleanupId) {
    await database().collection('photoCleanup').doc(cleanupId).delete()
}

export async function recordCleanup(record) {
    const id = record.photoId
    await database().collection('photoCleanup').doc(id).set({
        ...record,
        createdAt: new Date().toISOString(),
    })
}
