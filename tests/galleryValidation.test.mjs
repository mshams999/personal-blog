import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { buildDeliveryUrl, buildSrcSet } from '../src/services/cloudinaryDelivery.js'
import {
    MAX_IMAGE_BYTES,
    createPhotoId,
    isAlbumSlug,
    slugifyAlbumTitle,
    galleryOwnerGateAllows,
    uploadFormFieldNames,
    validateImageFile,
    validateSignRequest,
} from '../src/services/galleryValidation.js'
import { buildUploadParams, isExactSignedUploadPost, signParams, signedUploadResponseFields } from '../netlify/functions/lib/cloudinarySign.js'
import { authorizeOwner } from '../netlify/functions/lib/ownerAuth.js'
import { createDestroyHandler, createSignHandler } from '../netlify/functions/lib/handlers.js'

const PHOTO_ID = 'abcdef0123456789abcd'

describe('gallery file validation', () => {
    it('accepts a jpeg at exactly 10 MB', () => {
        const result = validateImageFile({ name: 'cairo.jpg', type: 'image/jpeg', size: MAX_IMAGE_BYTES })
        assert.equal(result.ok, true)
        assert.equal(result.contentType, 'image/jpeg')
    })

    it('rejects a declared size over 10 MB before any signature', () => {
        // file.size is the declared size, not proof of the file body.
        // 10485761 is one byte over the Free-plan image cap. Signing is not reached.
        assert.equal(MAX_IMAGE_BYTES + 1, 10485761)
        const result = validateImageFile({ name: 'big.jpg', type: 'image/jpeg', size: 10485761 })
        assert.equal(result.ok, false)
    })

    it('rejects unsupported formats and accepts heic by extension', () => {
        assert.equal(validateImageFile({ name: 'icon.svg', type: 'image/svg+xml', size: 1000 }).ok, false)
        const heic = validateImageFile({ name: 'IMG.HEIC', type: '', size: 1000 })
        assert.equal(heic.ok, true)
        assert.equal(heic.contentType, 'image/heic')
    })

    it('rejects a sign request that lies about size or type', () => {
        // Declared bytes are rejected before signParams. They are not proof of the body.
        assert.equal(validateSignRequest({ photoId: PHOTO_ID, bytes: 10485761, contentType: 'image/jpeg' }).error, 'file-too-large')
        assert.equal(validateSignRequest({ photoId: PHOTO_ID, bytes: 100, contentType: 'image/svg+xml' }).error, 'unsupported-type')
        assert.equal(validateSignRequest({ photoId: '../secret', bytes: 100, contentType: 'image/jpeg' }).error, 'invalid-photo-id')
    })

    it('creates photo ids that fit the public id prefix', () => {
        const id = createPhotoId()
        assert.match(id, /^[a-f0-9]{32}$/)
    })
})

describe('album slugs', () => {
    it('builds a latin slug and rejects arabic-only titles', () => {
        assert.equal(slugifyAlbumTitle('Cairo Nights'), 'cairo-nights')
        assert.equal(slugifyAlbumTitle('القاهرة'), '')
        assert.equal(isAlbumSlug('cairo-nights'), true)
        assert.equal(isAlbumSlug('Cairo'), false)
    })
})

describe('delivery urls', () => {
    it('builds responsive urls without changing the stored original', () => {
        const url = buildDeliveryUrl('demo', `mohamedshams/gallery/${PHOTO_ID}`, 800)
        assert.equal(url, `https://res.cloudinary.com/demo/image/upload/f_auto/q_auto/c_limit,w_800/mohamedshams/gallery/${PHOTO_ID}`)
        const srcset = buildSrcSet('demo', `mohamedshams/gallery/${PHOTO_ID}`, 'grid')
        assert.match(srcset, /480w/)
        assert.match(srcset, /1200w/)
        assert.equal(buildDeliveryUrl('', `mohamedshams/gallery/${PHOTO_ID}`, 800), '')
    })
})

