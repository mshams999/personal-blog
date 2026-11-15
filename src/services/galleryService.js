import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    Timestamp,
    updateDoc,
    where,
    writeBatch,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { isAlbumSlug, photoFromUpload as buildPhotoFromUpload } from './galleryValidation.js'

export const GALLERY_PAGE_SIZE = 24

function mapSnap(snap) {
    return { id: snap.id, ...snap.data() }
}

function takenAtValue(value) {
    if (!value) return null
    const date = new Date(`${value}T12:00:00`)
    if (Number.isNaN(date.getTime())) return null
    return Timestamp.fromDate(date)
}

export function tagsFromInput(value) {
    return String(value || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && tag.length <= 40)
        .slice(0, 10)
}

export function photoFromUpload({ photoId, asset, albumId }) {
    // buildPhotoFromUpload returns null for a non-integer, non-positive, or
    // over-10 MB byte count, and for a public_id that does not match photoId.
    // Callers must not write a photos document in that case. Status is draft.
    return buildPhotoFromUpload({
        photoId,
        asset,
        albumId,
        uploadedAt: serverTimestamp(),
        sortOrder: Date.now(),
    })
}

export async function savePhoto(record) {
    await setDoc(doc(db, 'photos', record.id), record)
}

export async function saveCleanup(record) {
    await setDoc(doc(db, 'photoCleanup', record.photoId), {
        photoId: record.photoId,
        publicId: record.publicId,
        secureUrl: record.secureUrl || '',
        originalFormat: record.originalFormat || 'jpg',
        width: record.width || 0,
        height: record.height || 0,
        bytes: record.bytes || 0,
        reason: record.reason,
        createdAt: serverTimestamp(),
    })
}

export async function listPublishedPhotos(cursor) {
    const constraints = [
        where('status', '==', 'published'),
        orderBy('uploadedAt', 'desc'),
        limit(GALLERY_PAGE_SIZE),
    ]
    if (cursor) constraints.push(startAfter(cursor))
    const snap = await getDocs(query(collection(db, 'photos'), ...constraints))
    return {
        photos: snap.docs.map(mapSnap),
        cursor: snap.docs.at(-1) || null,
        hasMore: snap.docs.length === GALLERY_PAGE_SIZE,
    }
}

export async function listAlbumPhotos(albumId, cursor) {
    const constraints = [
        where('albumId', '==', albumId),
        where('status', '==', 'published'),
        orderBy('sortOrder', 'asc'),
        limit(GALLERY_PAGE_SIZE),
    ]
    if (cursor) constraints.push(startAfter(cursor))
    const snap = await getDocs(query(collection(db, 'photos'), ...constraints))
    return {
        photos: snap.docs.map(mapSnap),
        cursor: snap.docs.at(-1) || null,
        hasMore: snap.docs.length === GALLERY_PAGE_SIZE,
    }
}

export async function listPublishedAlbums() {
    const snap = await getDocs(query(
        collection(db, 'albums'),
        where('status', '==', 'published'),
        orderBy('sortOrder', 'asc'),
    ))
    return snap.docs.map(mapSnap)
}

export async function getPublishedAlbum(slug) {
    if (!isAlbumSlug(slug)) return null
    try {
        const snap = await getDoc(doc(db, 'albums', slug))
        if (!snap.exists() || snap.data().status !== 'published') return null
        return mapSnap(snap)
    } catch (error) {
        if (error?.code === 'permission-denied') return null
        throw error
    }
}

export async function getPublishedPhoto(photoId) {
    try {
        const snap = await getDoc(doc(db, 'photos', photoId))
        if (!snap.exists() || snap.data().status !== 'published') return null
        return mapSnap(snap)
    } catch (error) {
        if (error?.code === 'permission-denied') return null
        throw error
    }
}

export async function listAdminPhotos() {
    const snap = await getDocs(query(collection(db, 'photos'), orderBy('uploadedAt', 'desc')))
    return snap.docs.map(mapSnap)
}

export async function listAdminAlbums() {
    const snap = await getDocs(query(collection(db, 'albums'), orderBy('sortOrder', 'asc')))
    return snap.docs.map(mapSnap)
}

export async function listCleanup() {
    const snap = await getDocs(collection(db, 'photoCleanup'))
    return snap.docs.map(mapSnap)
}

export async function updatePhotoDetails(photoId, fields) {
    await updateDoc(doc(db, 'photos', photoId), {
        caption: fields.caption?.trim() ? fields.caption.trim() : null,
        description: fields.description?.trim() ? fields.description.trim() : null,
        location: fields.location?.trim() ? fields.location.trim() : null,
        albumId: fields.albumId || null,
        tags: tagsFromInput(fields.tags),
        takenAt: takenAtValue(fields.takenAt),
    })
}

export async function setPhotoStatus(photoId, status) {
    await updateDoc(doc(db, 'photos', photoId), { status })
}

export async function reorderPhotos(ids) {
    for (let index = 0; index < ids.length; index += 400) {
        const batch = writeBatch(db)
        ids.slice(index, index + 400).forEach((id, offset) => {
            batch.update(doc(db, 'photos', id), { sortOrder: (index + offset + 1) * 100 })
        })
        await batch.commit()
    }
}

export async function createAlbum(slug, fields) {
    await setDoc(doc(db, 'albums', slug), {
        id: slug,
        slug,
        title: fields.title.trim(),
        description: fields.description?.trim() || null,
        coverPhotoId: fields.coverPhotoId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'draft',
        sortOrder: Date.now(),
    })
}

export async function updateAlbum(albumId, fields) {
    await updateDoc(doc(db, 'albums', albumId), {
        title: fields.title.trim(),
        description: fields.description?.trim() || null,
        coverPhotoId: fields.coverPhotoId || null,
        sortOrder: Number(fields.sortOrder) || 0,
        updatedAt: serverTimestamp(),
    })
}

export async function setAlbumStatus(albumId, status) {
    await updateDoc(doc(db, 'albums', albumId), {
        status,
        updatedAt: serverTimestamp(),
    })
}

export async function deleteArchivedAlbum(albumId) {
    const snap = await getDocs(query(collection(db, 'photos'), where('albumId', '==', albumId)))
    const ids = snap.docs.map((item) => item.id)
    for (let index = 0; index < ids.length; index += 400) {
        const batch = writeBatch(db)
        ids.slice(index, index + 400).forEach((id) => {
            batch.update(doc(db, 'photos', id), { albumId: null })
        })
        await batch.commit()
    }
    await deleteDoc(doc(db, 'albums', albumId))
}

export async function retryCleanup(cleanup) {
    const record = photoFromUpload({
        photoId: cleanup.photoId,
        albumId: null,
        asset: {
            public_id: cleanup.publicId,
            secure_url: cleanup.secureUrl,
            format: cleanup.originalFormat,
            width: cleanup.width,
            height: cleanup.height,
            bytes: cleanup.bytes,
        },
    })
    if (!record) {
        throw new Error('بيانات الأصل غير مكتملة. احذفه صراحةً من Cloudinary إن لم تعد تريده.')
    }
    await savePhoto(record)
    await deleteDoc(doc(db, 'photoCleanup', cleanup.photoId))
}
