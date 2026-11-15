export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export const PHOTO_ID_PATTERN = /^[A-Za-z0-9]{20,32}$/

export const ALBUM_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const ALLOWED_IMAGE_TYPES = Object.freeze([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'image/tiff',
])

const EXTENSIONS = Object.freeze({
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
    tif: 'image/tiff',
    tiff: 'image/tiff',
})

export function isAllowedImageType(contentType) {
    return ALLOWED_IMAGE_TYPES.includes(String(contentType || '').toLowerCase())
}

export function resolveImageType(file) {
    const type = String(file?.type || '').toLowerCase()
    if (isAllowedImageType(type)) return type
    const name = String(file?.name || '')
    const extension = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : ''
    return EXTENSIONS[extension] || ''
}

export function validateImageFile(file) {
    // file.size is the size the browser declared. It is not proof of the file
    // body. Cloudinary does not sign a byte count, and no upload parameter
    // binds that declaration to the bytes that arrive. The Free plan rejects
    // image uploads over 10 MB at the API. photoFromUpload still refuses a
    // response whose reported bytes are not a positive integer of at most 10 MB.
    if (!file) return { ok: false, error: 'اختر صورة.' }
    const contentType = resolveImageType(file)
    if (!contentType) {
        return { ok: false, error: 'الصيغة غير مدعومة. استخدم JPEG أو PNG أو WebP أو GIF أو HEIC أو TIFF.' }
    }
    if (!Number.isFinite(file.size) || file.size <= 0) return { ok: false, error: 'الملف فارغ.' }
    if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'حجم الصورة أكبر من 10 ميغابايت.' }
    return { ok: true, contentType }
}

export function validateSignRequest({ photoId, bytes, contentType } = {}) {
    // `bytes` is the size the client declared before any signature is issued.
    // Rejecting an over-10 MB declaration avoids signing an upload the caller
    // already admits is too large. It does not prove the POST body, and `bytes`
    // is not included in the Cloudinary signature.
    if (!PHOTO_ID_PATTERN.test(String(photoId || ''))) return { ok: false, error: 'invalid-photo-id' }
    if (!isAllowedImageType(contentType)) return { ok: false, error: 'unsupported-type' }
    if (!Number.isInteger(bytes) || bytes <= 0 || bytes > MAX_IMAGE_BYTES) {
        return { ok: false, error: 'file-too-large' }
    }
    return { ok: true }
}

export function createPhotoId() {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
}

export function publicIdFor(photoId) {
    return `mohamedshams/gallery/${photoId}`
}

const SIGN_RESPONSE_KEYS = Object.freeze([
    'timestamp',
    'public_id',
    'overwrite',
    'asset_folder',
    'folder',
    'api_key',
    'signature',
])

/**
 * Names the browser may copy from the sign response into FormData.
 * Returns null when the response includes transformation, eager, both folder
 * fields, neither folder field, or any other key. The caller appends `file`
 * and nothing else. Declared file size is not one of these fields.
 */
export function uploadFormFieldNames(fields) {
    if (!fields || typeof fields !== 'object') return null
    const present = Object.keys(fields)
    const allowed = new Set(SIGN_RESPONSE_KEYS)
    if (present.some((name) => !allowed.has(name))) return null
    const hasAssetFolder = present.includes('asset_folder')
    const hasFolder = present.includes('folder')
    if (hasAssetFolder === hasFolder) return null
    return SIGN_RESPONSE_KEYS.filter((name) => present.includes(name))
}

/**
 * Draft photo fields from a Cloudinary upload response, or null.
 * Null means the caller must not write a photos document and must not set
 * status to published. photoCleanup is a separate decision and is allowed
 * only when public_id matches this photo.
 *
 * asset.bytes must be an integer in 1..10485760. Cloudinary's Free plan
 * rejects larger images at the API. This check still refuses a response that
 * reports a non-integer, zero, negative, or larger size. The byte count the
 * client declared before signing is not proof of this value.
 * status is always "draft". Firestore rules also refuse a published create.
 */
export function photoFromUpload({ photoId, asset, albumId = null, uploadedAt = null, sortOrder = 0 } = {}) {
    const bytes = asset?.bytes
    if (!Number.isInteger(bytes) || bytes <= 0 || bytes > MAX_IMAGE_BYTES) return null

    const format = String(asset?.format || '').toLowerCase()
    const publicId = asset?.public_id
    const secureUrl = asset?.secure_url
    if (publicId !== publicIdFor(photoId)) return null
    if (typeof secureUrl !== 'string' || !secureUrl.startsWith('https://res.cloudinary.com/')) return null
    if (!/^[a-z0-9]{3,5}$/.test(format)) return null
    if (!Number.isInteger(asset?.width) || asset.width <= 0 || asset.width > 30000) return null
    if (!Number.isInteger(asset?.height) || asset.height <= 0 || asset.height > 30000) return null

    return {
        id: photoId,
        publicId,
        secureUrl,
        originalFormat: format,
        width: asset.width,
        height: asset.height,
        bytes,
        caption: null,
        description: null,
        albumId: albumId || null,
        tags: [],
        location: null,
        takenAt: null,
        uploadedAt,
        status: 'draft',
        sortOrder,
    }
}

/**
 * UI gate for gallery admin routes. Firestore rules and authorizeOwner are
 * the real boundary. An unset owner email fails closed. admin === true is
 * not consulted. galleryOwner must be boolean true, and email_verified must
 * be true. The account email and the token email must both match ownerEmail.
 */
export function galleryOwnerGateAllows({ claims, email, ownerEmail } = {}) {
    const expected = String(ownerEmail ?? '').trim().toLowerCase()
    if (!expected) return false
    const accountEmail = String(email ?? '').trim().toLowerCase()
    const tokenEmail = String(claims?.email ?? '').trim().toLowerCase()
    if (!accountEmail || accountEmail !== expected) return false
    if (!tokenEmail || tokenEmail !== expected) return false
    return claims?.galleryOwner === true && claims?.email_verified === true
}

export function slugifyAlbumTitle(title) {
    return String(title || '')
        .trim()
        .toLowerCase()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
}

export function isAlbumSlug(value) {
    return ALBUM_SLUG_PATTERN.test(String(value || '')) && String(value).length >= 2 && String(value).length <= 80
}