describe('signed upload parameters', () => {
    it('matches the documented Cloudinary signature example', () => {
        assert.equal(signParams({ timestamp: 1315060510 }, 'abcd'), 'a21ad0f63beb4de2e5575204b79ab90bffb02c10')
    })

    it('keeps the original and refuses overwrite', () => {
        const params = buildUploadParams({ photoId: PHOTO_ID, folderMode: 'dynamic', now: 1_700_000_000_000 })
        assert.equal(params.public_id, `mohamedshams/gallery/${PHOTO_ID}`)
        assert.equal(params.overwrite, 'false')
        assert.equal(params.asset_folder, 'mohamedshams/gallery')
        assert.equal(Object.hasOwn(params, 'transformation'), false)
        assert.equal(Object.hasOwn(params, 'eager'), false)

        const fixed = buildUploadParams({ photoId: PHOTO_ID, folderMode: 'fixed', now: 1_700_000_000_000 })
        assert.equal(fixed.folder, 'mohamedshams/gallery')
        assert.equal(Object.hasOwn(fixed, 'asset_folder'), false)
        assert.equal(Object.hasOwn(params, 'bytes'), false)
    })

    it('rejects transformation or eager because Cloudinary would recompute a different signature', () => {
        // Cloudinary recomputes the signature from every POST field except file,
        // cloud_name, resource_type, and api_key. transformation and eager are
        // signed when present, so a digest that omitted them will not match and
        // Cloudinary rejects the upload. This test does not call the live API.
        // Declared bytes are not in the signature and do not prove the file body.
        const params = buildUploadParams({ photoId: PHOTO_ID, folderMode: 'dynamic', now: 1_700_000_000_000 })
        const secret = 'server-secret'
        const signature = signParams(params, secret)
        const posted = [...Object.keys(params), 'file']
        assert.equal(isExactSignedUploadPost(posted), true)
        assert.equal(isExactSignedUploadPost([...Object.keys(params), 'folder', 'file']), false)

        for (const extra of ['transformation', 'eager']) {
            assert.equal(isExactSignedUploadPost([...posted, extra]), false)
            assert.notEqual(signParams({ ...params, [extra]: 'c_limit,w_10' }, secret), signature)
        }

        const fields = signedUploadResponseFields(params, 'public-key', signature)
        assert.deepEqual(Object.keys(fields).sort(), ['api_key', 'asset_folder', 'overwrite', 'public_id', 'signature', 'timestamp'])
        assert.equal(signedUploadResponseFields({ ...params, transformation: 'c_limit,w_10' }, 'public-key', signature), null)
        assert.equal(signedUploadResponseFields({ ...params, eager: 'w_10' }, 'public-key', signature), null)
        assert.equal(uploadFormFieldNames(fields).includes('transformation'), false)
        assert.equal(uploadFormFieldNames({ ...fields, transformation: 'c_limit,w_10' }), null)
        assert.equal(uploadFormFieldNames({ ...fields, eager: 'w_10' }), null)
    })
})

describe('owner authorization', () => {
    const owner = 'owner@example.com'
    const asOwner = (decoded) => authorizeOwner('Bearer token', {
        ownerEmail: owner,
        verifyIdToken: async () => decoded,
    })

    it('rejects a missing token', async () => {
        assert.equal((await authorizeOwner('', { ownerEmail: owner, verifyIdToken: async () => ({}) })).status, 401)
    })

    it('rejects an expired token', async () => {
        const result = await authorizeOwner('Bearer expired', {
            ownerEmail: owner,
            verifyIdToken: async () => {
                const error = new Error('expired')
                error.code = 'auth/id-token-expired'
                throw error
            },
        })
        assert.equal(result.status, 401)
        assert.equal(result.error, 'invalid-token')
    })

    it('rejects an admin claim without galleryOwner', async () => {
        const result = await asOwner({ admin: true, email_verified: true, email: owner, uid: 'owner' })
        assert.equal(result.ok, false)
        assert.equal(result.status, 403)
    })

    it('rejects galleryOwner on the wrong email', async () => {
        const result = await asOwner({
            galleryOwner: true,
            admin: true,
            email_verified: true,
            email: 'other@example.com',
        })
        assert.equal(result.status, 403)
    })

    it('rejects an unverified galleryOwner', async () => {
        const result = await asOwner({ galleryOwner: true, email_verified: false, email: owner })
        assert.equal(result.status, 403)
    })

    it('rejects the string galleryOwner claim', async () => {
        const result = await asOwner({ galleryOwner: 'true', email_verified: true, email: owner })
        assert.equal(result.status, 403)
    })

    it('fails closed when GALLERY_OWNER_EMAIL is missing', async () => {
        const result = await authorizeOwner('Bearer token', {
            ownerEmail: '',
            verifyIdToken: async () => ({ galleryOwner: true, email_verified: true, email: owner }),
        })
        assert.equal(result.status, 500)
        assert.equal(result.error, 'owner-not-configured')
    })

    it('fails closed when Firebase admin credentials are missing', async () => {
        const result = await authorizeOwner('Bearer token', {
            ownerEmail: owner,
            verifyIdToken: async () => {
                const error = new Error('missing credentials')
                error.code = 'gallery/not-configured'
                throw error
            },
        })
        assert.equal(result.status, 500)
        assert.equal(result.ok, false)
    })

    it('accepts only galleryOwner with a verified matching email', async () => {
        const result = await asOwner({
            galleryOwner: true,
            email_verified: true,
            email: 'Owner@Example.com',
            uid: 'owner',
        })
        assert.equal(result.ok, true)
        assert.equal(result.uid, 'owner')
        assert.equal(galleryOwnerGateAllows({
            claims: { galleryOwner: true, email_verified: true, email: 'Owner@Example.com', admin: true },
            email: 'owner@example.com',
            ownerEmail: owner,
        }), true)
        assert.equal(galleryOwnerGateAllows({
            claims: { admin: true, email_verified: true, email: owner },
            email: owner,
            ownerEmail: owner,
        }), false)
        assert.equal(galleryOwnerGateAllows({
            claims: { galleryOwner: true, email_verified: true, email: owner },
            email: owner,
            ownerEmail: '',
        }), false)
        assert.equal(galleryOwnerGateAllows({
            claims: { galleryOwner: 'true', email_verified: true, email: owner },
            email: owner,
            ownerEmail: owner,
        }), false)
        assert.equal(galleryOwnerGateAllows({
            claims: { galleryOwner: true, email_verified: false, email: owner },
            email: owner,
            ownerEmail: owner,
        }), false)
    })
})

