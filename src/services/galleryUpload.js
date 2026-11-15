import { auth } from '../config/firebase'
import { buildDeliveryUrl } from './cloudinaryDelivery.js'
import {
    photoFromUpload,
    saveCleanup,
    savePhoto,
} from './galleryService.js'
import { createPhotoId, publicIdFor, uploadFormFieldNames, validateImageFile } from './galleryValidation.js'

const SIGN_ERRORS = {
    'missing-token': 'انتهت الجلسة. سجّل الدخول من جديد.',
    'invalid-token': 'انتهت الجلسة. سجّل الدخول من جديد.',
    'not-owner': 'هذا الحساب غير مصرح له بالرفع.',
    'file-too-large': 'حجم الصورة أكبر من 10 ميغابايت.',
    'unsupported-type': 'الصيغة غير مدعومة.',
    'invalid-photo-id': 'تعذّر تجهيز الصورة.',
    'cloudinary-not-configured': 'رفع الصور غير مهيأ على الخادم.',
    'owner-not-configured': 'رفع الصور غير مهيأ على الخادم.',
    'archive-required': 'أرشف الصورة قبل حذفها.',
    'cloudinary-delete-failed': 'تعذّر حذف الأصل من Cloudinary. بقيت البيانات كما هي.',
    'metadata-delete-failed': 'حُذف الأصل من Cloudinary وتعذّر حذف بيانه. ستجده في قائمة الاستعادة.',
}

function functionError(payload, fallback) {
    return new Error(SIGN_ERRORS[payload?.error] || fallback)
}

async function ownerToken() {
    const user = auth.currentUser
    if (!user) throw new Error('سجّل الدخول أولاً.')
    return user.getIdToken(true)
}

async function postFunction(name, token, body) {
    const response = await fetch(`/.netlify/functions/${name}`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw functionError(payload, 'تعذّر إكمال الطلب.')
    return payload
}

function postToCloudinary({ uploadUrl, fields, file, onProgress }) {
    const names = uploadFormFieldNames(fields)
    if (!names) return Promise.reject(new Error('تعذّر تجهيز الصورة.'))
    return new Promise((resolve, reject) => {
        const body = new FormData()
        // Append only the server-returned allowlist, then the file.
        // Do not add transformation, eager, or a declared byte count.
        names.forEach((key) => body.append(key, fields[key]))
        body.append('file', file)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', uploadUrl)
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total)
        }
        xhr.onload = () => {
            let payload = {}
            try {
                payload = JSON.parse(xhr.responseText)
            } catch {
                payload = {}
            }
            if (xhr.status >= 200 && xhr.status < 300) resolve(payload)
            else reject(new Error(payload?.error?.message || 'تعذّر رفع الصورة إلى Cloudinary.'))
        }
        xhr.onerror = () => reject(new Error('تعذّر الاتصال بـ Cloudinary.'))
        xhr.send(body)
    })
}

async function rememberOrphan(orphan) {
    try {
        await saveCleanup(orphan)
        return { ...orphan, saved: true }
    } catch {
        return { ...orphan, saved: false }
    }
}

export async function uploadPhotoFile(file, { albumId = null, onProgress } = {}) {
    const check = validateImageFile(file)
    if (!check.ok) throw new Error(check.error)

    const photoId = createPhotoId()
    const token = await ownerToken()
    const signed = await postFunction('gallery-sign', token, {
        photoId,
        bytes: file.size,
        contentType: check.contentType,
    })
    const asset = await postToCloudinary({
        uploadUrl: signed.uploadUrl,
        fields: signed.fields,
        file,
        onProgress,
    })
    const record = photoFromUpload({ photoId, asset, albumId })
    // file.size was only the declared size. A Cloudinary response whose bytes
    // are not a positive integer of at most 10 MB, or whose public_id does not
    // match, must not call savePhoto and must not create a published document.
    // photoCleanup is recorded only when the public_id matches.
    if (!record || record.status !== 'draft') {
        const matches = asset?.public_id === publicIdFor(photoId)
        const orphan = matches
            ? await rememberOrphan({
                photoId,
                publicId: asset.public_id,
                secureUrl: asset.secure_url || '',
                originalFormat: String(asset.format || '').toLowerCase(),
                width: Number.isInteger(asset.width) ? asset.width : 0,
                height: Number.isInteger(asset.height) ? asset.height : 0,
                bytes: Number.isInteger(asset.bytes) ? asset.bytes : 0,
                reason: 'rejected-after-upload',
            })
            : { photoId, publicId: asset?.public_id || '', saved: false }
        const error = new Error('رُفضت الصورة بعد الرفع. لم يُحذف الأصل، ويمكنك حذفه من قائمة الاستعادة.')
        error.orphan = orphan
        throw error
    }

    try {
        await savePhoto(record)
    } catch (cause) {
        const orphan = await rememberOrphan({
            photoId,
            publicId: record.publicId,
            secureUrl: record.secureUrl,
            originalFormat: record.originalFormat,
            width: record.width,
            height: record.height,
            bytes: record.bytes,
            reason: 'firestore-write-failed',
        })
        const error = new Error('حُفظ الأصل في Cloudinary وتعذّر حفظ بياناته. لم يُحذف الأصل.')
        error.orphan = orphan
        error.cause = cause
        throw error
    }

    return { id: photoId, publicId: record.publicId }
}

export async function destroyArchivedPhoto(photoId) {
    const token = await ownerToken()
    return postFunction('gallery-destroy', token, { photoId })
}

export async function destroyOrphan(cleanupId) {
    const token = await ownerToken()
    return postFunction('gallery-destroy', token, { cleanupId })
}

export function previewUrl(cloudName, publicId) {
    return buildDeliveryUrl(cloudName, publicId, 400)
}
