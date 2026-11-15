import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, it } from 'node:test'
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore'

const ts = Timestamp.fromDate(new Date('2026-01-15T12:00:00.000Z'))
const photoId = 'abcdef0123456789abcd'
const albumId = 'cairo-nights'

let testEnv
let ownerDb
let adminDb
let otherAdminDb
let anonDb
let strangerDb
let unverifiedDb

function photo(overrides = {}) {
    return {
        id: photoId,
        publicId: `mohamedshams/gallery/${photoId}`,
        secureUrl: `https://res.cloudinary.com/demo/image/upload/v1/mohamedshams/gallery/${photoId}.jpg`,
        originalFormat: 'jpg',
        width: 4000,
        height: 3000,
        bytes: 800000,
        caption: null,
        description: null,
        albumId: null,
        tags: [],
        location: null,
        takenAt: null,
        uploadedAt: ts,
        status: 'draft',
        sortOrder: 100,
        ...overrides,
    }
}

function album(overrides = {}) {
    return {
        id: albumId,
        title: 'Cairo',
        slug: albumId,
        description: null,
        coverPhotoId: null,
        createdAt: ts,
        updatedAt: ts,
        status: 'draft',
        sortOrder: 1,
        ...overrides,
    }
}

before(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: 'demo-reading-library',
        firestore: {
            rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
        },
    })
    ownerDb = testEnv.authenticatedContext('gallery-owner', {
        galleryOwner: true,
        email: 'owner@example.com',
        email_verified: true,
    }).firestore()
    adminDb = testEnv.authenticatedContext('library-admin', {
        admin: true,
        email: 'owner@example.com',
        email_verified: true,
    }).firestore()
    otherAdminDb = testEnv.authenticatedContext('other-admin', {
        admin: true,
        email: 'other@example.com',
        email_verified: true,
    }).firestore()
    anonDb = testEnv.unauthenticatedContext().firestore()
    strangerDb = testEnv.authenticatedContext('stranger', {
        email: 'stranger@example.com',
        email_verified: true,
    }).firestore()
    unverifiedDb = testEnv.authenticatedContext('unverified-gallery', {
        galleryOwner: true,
        email: 'owner@example.com',
        email_verified: false,
    }).firestore()
})

after(async () => {
    await testEnv.cleanup()
})

beforeEach(async () => {
    await testEnv.clearFirestore()
})

describe('gallery photos', () => {
    it('lets a verified gallery owner create a draft and keeps everyone else away', async () => {
        await assertSucceeds(setDoc(doc(ownerDb, 'photos', photoId), photo()))
        await assertFails(getDoc(doc(anonDb, 'photos', photoId)))
        await assertFails(getDocs(collection(anonDb, 'photos')))
        await assertFails(getDoc(doc(adminDb, 'photos', photoId)))
        await assertFails(setDoc(doc(adminDb, 'photos', photoId), photo()))
        await assertFails(setDoc(doc(strangerDb, 'photos', photoId), photo()))
        await assertFails(setDoc(doc(unverifiedDb, 'photos', 'bbbbbbbbbbbbbbbbbbbb'), photo({
            id: 'bbbbbbbbbbbbbbbbbbbb',
            publicId: 'mohamedshams/gallery/bbbbbbbbbbbbbbbbbbbb',
        })))
        await assertFails(getDoc(doc(unverifiedDb, 'photos', photoId)))
    })

    it('refuses a published create, an oversized byte count, an overwritten public id, and a client delete', async () => {
        await assertFails(setDoc(doc(ownerDb, 'photos', photoId), photo({ status: 'published' })))
        await assertFails(setDoc(doc(ownerDb, 'photos', photoId), photo({ bytes: 10485761 })))
        await assertSucceeds(setDoc(doc(ownerDb, 'photos', photoId), photo()))
        await assertFails(updateDoc(doc(ownerDb, 'photos', photoId), {
            publicId: 'mohamedshams/gallery/zzzzzzzzzzzzzzzzzzzz',
        }))
        await assertFails(updateDoc(doc(adminDb, 'photos', photoId), { status: 'published' }))
        await assertSucceeds(updateDoc(doc(ownerDb, 'photos', photoId), { status: 'published', caption: 'مساء' }))
        await assertSucceeds(getDoc(doc(anonDb, 'photos', photoId)))
        await assertSucceeds(getDocs(query(collection(anonDb, 'photos'), where('status', '==', 'published'))))
        await assertFails(deleteDoc(doc(ownerDb, 'photos', photoId)))
        await assertFails(deleteDoc(doc(adminDb, 'photos', photoId)))
        await assertSucceeds(updateDoc(doc(ownerDb, 'photos', photoId), { status: 'archived' }))
        await assertFails(deleteDoc(doc(ownerDb, 'photos', photoId)))
        await assertFails(getDoc(doc(anonDb, 'photos', photoId)))
        await assertFails(getDoc(doc(adminDb, 'photos', photoId)))
    })
})