function signDeps(overrides = {}) {
    return {
        authorize: async () => ({ ok: true, uid: 'owner' }),
        cloudName: () => 'demo',
        apiKey: () => 'public-key',
        apiSecret: () => 'server-secret',
        folderMode: () => 'dynamic',
        now: () => 1_700_000_000_000,
        ...overrides,
    }
}

describe('gallery sign handler', () => {
    it('returns a signature and never the API secret', async () => {
        const response = await createSignHandler(signDeps())(new Request('http://local/sign', {
            method: 'POST',
            headers: { authorization: 'Bearer token' },
            body: JSON.stringify({ photoId: PHOTO_ID, bytes: 1000, contentType: 'image/jpeg' }),
        }))
        const body = await response.json()
        assert.equal(response.status, 200)
        assert.equal(body.fields.overwrite, 'false')
        assert.equal(body.fields.public_id, `mohamedshams/gallery/${PHOTO_ID}`)
        assert.deepEqual(Object.keys(body.fields).sort(), ['api_key', 'asset_folder', 'overwrite', 'public_id', 'signature', 'timestamp'])
        assert.equal(Object.hasOwn(body.fields, 'transformation'), false)
        assert.equal(Object.hasOwn(body.fields, 'eager'), false)
        assert.equal(JSON.stringify(body).includes('server-secret'), false)
    })

    it('returns folder and not asset_folder when folder mode is fixed', async () => {
        const response = await createSignHandler(signDeps({ folderMode: () => 'fixed' }))(new Request('http://local/sign', {
            method: 'POST',
            headers: { authorization: 'Bearer token' },
            body: JSON.stringify({ photoId: PHOTO_ID, bytes: 1000, contentType: 'image/jpeg' }),
        }))
        const body = await response.json()
        assert.equal(response.status, 200)
        assert.equal(body.fields.folder, 'mohamedshams/gallery')
        assert.equal(Object.hasOwn(body.fields, 'asset_folder'), false)
        assert.deepEqual(Object.keys(body.fields).sort(), ['api_key', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp'])
    })

    it('fails closed when the Cloudinary secret is missing', async () => {
        const response = await createSignHandler(signDeps({ apiSecret: () => '' }))(new Request('http://local/sign', {
            method: 'POST',
            headers: { authorization: 'Bearer token' },
            body: JSON.stringify({ photoId: PHOTO_ID, bytes: 1000, contentType: 'image/jpeg' }),
        }))
        assert.equal(response.status, 500)
        assert.equal((await response.json()).error, 'cloudinary-not-configured')
    })

    it('rejects an unauthorized caller before signing', async () => {
        const response = await createSignHandler(signDeps({
            authorize: async () => ({ ok: false, status: 403, error: 'not-owner' }),
        }))(new Request('http://local/sign', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID, bytes: 1000, contentType: 'image/jpeg' }),
        }))
        assert.equal(response.status, 403)
    })

    it('rejects an oversized declared file before signing', async () => {
        // The declared size is not proof of the file body. The handler refuses
        // to sign when the caller admits the file is over 10 MB (10485761).
        const response = await createSignHandler(signDeps())(new Request('http://local/sign', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID, bytes: 10485761, contentType: 'image/jpeg' }),
        }))
        assert.equal(response.status, 400)
        const body = await response.json()
        assert.equal(body.error, 'file-too-large')
        assert.equal(body.fields, undefined)
    })
})

