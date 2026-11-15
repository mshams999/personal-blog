import assert from 'node:assert/strict'
import test from 'node:test'
import { createIfAbsent, normalizeSlug } from '../src/services/bookSavePlan.js'
import {
    buildLibraryEntry,
    planCurrentReading,
    readingProgress,
} from '../src/services/readingPlan.js'

test('arabic and english titles become stable slugs', () => {
    assert.equal(normalizeSlug('  Atomic   Habits '), 'atomic-habits')
    assert.equal(normalizeSlug('الأيام'), 'الأيام')
})

test('createIfAbsent does not call set when the slug already exists', async () => {
    const writes = []
    const existing = await createIfAbsent(
        async (operation) => operation({
            get: async () => ({ exists: () => true, data: () => ({ title: 'Kept title' }) }),
            set: (ref, data) => writes.push({ id: ref.id, data }),
        }),
        { id: 'exact-edition' },
        { title: 'Replacement' },
    )
    assert.equal(existing.title, 'Kept title')
    assert.deepEqual(writes, [])
})

test('progress is calculated from the current page and page count', () => {
    assert.equal(readingProgress(80, 320).percent, 25)
    assert.equal(readingProgress('', 320).percent, null)
    assert.equal(readingProgress(10, '').percent, null)
    assert.equal(readingProgress(321, 320).error, 'الصفحة الحالية لا يمكن أن تتجاوز عدد الصفحات.')
})

test('a manual book keeps private notes off the book and does not invent a session for want-to-read', () => {
    const result = buildLibraryEntry({
        title: 'Atomic Habits',
        authors: 'James Clear',
        notes: 'A private line.',
        readingStatus: 'want',
        visibility: 'public',
    })
    assert.equal(result.ok, true)
    assert.equal(result.book.readingStatus, 'want')
    assert.equal(result.book.visibility, 'public')
    assert.equal(result.session, null)
    assert.equal(result.noteBody, 'A private line.')
    assert.equal('notes' in result.book, false)
    assert.equal('privateNotes' in result.book, false)
    assert.equal(result.book.isbn13, null)
})

test('currently reading replaces the previous current book', () => {
    const plan = planCurrentReading({
        bookId: 'deep-work',
        sessionId: 'deep-work',
        status: 'reading',
        pointer: { bookId: 'atomic-habits', sessionId: 'atomic-habits' },
    })
    assert.deepEqual(plan.pauseOther, { bookId: 'atomic-habits', sessionId: 'atomic-habits' })
    assert.deepEqual(plan.pointer, { bookId: 'deep-work', sessionId: 'deep-work' })
})

test('finishing the current book clears the pointer and records the session', () => {
    const result = buildLibraryEntry({
        title: 'Atomic Habits',
        authors: 'James Clear',
        readingStatus: 'finished',
        pageCount: '320',
        currentPage: '320',
        formats: ['Paperback'],
        finishedOn: '2026-01-18',
        rating: '5',
    }, new Date('2026-01-01T00:00:00.000Z'))
    assert.equal(result.book.progressPercent, 100)
    assert.equal(result.book.finishedAt.toISOString(), '2026-01-18T00:00:00.000Z')
    assert.equal(result.session.status, 'finished')
    assert.equal(result.session.format, 'physical')
    assert.equal(result.session.rating, 5)
    const plan = planCurrentReading({
        bookId: 'atomic-habits',
        sessionId: 'atomic-habits',
        status: 'finished',
        pointer: { bookId: 'atomic-habits', sessionId: 'atomic-habits' },
    })
    assert.equal(plan.clearPointer, true)
    assert.equal(plan.pointer, null)
})

test('title and author are required and an invalid page is rejected', () => {
    const missing = buildLibraryEntry({ title: ' ', authors: '' })
    assert.equal(missing.ok, false)
    const invalid = buildLibraryEntry({ title: 'Deep Work', authors: 'Cal Newport', pageCount: 'no' })
    assert.equal(invalid.ok, false)
})
