import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    where,
} from 'firebase/firestore'
import { getLibraryFirestore, ensureLibraryAuth } from './libraryService.js'
import { snapshotExists } from './bookSavePlan.js'
import {
    buildLibraryEntry,
    dateInputValue,
    deriveReadingStatus,
    displayProgress,
    planCurrentReading,
} from './readingPlan.js'

function permissionError(error) {
    if (error?.code !== 'permission-denied') return null
    const denied = new Error('حفظ الكتاب يتطلب صلاحية المشرف.')
    denied.code = 'book/admin-required'
    return denied
}

function stamp(value, now) {
    if (value instanceof Date) return value
    return now
}

async function readPointer(firestore) {
    const snapshot = await getDoc(doc(firestore, 'settings', 'currentReading'))
    if (!snapshot.exists()) return { bookId: null, sessionId: null }
    return snapshot.data()
}

export async function listLibrary() {
    await ensureLibraryAuth()
    const firestore = getLibraryFirestore()
    const [booksSnap, sessionsSnap, pointer] = await Promise.all([
        getDocs(collection(firestore, 'books')),
        getDocs(collection(firestore, 'readingSessions')),
        readPointer(firestore),
    ])
    const sessions = sessionsSnap.docs.map((item) => ({ id: item.id, ...item.data() }))
    const books = booksSnap.docs.map((item) => {
        const book = { id: item.id, ...item.data() }
        const mine = sessions.filter((session) => session.bookId === item.id)
        const active = mine.find((session) => session.id === pointer.sessionId) || mine[0] || null
        const progressView = displayProgress(book, active)
        return {
            ...book,
            readingStatus: deriveReadingStatus(book, mine),
            currentPage: book.currentPage ?? progressView?.currentPage ?? null,
            progressPercent: book.progressPercent ?? progressView?.percent ?? null,
            startedAt: book.startedAt || active?.startedAt || null,
            finishedAt: book.finishedAt || active?.finishedAt || null,
            rating: book.rating ?? active?.rating ?? null,
            progressView,
            isCurrent: pointer.bookId === item.id && pointer.sessionId != null,
        }
    })
    books.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
    return { books, currentBookId: pointer.bookId || null }
}

export async function getEditableBook(id) {
    await ensureLibraryAuth()
    const firestore = getLibraryFirestore()
    const [bookSnap, noteSnap, sessionsSnap] = await Promise.all([
        getDoc(doc(firestore, 'books', id)),
        getDoc(doc(firestore, 'privateNotes', id)),
        getDocs(query(collection(firestore, 'readingSessions'), where('bookId', '==', id))),
    ])
    if (!snapshotExists(bookSnap)) return null
    const book = { id: bookSnap.id, ...bookSnap.data() }
    const sessions = sessionsSnap.docs.map((item) => ({ id: item.id, ...item.data() }))
    return {
        book: { ...book, readingStatus: deriveReadingStatus(book, sessions) },
        notes: noteSnap.exists() ? noteSnap.data().body || '' : '',
    }
}