describe('gallery destroy handler', () => {
    function destroyDeps(photo, overrides = {}) {
        const calls = []
        const deps = {
            authorize: async () => ({ ok: true, uid: 'owner' }),
            readPhoto: async () => photo,
            readCleanup: async () => null,
            deletePhoto: async (id) => calls.push(['deletePhoto', id]),
            deleteCleanup: async (id) => calls.push(['deleteCleanup', id]),
            recordCleanup: async (record) => calls.push(['recordCleanup', record.reason]),
            destroyAsset: async (publicId) => calls.push(['destroy', publicId]),
            ...overrides,
        }
        return { deps, calls }
    }

    const archived = {
        id: PHOTO_ID,
        status: 'archived',
        publicId: `mohamedshams/gallery/${PHOTO_ID}`,
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/file.jpg',
        originalFormat: 'jpg',
        width: 100,
        height: 100,
        bytes: 100,
    }

    it('does not destroy a photo that is still published', async () => {
        const { deps, calls } = destroyDeps({ ...archived, status: 'published' })
        const response = await createDestroyHandler(deps)(new Request('http://local/destroy', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID }),
        }))
        assert.equal(response.status, 409)
        assert.deepEqual(calls, [])
    })

    it('leaves Firestore in place when Cloudinary refuses the delete', async () => {
        const { deps, calls } = destroyDeps(archived, {
            destroyAsset: async () => {
                calls.push(['destroy'])
                throw new Error('no')
            },
        })
        const response = await createDestroyHandler(deps)(new Request('http://local/destroy', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID }),
        }))
        assert.equal(response.status, 502)
        assert.deepEqual(calls, [['destroy']])
    })

    it('records cleanup when the asset is gone but the document delete fails', async () => {
        const { deps, calls } = destroyDeps(archived, {
            deletePhoto: async () => {
                calls.push(['deletePhoto'])
                throw new Error('write failed')
            },
        })
        const response = await createDestroyHandler(deps)(new Request('http://local/destroy', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID }),
        }))
        assert.equal(response.status, 500)
        assert.deepEqual(calls.map((call) => call[0]), ['destroy', 'deletePhoto', 'recordCleanup'])
    })

    it('rejects an anonymous destroy', async () => {
        const { deps, calls } = destroyDeps(archived, {
            authorize: async () => ({ ok: false, status: 401, error: 'invalid-token' }),
        })
        const response = await createDestroyHandler(deps)(new Request('http://local/destroy', {
            method: 'POST',
            body: JSON.stringify({ photoId: PHOTO_ID }),
        }))
        assert.equal(response.status, 401)
        assert.deepEqual(calls, [])
    })
})

describe('secret names stay off the client', () => {
    it('does not reference a Vite-exposed Cloudinary secret', () => {
        const files = [
            'src/services/galleryUpload.js',
            'src/services/galleryService.js',
            'src/services/cloudinaryDelivery.js',
            'src/services/galleryValidation.js',
            'src/components/GalleryOwnerRoute.jsx',
            'src/components/ProtectedRoute.jsx',
            'netlify/functions/lib/handlers.js',
            'netlify/functions/lib/cloudinarySign.js',
            'netlify/functions/lib/ownerAuth.js',
            'netlify/functions/lib/firebaseAdmin.js',
            'netlify/functions/gallery-sign.js',
            'scripts/set-gallery-owner-claim.mjs',
        ]
        files.forEach((file) => {
            const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
            assert.equal(source.includes('VITE_CLOUDINARY_API_SECRET'), false, file)
        })
    })
})
