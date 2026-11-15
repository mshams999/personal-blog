import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import {
    analyzeGoodreadsImport,
    entriesToImport,
    goodreadsBookDocument,
    selectionIssues,
} from '../src/utils/goodreadsImport.js'

const csvPath = '/Users/mohamedshams/Downloads/goodreads_library_export.csv'
const csv = fs.readFileSync(csvPath, 'utf8')

test('the Goodreads export parses all 56 rows without inventing a start date', () => {
    const report = analyzeGoodreadsImport(csv)
    assert.equal(report.records.length, 56)
    assert.equal(report.records.filter((record) => record.shelf === 'read').length, 42)
    assert.equal(report.records.filter((record) => record.shelf === 'to-read').length, 12)
    assert.equal(report.records.filter((record) => record.needsChoice).length, 2)
    assert.equal(report.records.filter((record) => record.draft.startedAt != null).length, 0)
    assert.ok(report.records.every((record) => record.valid))

    const psychology = report.records.find((record) => record.draft.title.startsWith('The Psychology of Money'))
    assert.equal(psychology.draft.finishedAt, '2026-11-15')
    assert.equal(psychology.draft.rating, 4)
    assert.equal(psychology.draft.pageCount, 242)
    assert.equal(psychology.draft.formats[0], 'Paperback')
    assert.equal(psychology.draft.isbn13, null)
    assert.match(psychology.note, /سيكولوجية الفلوس/)

    const crime = report.records.find((record) => record.draft.title === 'الجريمة والعقاب')
    assert.deepEqual(crime.draft.authors, ['Fyodor Dostoevsky', 'فيودور دوستويفسكي'])
    assert.equal(crime.needsChoice, true)
    assert.equal(crime.draft.readingStatus, null)

    const oneThing = report.records.find((record) => record.draft.title.startsWith('The One Thing'))
    assert.equal(oneThing.draft.isbn13, '9781885167774')
    assert.equal(oneThing.draft.isbn10, '1885167776')
    assert.equal(oneThing.draft.formats[0], 'Hardcover')

    const readWithoutDate = report.records.filter((record) => record.shelf === 'read' && !record.draft.finishedAt)
    assert.equal(readWithoutDate.length, 34)
    const document = goodreadsBookDocument(readWithoutDate[0])
    assert.equal(document.startedAt, null)
    assert.equal(document.finishedAt, null)
    assert.equal(document.readingStatus, 'finished')
    assert.equal(document.visibility, 'unlisted')
    assert.equal(document.description, null)
    assert.equal(document.coverUrl, null)
})

test('finished books are not given a reading session document', () => {
    const report = analyzeGoodreadsImport(csv)
    const finished = report.records.find((record) => record.draft.finishedAt)
    const document = goodreadsBookDocument(finished)
    assert.equal('progress' in document, false)
    assert.equal(document.startedAt, null)
    assert.ok(document.finishedAt instanceof Date)
})

test('an existing title and author is skipped instead of overwritten', () => {
    const report = analyzeGoodreadsImport(csv, [{
        id: 'the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness',
        title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
        authors: ['Morgan Housel'],
        isbn13: null,
        isbn10: null,
    }])
    const psychology = report.records.find((record) => record.draft.title.startsWith('The Psychology of Money'))
    assert.equal(psychology.duplicate.source, 'library')
    assert.equal(psychology.duplicate.reason, 'title-author')
    const selected = new Set(report.records.map((record) => record.rowNumber))
    const entries = entriesToImport(report.records, selected, {})
    assert.equal(entries.some((entry) => entry.draft.title.startsWith('The Psychology of Money')), false)
})

test('the two currently-reading books need an explicit choice and only one may stay current', () => {
    const report = analyzeGoodreadsImport(csv)
    const current = report.records.filter((record) => record.needsChoice)
    const selected = new Set(current.map((record) => record.rowNumber))
    assert.equal(selectionIssues(report.records, selected, {}).length, 1)
    const bothReading = Object.fromEntries(current.map((record) => [record.rowNumber, 'reading']))
    assert.match(selectionIssues(report.records, selected, bothReading)[0], /كتاب واحد/)
    const choices = { [current[0].rowNumber]: 'reading', [current[1].rowNumber]: 'paused' }
    assert.deepEqual(selectionIssues(report.records, selected, choices), [])
    const entries = entriesToImport(report.records, selected, choices)
    assert.deepEqual(entries.map((entry) => entry.draft.readingStatus).sort(), ['paused', 'reading'])
    assert.equal(goodreadsBookDocument(entries.find((entry) => entry.draft.readingStatus === 'reading')).startedAt, null)
})

test('quoted commas, empty ISBN cells, and Arabic text survive parsing', () => {
    const sample = [
        'Title,Author,Additional Authors,ISBN,ISBN13,My Rating,Publisher,Binding,Number of Pages,Year Published,Date Read,Exclusive Shelf,My Review,Bookshelves',
        '"كتاب، وفاصلة",كاتب,مؤلف آخر,="""",="""",0,دار,Paperback,10,2020,2024/01/02,read,"مراجعة، فيها فاصلة",',
    ].join('\n')
    const report = analyzeGoodreadsImport(sample)
    const record = report.records[0]
    assert.equal(record.draft.title, 'كتاب، وفاصلة')
    assert.deepEqual(record.draft.authors, ['كاتب', 'مؤلف آخر'])
    assert.equal(record.draft.isbn13, null)
    assert.equal(record.draft.finishedAt, '2024-01-02')
    assert.equal(record.note, 'مراجعة، فيها فاصلة')
    assert.equal(record.draft.rating, null)
})
