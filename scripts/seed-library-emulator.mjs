/**
 * Local emulator fixtures for the public library UI.
 *
 * This script has no production mode. It exits unless FIRESTORE_EMULATOR_HOST
 * is set, and it never loads a service account. The 39 preserved entries in
 * src/pages/ReadingLibrary.jsx are not seeded here.
 */

import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

if (process.argv.includes('--allow-production')) {
    console.error('This script has no production mode.')
    process.exit(1)
}

if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.error('Refusing to write. Set FIRESTORE_EMULATOR_HOST so this can reach only the local emulator.')
    process.exit(1)
}

const projectId = 'demo-reading-library'
initializeApp({ projectId })
const db = getFirestore()
const now = Timestamp.fromDate(new Date('2026-03-01T00:00:00Z'))
const earlier = Timestamp.fromDate(new Date('2025-11-02T00:00:00Z'))
const finished = Timestamp.fromDate(new Date('2026-01-18T00:00:00Z'))

function book(fields) {
    return {
        description: null,
        isbn13: null,
        isbn10: null,
        publisher: null,
        publishedYear: null,
        pageCount: null,
        coverUrl: null,
        categories: [],
        formats: ['physical'],
        visibility: 'public',
        readingStatus: 'want',
        currentPage: null,
        progressPercent: null,
        startedAt: null,
        finishedAt: null,
        rating: null,
        createdAt: now,
        updatedAt: now,
        ...fields,
    }
}

function session(fields) {
    return {
        finishedAt: null,
        rating: null,
        format: 'physical',
        createdAt: now,
        updatedAt: now,
        ...fields,
    }
}

const books = {
    'deep-work': book({
        slug: 'deep-work',
        title: 'Deep Work',
        authors: ['Cal Newport'],
        sortAuthor: 'Newport, Cal',
        description: 'قواعد للعمل المركّز في عالم مشتت.',
        categories: ['عمل'],
        language: 'en',
        publisher: 'Grand Central',
        publishedYear: 2016,
        pageCount: 304,
        formats: ['physical', 'digital'],
        visibility: 'public',
        readingStatus: 'reading',
        currentPage: 120,
        progressPercent: 39.5,
    }),
    'atomic-habits': book({
        slug: 'atomic-habits',
        title: 'Atomic Habits',
        authors: ['James Clear'],
        sortAuthor: 'Clear, James',
        description: 'تغييرات صغيرة بنتائج متراكمة.',
        categories: ['عادات'],
        language: 'en',
        publisher: 'Avery',
        publishedYear: 2018,
        pageCount: 320,
        formats: ['digital'],
        visibility: 'public',
        readingStatus: 'finished',
        currentPage: 320,
        progressPercent: 100,
        startedAt: earlier,
        finishedAt: finished,
        rating: 5,
    }),
    'al-ayyam': book({
        slug: 'al-ayyam',
        title: 'الأيام',
        authors: ['طه حسين'],
        sortAuthor: 'حسين، طه',
        description: 'سيرة محفوظة في السجل، والكتاب نفسه لم يعد عامًا.',
        categories: ['سيرة'],
        language: 'ar',
        publisher: 'دار المعارف',
        publishedYear: 1929,
        pageCount: 280,
        formats: ['physical'],
        visibility: 'unlisted',
        readingStatus: 'finished',
        currentPage: 280,
        progressPercent: 100,
        startedAt: earlier,
        finishedAt: Timestamp.fromDate(new Date('2025-12-01T00:00:00Z')),
        rating: 4,
    }),
}

const sessions = {
    'deep-work-current': session({
        bookId: 'deep-work',
        title: 'Deep Work',
        authors: ['Cal Newport'],
        bookVisibility: 'public',
        status: 'reading',
        startedAt: now,
        progress: { currentPage: 120, pageCount: 304, percent: 39 },
    }),
    'atomic-habits-finished': session({
        bookId: 'atomic-habits',
        title: 'Atomic Habits',
        authors: ['James Clear'],
        bookVisibility: 'public',
        status: 'finished',
        startedAt: earlier,
        finishedAt: finished,
        progress: { currentPage: 320, pageCount: 320, percent: 100 },
        rating: 5,
        format: 'digital',
    }),
    'al-ayyam-finished': session({
        bookId: 'al-ayyam',
        title: 'الأيام',
        authors: ['طه حسين'],
        bookVisibility: 'public',
        status: 'finished',
        startedAt: earlier,
        finishedAt: Timestamp.fromDate(new Date('2025-12-01T00:00:00Z')),
        progress: { currentPage: 280, pageCount: 280, percent: 100 },
        rating: 4,
    }),
}

const batch = db.batch()
for (const [id, data] of Object.entries(books)) {
    batch.set(db.collection('books').doc(id), data)
}
for (const [id, data] of Object.entries(sessions)) {
    batch.set(db.collection('readingSessions').doc(id), data)
}
batch.set(db.collection('settings').doc('currentReading'), {
    bookId: 'deep-work',
    sessionId: 'deep-work-current',
    updatedAt: now,
})

await batch.commit()
console.log(`Seeded ${Object.keys(books).length} emulator books and ${Object.keys(sessions).length} sessions at ${process.env.FIRESTORE_EMULATOR_HOST}.`)
