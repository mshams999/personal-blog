import { validateSignRequest } from '../../../src/services/galleryValidation.js'
import { buildUploadParams, destroyCloudinaryAsset, signParams, signedUploadResponseFields, uploadUrlFor } from './cloudinarySign.js'
import { authorizeOwner } from './ownerAuth.js'

export function json(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
        },
    })
}

async function readJson(request) {
    const raw = await request.text()
    if (raw.length > 20000) return { error: json(413, { error: 'payload-too-large' }) }
    try {
        return { body: raw ? JSON.parse(raw) : {} }
    } catch {
        return { error: json(400, { error: 'invalid-json' }) }
    }
}

export function createSignHandler(deps) {
    return async function gallerySign(request) {
        if (request.method !== 'POST') return json(405, { error: 'method-not-allowed' })

        const auth = await deps.authorize(request.headers.get('authorization'))
        if (!auth.ok) return json(auth.status, { error: auth.error })

        const parsed = await readJson(request)
        if (parsed.error) return parsed.error

        const check = validateSignRequest(parsed.body)
        if (!check.ok) return json(400, { error: check.error })

        const cloudName = deps.cloudName()
        const apiKey = deps.apiKey()
        const apiSecret = deps.apiSecret()
        if (!cloudName || !apiKey || !apiSecret) return json(500, { error: 'cloudinary-not-configured' })

        const params = buildUploadParams({
            photoId: parsed.body.photoId,
            folderMode: deps.folderMode(),
            now: deps.now(),
        })
        // Returned fields are the signed allowlist plus api_key and signature.
        // transformation, eager, and a declared byte count are not included.
        // Cloudinary would reject a POST that added them, because it recomputes
        // the signature from every field except file, cloud_name, resource_type,
        // and api_key. Declared bytes are not proof of the file body.
        const fields = signedUploadResponseFields(params, apiKey, signParams(params, apiSecret))
        if (!fields) return json(500, { error: 'refused' })

        const payload = { uploadUrl: uploadUrlFor(cloudName), fields }
        if (JSON.stringify(payload).includes(apiSecret)) return json(500, { error: 'refused' })
        return json(200, payload)
    }
}

function cleanupRecord(photo, reason) {
    return {
        photoId: photo.id,
        publicId: photo.publicId,
        secureUrl: photo.secureUrl || '',
        originalFormat: photo.originalFormat || '',
        width: photo.width || 0,
        height: photo.height || 0,
        bytes: photo.bytes || 0,
        reason,
        createdAt: new Date().toISOString(),
    }
}

export function createDestroyHandler(deps) {
    return async function galleryDestroy(request) {
        if (request.method !== 'POST') return json(405, { error: 'method-not-allowed' })

        const auth = await deps.authorize(request.headers.get('authorization'))
        if (!auth.ok) return json(auth.status, { error: auth.error })

        const parsed = await readJson(request)
        if (parsed.error) return parsed.error

        const photoId = String(parsed.body.photoId || '')
        const cleanupId = String(parsed.body.cleanupId || '')
        if (Boolean(photoId) === Boolean(cleanupId)) return json(400, { error: 'choose-one-target' })

        if (cleanupId) return destroyOrphan(deps, cleanupId)
        return destroyArchivedPhoto(deps, photoId)
    }
}

async function destroyArchivedPhoto(deps, photoId) {
    const photo = await deps.readPhoto(photoId)
    if (!photo) return json(404, { error: 'not-found' })
    if (photo.status !== 'archived') return json(409, { error: 'archive-required' })
    if (!isGalleryPublicId(photo.publicId, photo.id || photoId)) return json(400, { error: 'invalid-public-id' })

    try {
        await deps.destroyAsset(photo.publicId)
    } catch {
        return json(502, { error: 'cloudinary-delete-failed' })
    }

    try {
        await deps.deletePhoto(photo.id || photoId)
    } catch {
        await deps.recordCleanup(cleanupRecord({ ...photo, id: photo.id || photoId }, 'destroy-succeeded-doc-remains'))
        return json(500, { error: 'metadata-delete-failed' })
    }

    return json(200, { ok: true })
}

async function destroyOrphan(deps, cleanupId) {
    const cleanup = await deps.readCleanup(cleanupId)
    if (!cleanup) return json(404, { error: 'not-found' })
    if (!isGalleryPublicId(cleanup.publicId, cleanup.photoId)) return json(400, { error: 'invalid-public-id' })

    const photo = cleanup.photoId ? await deps.readPhoto(cleanup.photoId) : null
    if (photo && photo.status !== 'archived') return json(409, { error: 'archive-required' })

    try {
        await deps.destroyAsset(cleanup.publicId)
    } catch {
        return json(502, { error: 'cloudinary-delete-failed' })
    }

    try {
        await deps.deleteCleanup(cleanupId)
        if (photo && photo.status === 'archived') await deps.deletePhoto(photo.id)
    } catch {
        await deps.recordCleanup(cleanupRecord(
            { ...cleanup, id: cleanup.photoId, secureUrl: cleanup.secureUrl },
            'destroy-succeeded-doc-remains',
        ))
        return json(500, { error: 'metadata-delete-failed' })
    }

    return json(200, { ok: true })
}

function isGalleryPublicId(publicId, photoId) {
    return publicId === `mohamedshams/gallery/${photoId}`
}

export function cloudinaryEnv() {
    return {
        cloudName: () => process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '',
        apiKey: () => process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '',
        apiSecret: () => process.env.CLOUDINARY_API_SECRET || '',
        folderMode: () => process.env.CLOUDINARY_FOLDER_MODE || 'dynamic',
        now: () => Date.now(),
    }
}

export async function authorizeFromEnv(authorizationHeader) {
    const { verifyOwnerToken } = await import('./firebaseAdmin.js')
    return authorizeOwner(authorizationHeader, {
        ownerEmail: process.env.GALLERY_OWNER_EMAIL || '',
        verifyIdToken: verifyOwnerToken,
    })
}

export async function destroyWithEnv(publicId) {
    return destroyCloudinaryAsset({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        publicId,
    })
}
