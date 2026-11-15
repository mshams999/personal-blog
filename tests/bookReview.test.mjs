import assert from 'node:assert/strict'
import test from 'node:test'
import { bookReviewSlug, mapBookReview } from '../src/utils/bookReview.js'

test('a book review uses the library folder and the book slug', () => {
    assert.equal(bookReviewSlug('psychology-of-money'), 'library/psychology-of-money')
})

test('a Storyblok page body becomes the personal review', () => {
    const review = mapBookReview({
        id: 42,
        content: { body: { type: 'doc', content: [{ type: 'paragraph' }] } },
    })
    assert.equal(review.id, 42)
    assert.equal(review.body.type, 'doc')
})

test('a missing story does not invent a review', () => {
    assert.equal(mapBookReview(null), null)
    assert.equal(mapBookReview({ id: 7, content: {} }).body, null)
})
