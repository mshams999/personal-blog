import { initializeApp, getApps } from 'firebase/app'
import {
    collection,
    connectFirestoreEmulator,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    where,
} from 'firebase/firestore'
import { auth, db, firebaseConfig } from '../config/firebase'
import { resolveLibraryTarget } from './libraryGuard'

const LIBRARY_APP = 'library'
const bookReads = new Map()
let emulatorFirestore = null
let libraryApp = null
let adminAuthPromise = null

const ADMIN_SIGN_IN_MESSAGE =
    'حفظ الكتب يتم في مشروع Firebase الحي. ادخل من صفحة تسجيل الدخول بحساب جوجل الذي يحمل مطالبة المشرف admin. إذا مُنحت المطالبة للتو، سجّل الخروج ثم ادخل مرة أخرى حتى يتجدد الرمز.'

function isDenied(error) {
    return error?.code === 'permission-denied'
}

function libraryAppFor(target) {
    if (!libraryApp) {
        const existing = getApps().find((item) => item.name === LIBRARY_APP)
        libraryApp = existing ?? initializeApp(
            { ...firebaseConfig, projectId: target.projectId },
            LIBRARY_APP,
        )
    }
    return libraryApp
}

function adminRequired(message = ADMIN_SIGN_IN_MESSAGE) {
    return Object.assign(new Error(message), { code: 'book/admin-required' })
}

/**
 * Emulator tests sign the separate library app into the Auth emulator.
 * The live project uses the Google account already signed in on the site.
 * Firestore rules require that account's ID token to carry admin: true.
 */
export function ensureLibraryAuth() {
    const target = resolveLibraryTarget(import.meta.env)
    if (target.mode === 'blocked') return Promise.reject(target.error)
    if (target.mode !== 'emulator') {
        const user = auth.currentUser
        if (!user) return Promise.reject(adminRequired())
        return user.getIdTokenResult(true).then((token) => {
            if (token.claims.admin !== true) throw adminRequired()
        })
    }
    if (!adminAuthPromise) {
        adminAuthPromise = (async () => {
            const { connectAuthEmulator, getAuth, signInWithCustomToken } = await import('firebase/auth')
            const emulatorAuth = getAuth(libraryAppFor(target))
            connectAuthEmulator(emulatorAuth, 'http://127.0.0.1:9099', { disableWarnings: true })
            const response = await fetch('/api/dev-admin-token')
            const payload = await response.json().catch(() => ({}))
            if (!response.ok || !payload.token) {
                throw new Error(payload.error || 'Local admin sign-in is unavailable. Start the Auth emulator.')
            }
            await signInWithCustomToken(emulatorAuth, payload.token)
        })().catch((error) => {
            adminAuthPromise = null
            throw error
        })
    }
    return adminAuthPromise
}

/**
 * Returns the Firestore instance library calls may use.
 * The live project is the site's default `db`. The emulator connection is
 * only for an explicit VITE_FIRESTORE_EMULATOR=true opt-in, and it happens
 * before the instance is returned so the first call cannot race it.
 */
export function getLibraryFirestore() {
    const target = resolveLibraryTarget(import.meta.env)
    if (target.mode === 'blocked') throw target.error
    if (target.mode === 'production') return db

    if (!emulatorFirestore) {
        const firestore = getFirestore(libraryAppFor(target))
        connectFirestoreEmulator(firestore, target.host, target.port)
        emulatorFirestore = firestore
    }
    return emulatorFirestore
}

function toBook(snapshot) {
    return { id: snapshot.id, ...snapshot.data() }
}

function millis(value) {
    if (!value) return 0
    if (typeof value.toMillis === 'function') return value.toMillis()
    if (value instanceof Date) return value.getTime()
    return 0
}

async function fetchPublicBook(bookId) {
    try {
        const snapshot = await getDoc(doc(getLibraryFirestore(), 'books', bookId))
        if (!snapshot.exists()) return null
        const data = snapshot.data()
        if (data.visibility !== 'public') return null
        return toBook(snapshot)
    } catch (error) {
        if (isDenied(error)) return null
        throw error
    }
}

/**
 * One read per book id for the lifetime of the page, including in-flight reads.
 * A permission-denied or missing book is cached as null so history does not
 * retry an archived book once per session row.
 */
export function readPublicBook(bookId) {
    if (!bookId) return Promise.resolve(null)
    if (!bookReads.has(bookId)) {
        const pending = fetchPublicBook(bookId).catch((error) => {
            bookReads.delete(bookId)
            throw error
        })
        bookReads.set(bookId, pending)
    }
    return bookReads.get(bookId)
}

export async function listPublicBooks() {
    const snapshot = await getDocs(
        query(collection(getLibraryFirestore(), 'books'), where('visibility', '==', 'public')),
    )
    return snapshot.docs.map(toBook)
}

export async function listPublicSessions(bookId) {
    const snapshot = await getDocs(
        query(
            collection(getLibraryFirestore(), 'readingSessions'),
            where('bookId', '==', bookId),
            where('bookVisibility', '==', 'public'),
        ),
    )
    return snapshot.docs
        .map((item) => ({ key: item.id, ...item.data() }))
        .sort((a, b) => millis(b.startedAt) - millis(a.startedAt))
}

/**
 * Finished sessions whose snapshot is still public stay in the history list
 * even after the book itself is archived. `book` is set only when that book
 * is currently public, which is the only case that may link to /library/:slug.
 */
export async function listPublicHistory() {
    const snapshot = await getDocs(
        query(
            collection(getLibraryFirestore(), 'readingSessions'),
            where('bookVisibility', '==', 'public'),
            where('status', '==', 'finished'),
        ),
    )
    const sessions = snapshot.docs
        .map((item) => ({ key: item.id, ...item.data() }))
        .sort((a, b) => millis(b.finishedAt) - millis(a.finishedAt))
    const bookIds = [...new Set(sessions.map((session) => session.bookId).filter(Boolean))]
    const books = await Promise.all(bookIds.map((bookId) => readPublicBook(bookId)))
    const byId = new Map(bookIds.map((bookId, index) => [bookId, books[index]]))

    return sessions.map((session) => ({
        ...session,
        book: byId.get(session.bookId) || null,
    }))
}

export async function getCurrentReading() {
    const firestore = getLibraryFirestore()
    let pointer
    try {
        pointer = await getDoc(doc(firestore, 'settings', 'currentReading'))
    } catch (error) {
        if (isDenied(error)) return { state: 'hidden' }
        throw error
    }

    if (!pointer.exists()) return { state: 'hidden' }
    const { bookId, sessionId } = pointer.data()
    if (!bookId || !sessionId) return { state: 'hidden' }

    const book = await readPublicBook(bookId)
    if (!book) return { state: 'hidden' }

    let sessionSnapshot
    try {
        sessionSnapshot = await getDoc(doc(firestore, 'readingSessions', sessionId))
    } catch (error) {
        if (isDenied(error)) return { state: 'hidden' }
        throw error
    }

    if (!sessionSnapshot.exists()) return { state: 'hidden' }
    const session = sessionSnapshot.data()
    if (
        session.status !== 'reading'
        || session.bookVisibility !== 'public'
        || session.bookId !== bookId
    ) {
        return { state: 'hidden' }
    }

    return {
        state: 'ready',
        book,
        progress: session.progress,
        session: {
            key: sessionId,
            bookId: session.bookId,
            title: session.title,
            authors: session.authors,
            status: session.status,
            startedAt: session.startedAt,
            finishedAt: session.finishedAt ?? null,
            progress: session.progress,
        },
    }
}