export async function saveBook(draft, { existingId } = {}) {
    await ensureLibraryAuth()
    const built = buildLibraryEntry(draft)
    if (!built.ok) {
        const error = new Error(built.errors.join(' '))
        error.code = 'book/invalid'
        error.errors = built.errors
        throw error
    }

    const firestore = getLibraryFirestore()
    const id = existingId || built.book.slug
    const bookRef = doc(firestore, 'books', id)
    const pointerRef = doc(firestore, 'settings', 'currentReading')
    const noteRef = doc(firestore, 'privateNotes', id)

    try {
        if (!existingId) {
            const existing = await getDoc(bookRef)
            if (snapshotExists(existing)) {
                return {
                    status: 'duplicate',
                    matches: [{ id, title: existing.data()?.title || built.book.title, reasons: ['slug'] }],
                }
            }
        }

        const priorSessions = await getDocs(query(collection(firestore, 'readingSessions'), where('bookId', '==', id)))

        await runTransaction(firestore, async (transaction) => {
            const bookSnap = await transaction.get(bookRef)
            const pointerSnap = await transaction.get(pointerRef)
            const noteSnap = await transaction.get(noteRef)
            const pointer = pointerSnap.exists() ? pointerSnap.data() : { bookId: null, sessionId: null }
            const sessionId = (pointer.bookId === id && pointer.sessionId) || priorSessions.docs[0]?.id || id
            const sessionRef = doc(firestore, 'readingSessions', sessionId)
            const sessionSnap = await transaction.get(sessionRef)
            const otherSessionSnap = pointer.bookId && pointer.bookId !== id && pointer.sessionId
                ? await transaction.get(doc(firestore, 'readingSessions', pointer.sessionId))
                : null
            const otherBookSnap = pointer.bookId && pointer.bookId !== id
                ? await transaction.get(doc(firestore, 'books', pointer.bookId))
                : null

            if (!existingId && snapshotExists(bookSnap)) {
                throw Object.assign(new Error('هذا المعرّف مستخدم بالفعل.'), { code: 'book/duplicate' })
            }

            const plan = planCurrentReading({
                bookId: id,
                sessionId,
                status: built.book.readingStatus,
                pointer,
            })
            const now = serverTimestamp()
            const createdAt = snapshotExists(bookSnap) ? bookSnap.data().createdAt : now
            transaction.set(bookRef, {
                ...built.book,
                slug: id,
                startedAt: stamp(built.book.startedAt, now),
                finishedAt: built.book.finishedAt ? stamp(built.book.finishedAt, now) : null,
                createdAt,
                updatedAt: now,
            })

            if (plan.pauseOther && otherSessionSnap?.exists() && otherSessionSnap.data().status === 'reading') {
                transaction.update(otherSessionSnap.ref, { status: 'paused', updatedAt: now })
            }
            if (plan.pauseOther && otherBookSnap?.exists() && otherBookSnap.data().readingStatus === 'reading') {
                transaction.update(otherBookSnap.ref, { readingStatus: 'paused', updatedAt: now })
            }

            if (built.session) {
                transaction.set(sessionRef, {
                    ...built.session,
                    bookId: id,
                    startedAt: stamp(built.session.startedAt, now),
                    finishedAt: built.session.finishedAt ? stamp(built.session.finishedAt, now) : null,
                    createdAt: sessionSnap.exists() ? sessionSnap.data().createdAt : now,
                    updatedAt: now,
                })
            } else if (sessionSnap.exists() && sessionSnap.data().status === 'reading') {
                transaction.update(sessionRef, { status: 'paused', updatedAt: now })
            }

            if (plan.pointer || plan.clearPointer) {
                transaction.set(pointerRef, {
                    bookId: plan.pointer?.bookId ?? null,
                    sessionId: plan.pointer?.sessionId ?? null,
                    updatedAt: now,
                })
            }

            if ('notes' in draft) {
                if (built.noteBody) {
                    transaction.set(noteRef, {
                        bookId: id,
                        sessionId: built.session ? sessionId : null,
                        kind: 'note',
                        body: built.noteBody,
                        page: built.book.currentPage,
                        createdAt: noteSnap.exists() ? noteSnap.data().createdAt : now,
                        updatedAt: now,
                    })
                } else if (noteSnap.exists()) {
                    transaction.delete(noteRef)
                }
            }
        })

        if (!built.session) {
            const pointer = await readPointer(firestore)
            if (pointer.bookId !== id) {
                const leftover = await getDocs(query(collection(firestore, 'readingSessions'), where('bookId', '==', id)))
                await Promise.all(leftover.docs
                    .filter((item) => item.data().status !== 'finished')
                    .map((item) => deleteDoc(item.ref)))
            }
        }

        return { status: 'saved', id }
    } catch (error) {
        if (error?.code === 'book/duplicate') {
            return { status: 'duplicate', matches: [{ id, title: built.book.title, reasons: ['slug'] }] }
        }
        throw permissionError(error) || error
    }
}

export function draftForAction(book, overrides = {}) {
    const draft = draftFromRecord(book, '')
    delete draft.notes
    return { ...draft, ...overrides }
}

export async function archiveBook(book) {
    return saveBook(draftForAction(book, { visibility: 'unlisted' }), { existingId: book.id })
}

export async function deleteBook(id) {
    await ensureLibraryAuth()
    const firestore = getLibraryFirestore()
    const pointerRef = doc(firestore, 'settings', 'currentReading')
    try {
        await runTransaction(firestore, async (transaction) => {
            const pointerSnap = await transaction.get(pointerRef)
            const pointer = pointerSnap.exists() ? pointerSnap.data() : null
            if (pointer?.bookId !== id) return
            const sessionRef = doc(firestore, 'readingSessions', pointer.sessionId)
            const sessionSnap = await transaction.get(sessionRef)
            if (sessionSnap.exists() && sessionSnap.data().status === 'reading') {
                transaction.update(sessionRef, { status: 'paused', updatedAt: serverTimestamp() })
            }
            transaction.set(pointerRef, {
                bookId: null,
                sessionId: null,
                updatedAt: serverTimestamp(),
            })
        })
        const sessions = await getDocs(query(collection(firestore, 'readingSessions'), where('bookId', '==', id)))
        await Promise.all(sessions.docs.map((item) => deleteDoc(item.ref)))
        await deleteDoc(doc(firestore, 'privateNotes', id)).catch((error) => {
            if (error?.code !== 'not-found') throw error
        })
        await deleteDoc(doc(firestore, 'books', id))
    } catch (error) {
        throw permissionError(error) || error
    }
}

export function draftFromRecord(book, notes = '', overrides = {}) {
    const authors = Array.isArray(book.authors) ? book.authors.join('\n') : (book.authors || '')
    return {
        slug: book.slug || book.id,
        title: book.title || '',
        authors,
        sortAuthor: book.sortAuthor || '',
        description: book.description || '',
        categories: Array.isArray(book.categories) ? book.categories.join(', ') : '',
        language: book.language || '',
        isbn: book.isbn13 || book.isbn10 || '',
        originalIsbn13: book.isbn13 || null,
        originalIsbn10: book.isbn10 || null,
        publisher: book.publisher || '',
        publishedYear: book.publishedYear ?? '',
        pageCount: book.pageCount ?? '',
        formats: book.formats || [],
        coverUrl: book.coverUrl || '',
        visibility: book.visibility || 'unlisted',
        readingStatus: book.readingStatus || 'want',
        currentPage: book.currentPage ?? '',
        startedOn: dateInputValue(book.startedAt),
        finishedOn: dateInputValue(book.finishedAt),
        rating: book.rating ?? '',
        notes,
        ...overrides,
    }
}
