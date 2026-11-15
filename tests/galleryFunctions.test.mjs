import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_IMAGE_BYTES, photoFromUpload, publicIdFor } from '../src/services/galleryValidation.js'

const PHOTO_ID = 'abcdef0123456789abcd'

function asset(overrides = {}) {
    return {
        public_id: publicIdFor(PHOTO_ID),
        secure_url: `https://res.cloudinary.com/demo/image/upload/v1/${publicIdFor(PHOTO_ID)}.jpg`,
        format: 'jpg',
        width: 4000,
        height: 3000,
        bytes: 800000,
        ...overrides,
    }
}

describe('photo documents from a Cloudinary response', () => {
    it('does not produce a photo document when Cloudinary reports 10485761 bytes', () => {
        // Declared request bytes are not proof of the body. This is the size
        // Cloudinary reported. 10485761 is over 10 MB, so savePhoto must not run.
        const record = photoFromUpload({
            photoId: PHOTO_ID,
            asset: asset({ bytes: 10485761 }),
        })
        assert.equal(record, null)
        assert.equal(MAX_IMAGE_BYTES, 10485760)
    })

    it('does not produce a photo document when bytes are not a positive integer', () => {
        for (const bytes of [0, -1, 1.5, '800000', null, undefined]) {
            assert.equal(photoFromUpload({
                photoId: PHOTO_ID,
                asset: asset({ bytes }),
            }), null, `bytes ${bytes}`)
        }
    })

    it('does not produce a photo document when public_id does not match', () => {
        const record = photoFromUpload({
            photoId: PHOTO_ID,
            asset: asset({ public_id: 'someone/else' }),
        })
        assert.equal(record, null)
    })

    it('produces a draft and never a published document for a valid asset', () => {
        const record = photoFromUpload({
            photoId: PHOTO_ID,
            asset: asset(),
            albumId: 'cairo-nights',
            uploadedAt: 'server-timestamp',
            sortOrder: 100,
        })
        assert.equal(record.status, 'draft')
        assert.notEqual(record.status, 'published')
        assert.equal(record.publicId, publicIdFor(PHOTO_ID))
        assert.equal(record.bytes, 800000)
        assert.equal(record.albumId, 'cairo-nights')
        assert.equal(record.uploadedAt, 'server-timestamp')
    })
})