describe('gallery albums', () => {
    it('shows visitors a published album and lets only the gallery owner delete an archived one', async () => {
        await assertFails(setDoc(doc(adminDb, 'albums', albumId), album()))
        await assertSucceeds(setDoc(doc(ownerDb, 'albums', albumId), album()))
        await assertFails(getDoc(doc(anonDb, 'albums', albumId)))
        await assertSucceeds(updateDoc(doc(ownerDb, 'albums', albumId), { status: 'published', updatedAt: ts }))
        await assertSucceeds(getDoc(doc(anonDb, 'albums', albumId)))
        await assertFails(deleteDoc(doc(ownerDb, 'albums', albumId)))
        await assertSucceeds(updateDoc(doc(ownerDb, 'albums', albumId), { status: 'archived', updatedAt: ts }))
        await assertFails(getDoc(doc(anonDb, 'albums', albumId)))
        await assertFails(deleteDoc(doc(adminDb, 'albums', albumId)))
        await assertFails(deleteDoc(doc(unverifiedDb, 'albums', albumId)))
        await assertSucceeds(deleteDoc(doc(ownerDb, 'albums', albumId)))
    })
})

describe('gallery cleanup records', () => {
    it('keeps orphan records private to the verified gallery owner', async () => {
        const cleanup = {
            photoId,
            publicId: `mohamedshams/gallery/${photoId}`,
            secureUrl: `https://res.cloudinary.com/demo/image/upload/v1/mohamedshams/gallery/${photoId}.jpg`,
            originalFormat: 'jpg',
            width: 100,
            height: 80,
            bytes: 1000,
            reason: 'firestore-write-failed',
            createdAt: ts,
        }
        await assertFails(setDoc(doc(anonDb, 'photoCleanup', photoId), cleanup))
        await assertFails(setDoc(doc(adminDb, 'photoCleanup', photoId), cleanup))
        await assertFails(setDoc(doc(otherAdminDb, 'photoCleanup', photoId), cleanup))
        await assertFails(setDoc(doc(unverifiedDb, 'photoCleanup', photoId), cleanup))
        await assertSucceeds(setDoc(doc(ownerDb, 'photoCleanup', photoId), cleanup))
        await assertFails(getDoc(doc(anonDb, 'photoCleanup', photoId)))
        await assertFails(getDoc(doc(adminDb, 'photoCleanup', photoId)))
        await assertFails(getDoc(doc(otherAdminDb, 'photoCleanup', photoId)))
        await assertFails(getDoc(doc(unverifiedDb, 'photoCleanup', photoId)))
        await assertFails(updateDoc(doc(ownerDb, 'photoCleanup', photoId), { reason: 'rejected-after-upload' }))
        await assertFails(deleteDoc(doc(adminDb, 'photoCleanup', photoId)))
        await assertSucceeds(deleteDoc(doc(ownerDb, 'photoCleanup', photoId)))
    })

    it('lets the gallery owner record an oversized Cloudinary byte count for later deletion', async () => {
        await assertSucceeds(setDoc(doc(ownerDb, 'photoCleanup', photoId), {
            photoId,
            publicId: `mohamedshams/gallery/${photoId}`,
            secureUrl: `https://res.cloudinary.com/demo/image/upload/v1/mohamedshams/gallery/${photoId}.jpg`,
            originalFormat: 'jpg',
            width: 100,
            height: 80,
            bytes: 10485761,
            reason: 'rejected-after-upload',
            createdAt: ts,
        }))
        await assertFails(getDoc(doc(anonDb, 'photoCleanup', photoId)))
        await assertFails(getDoc(doc(otherAdminDb, 'photoCleanup', photoId)))
    })
})
