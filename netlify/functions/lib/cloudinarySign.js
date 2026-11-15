import { createHash } from 'node:crypto'
import { publicIdFor } from '../../../src/services/galleryValidation.js'

const GALLERY_FOLDER = 'mohamedshams/gallery'

/**
 * Cloudinary signed-upload string:
 * sort the posted parameter names, join as name=value with "&",
 * append the API secret, then SHA-1 hex.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export function signParams(params, apiSecret) {
    const serialized = Object.keys(params)
        .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&')
    return createHash('sha1').update(`${serialized}${apiSecret}`).digest('hex')
}

export function buildUploadParams({ photoId, folderMode = 'dynamic', now = Date.now() }) {
    const params = {
        timestamp: Math.round(now / 1000),
        public_id: publicIdFor(photoId),
        overwrite: 'false',
    }
    if (folderMode === 'fixed') params.folder = GALLERY_FOLDER
    else params.asset_folder = GALLERY_FOLDER
    return params
}

const SIGNED_UPLOAD_FIELDS = ['timestamp', 'public_id', 'overwrite']

/**
 * True only when `fieldNames` is exactly the signed upload allowlist plus `file`.
 *
 * Cloudinary recomputes the signature from every POST field except `file`,
 * `cloud_name`, `resource_type`, and `api_key`. `file` is unsigned, so it is
 * the one extra name this check allows. `api_key` and `signature` are not part
 * of this set: api_key is excluded from the string to sign, and signature is
 * the digest itself. The sign response adds those two; the browser then appends
 * `file` and no other field.
 *
 * Adding `transformation` or `eager` makes this return false. Signing the
 * enlarged parameter set also produces a different digest, and Cloudinary
 * rejects the upload for that reason. This function does not call Cloudinary.
 * There is no upload parameter that binds a declared byte count to the file
 * body, so `bytes` is not part of the allowlist and does not prove the body.
 */
export function isExactSignedUploadPost(fieldNames) {
    const names = [...fieldNames]
    const seen = new Set(names)
    if (seen.size !== names.length) return false

    const folderFields = names.filter((name) => name === 'asset_folder' || name === 'folder')
    if (folderFields.length !== 1) return false

    const expected = new Set([...SIGNED_UPLOAD_FIELDS, folderFields[0], 'file'])
    if (seen.size !== expected.size) return false
    for (const name of seen) {
        if (!expected.has(name)) return false
    }
    return true
}

/**
 * Sign-handler payload: the signed allowlist plus api_key and signature.
 * Exactly one of asset_folder or folder. Never both, and never transformation,
 * eager, or bytes. overwrite stays the string "false".
 */
export function signedUploadResponseFields(params, apiKey, signature) {
    if (!params || typeof params !== 'object') return null
    const keys = Object.keys(params)
    const hasAssetFolder = keys.includes('asset_folder')
    const hasFolder = keys.includes('folder')
    if (hasAssetFolder === hasFolder) return null

    const folderKey = hasAssetFolder ? 'asset_folder' : 'folder'
    const allowed = new Set([...SIGNED_UPLOAD_FIELDS, folderKey])
    if (keys.length !== allowed.size || keys.some((key) => !allowed.has(key))) return null
    if (params.overwrite !== 'false') return null
    if (!params.public_id || params.timestamp === undefined || params.timestamp === null) return null

    return {
        timestamp: String(params.timestamp),
        public_id: String(params.public_id),
        overwrite: 'false',
        [folderKey]: String(params[folderKey]),
        api_key: apiKey,
        signature,
    }
}

export function uploadUrlFor(cloudName) {
    return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
}

export function destroyUrlFor(cloudName) {
    return `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
}

export async function destroyCloudinaryAsset({
    cloudName,
    apiKey,
    apiSecret,
    publicId,
    fetchImpl = fetch,
    now = Date.now(),
}) {
    const params = {
        public_id: publicId,
        timestamp: Math.round(now / 1000),
        invalidate: 'true',
    }
    const body = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => body.set(key, String(value)))
    body.set('api_key', apiKey)
    body.set('signature', signParams(params, apiSecret))

    const response = await fetchImpl(destroyUrlFor(cloudName), {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || (payload.result !== 'ok' && payload.result !== 'not found')) {
        const error = new Error(payload?.error?.message || 'Cloudinary rejected the delete.')
        error.code = 'gallery/destroy-failed'
        throw error
    }
    return payload
}
