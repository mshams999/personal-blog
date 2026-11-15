import assert from 'node:assert/strict'
import test from 'node:test'
import { buildReadingJourney, durationDays, durationLabel } from '../src/utils/readingJourney.js'

const book = (id, coverUrl = `https://covers.example/${id}.jpg`) => ({ id, coverUrl, title: id, authors: ['Author'] })

function finished(key, startedAt, finishedAt, bookId = key) {
    return {
        key,
        title: key,
        authors: ['Author'],
        status: 'finished',
        startedAt,
        finishedAt,
        book: book(bookId),
    }
}

function current(key, startedAt, bookId = key) {
    return {
        state: 'ready',
        book: book(bookId),
        progress: { currentPage: 12, pageCount: 300, percent: 4 },
        session: {
            key,
            bookId,
            title: key,
            authors: ['Author'],
            status: 'reading',
            startedAt,
            finishedAt: null,
            progress: { currentPage: 12, pageCount: 300, percent: 4 },
        },
    }
}

test('finished sessions follow the start date, and a reread stays a separate milestone', () => {
    const journey = buildReadingJourney({
        now: new Date('2026-06-01T00:00:00.000Z'),
        year: 2026,
        finished: [
            finished('second', '2026-03-01T00:00:00.000Z', '2026-03-10T00:00:00.000Z'),
            finished('first-again', '2026-05-01T00:00:00.000Z', '2026-05-02T00:00:00.000Z', 'first'),
            finished('first', '2026-01-01T00:00:00.000Z', '2026-01-20T00:00:00.000Z', 'first'),
        ],
    })
    assert.deepEqual(journey.milestones.map((item) => item.key), ['first', 'second', 'first-again'])
    assert.equal(journey.milestones[0].durationDays, 20)
    assert.equal(journey.milestones[0].href, '/library/first')
})

test('the current session closes the year even when it started first', () => {
    const journey = buildReadingJourney({
        now: new Date('2026-11-15T00:00:00.000Z'),
        year: 2026,
        finished: [finished('later', '2026-04-01T00:00:00.000Z', '2026-04-08T00:00:00.000Z')],
        current: current('now', '2026-01-02T00:00:00.000Z'),
    })
    assert.deepEqual(journey.milestones.map((item) => item.key), ['later', 'now'])
    assert.equal(journey.milestones.at(-1).current, true)
    assert.equal(journey.milestones.at(-1).finishedAt, null)
    assert.equal(journey.milestones.at(-1).durationDays, null)
    assert.equal(journey.milestones.at(-1).progress.currentPage, 12)
})

test('a past year does not borrow a book that started this year', () => {
    const journey = buildReadingJourney({
        now: new Date('2026-11-15T00:00:00.000Z'),
        year: 2025,
        finished: [finished('old', '2025-12-01T00:00:00.000Z', '2025-12-20T00:00:00.000Z')],
        current: current('now', '2026-01-02T00:00:00.000Z'),
    })
    assert.deepEqual(journey.milestones.map((item) => item.key), ['old'])
    assert.deepEqual(journey.years, [2026, 2025])
})

test('the present year still ends on a book that was started earlier', () => {
    const journey = buildReadingJourney({
        now: new Date('2026-11-15T00:00:00.000Z'),
        year: 2026,
        finished: [finished('old', '2025-12-01T00:00:00.000Z', '2025-12-20T00:00:00.000Z')],
        current: current('now', '2025-11-01T00:00:00.000Z'),
    })
    assert.deepEqual(journey.milestones.map((item) => item.key), ['now'])
    assert.equal(journey.milestones[0].finishedAt, null)
})

test('duration counts inclusive days and does not invent a finish date', () => {
    const start = new Date('2026-01-01T00:00:00.000Z')
    const finish = new Date('2026-01-10T00:00:00.000Z')
    assert.equal(durationDays(start, finish), 10)
    assert.equal(durationDays(start, start), 1)
    assert.equal(durationDays(start, null), null)
    assert.equal(durationLabel(1), 'يوم واحد')
    assert.equal(durationLabel(2), 'يومان')
    assert.equal(durationLabel(10), '10 أيام')
    assert.equal(durationLabel(null), '')
})
