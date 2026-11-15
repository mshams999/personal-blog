import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, it } from 'node:test'
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore'

const ts = Timestamp.fromDate(new Date('2026-01-15T12:00:00.000Z'))
const iso = '2026-01-15T12:00:00.000Z'

let testEnv
let adminDb
let anonDb
let strangerDb

function book(id, overrides = {}) {
    return {
        slug: id,
        title: 'Atomic Habits',
        authors: ['James Clear'],
        sortAuthor: 'clear james',
        description: null,
        categories: ['habits'],
        language: 'en',
        isbn13: null,
        isbn10: null,
        publisher: null,
        publishedYear: 2018,
        pageCount: 320,
        formats: ['digital'],
        coverUrl: null,
        visibility: 'public',
        readingStatus: 'want',
        currentPage: null,
        progressPercent: null,
        startedAt: null,
        finishedAt: null,
        rating: null,
        createdAt: ts,
        updatedAt: ts,
        ...overrides,
    }
}

function progress(overrides = {}) {
    return { currentPage: 10, pageCount: 320, percent: 3, ...overrides }
}

function session(bookId, overrides = {}) {
    return {
        bookId,
        title: 'Atomic Habits',
        authors: ['James Clear'],
        bookVisibility: 'public',
        status: 'paused',
        startedAt: ts,
        finishedAt: null,
        progress: progress(),
        rating: null,
        format: 'digital',
        createdAt: ts,
        updatedAt: ts,
        ...overrides,
    }
}

function emptyPointer() {
    return { bookId: null, sessionId: null, updatedAt: ts }
}

function pointer(bookId, sessionId) {
    return { bookId, sessionId, updatedAt: ts }
}

function note(overrides = {}) {
    return {
        bookId: 'atomic-habits',
        sessionId: null,
        kind: 'note',
        body: 'A private line.',
        page: null,
        createdAt: ts,
        updatedAt: ts,
        ...overrides,
    }
}

function omit(source, key) {
    const copy = { ...source }
    delete copy[key]
    return copy
}

async function raw(pathSegments) {
    let snap
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
        snap = await getDoc(doc(ctx.firestore(), ...pathSegments))
    })
    return snap
}

before(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: 'demo-reading-library',
        firestore: {
            rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
        },
    })
    adminDb = testEnv.authenticatedContext('owner', {
        admin: true,
        email: 'owner@example.com',
        email_verified: true,
    }).firestore()
    anonDb = testEnv.unauthenticatedContext().firestore()
    strangerDb = testEnv.authenticatedContext('stranger', {
        email: 'stranger@example.com',
        email_verified: true,
    }).firestore()
})

after(async () => {
    await testEnv.cleanup()
})

beforeEach(async () => {
    await testEnv.clearFirestore()
})

describe('settings/currentReading initialization', () => {
    it('denies anonymous reads before the document exists', async () => {
        await assertFails(getDoc(doc(anonDb, 'settings', 'currentReading')))
    })

    it('lets the admin create an empty pointer and then lets the public read it', async () => {
        await assertSucceeds(setDoc(doc(adminDb, 'settings', 'currentReading'), {
            bookId: null,
            sessionId: null,
            updatedAt: serverTimestamp(),
        }))
        const snap = await assertSucceeds(getDoc(doc(anonDb, 'settings', 'currentReading')))
        assert.equal(snap.data().bookId, null)
        assert.equal(snap.data().sessionId, null)
    })

    it('denies public and stranger creates of the pointer', async () => {
        await assertFails(setDoc(doc(anonDb, 'settings', 'currentReading'), emptyPointer()))
        await assertFails(setDoc(doc(strangerDb, 'settings', 'currentReading'), emptyPointer()))
    })

    it('rejects a pointer that omits a required field or adds an unexpected one', async () => {
        await assertFails(setDoc(doc(adminDb, 'settings', 'currentReading'), omit(emptyPointer(), 'updatedAt')))
        await assertFails(setDoc(doc(adminDb, 'settings', 'currentReading'), { ...emptyPointer(), note: 'x' }))
    })
})

describe('books', () => {
    it('requires every schema field and rejects unexpected fields', async () => {
        await assertFails(setDoc(doc(adminDb, 'books', 'atomic-habits'), omit(book('atomic-habits'), 'coverUrl')))
        await assertFails(setDoc(doc(adminDb, 'books', 'atomic-habits'), { ...book('atomic-habits'), extra: true }))
    })

    it('allows an admin to create a book with explicit nulls', async () => {
        await assertSucceeds(setDoc(doc(adminDb, 'books', 'atomic-habits'), book('atomic-habits')))
    })

    it('lets the public read a public book and hides an unlisted book', async () => {
        await setDoc(doc(adminDb, 'books', 'atomic-habits'), book('atomic-habits'))
        await setDoc(doc(adminDb, 'books', 'secret'), book('secret', { visibility: 'unlisted', title: 'Secret' }))
        await assertSucceeds(getDoc(doc(anonDb, 'books', 'atomic-habits')))
        await assertFails(getDoc(doc(anonDb, 'books', 'secret')))
        await assertSucceeds(getDoc(doc(adminDb, 'books', 'secret')))
    })

    it('archives a book without rewriting its finished session and deletes only when it is not current', async () => {
        await setDoc(doc(adminDb, 'books', 'atomic-habits'), book('atomic-habits'))
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await setDoc(doc(adminDb, 'readingSessions', 'past'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: 5,
        }))
        await assertSucceeds(updateDoc(doc(adminDb, 'books', 'atomic-habits'), {
            visibility: 'unlisted',
            updatedAt: ts,
        }))
        await assertSucceeds(getDoc(doc(anonDb, 'readingSessions', 'past')))
        await assertFails(getDoc(doc(anonDb, 'books', 'atomic-habits')))
        await setDoc(doc(adminDb, 'books', 'empty-shelf'), book('empty-shelf', { title: 'Empty Shelf' }))
        await assertSucceeds(deleteDoc(doc(adminDb, 'books', 'empty-shelf')))
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'current'), session('atomic-habits', {
                status: 'reading',
                bookVisibility: 'unlisted',
            }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'current'))
        })
        await assertFails(deleteDoc(doc(adminDb, 'books', 'atomic-habits')))
        await runTransaction(adminDb, async (tx) => {
            tx.update(doc(adminDb, 'readingSessions', 'current'), { status: 'paused', updatedAt: ts })
            tx.set(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        })
        await assertSucceeds(deleteDoc(doc(adminDb, 'books', 'atomic-habits')))
    })

    it('denies public writes', async () => {
        await assertFails(setDoc(doc(anonDb, 'books', 'atomic-habits'), book('atomic-habits')))
        await assertFails(setDoc(doc(strangerDb, 'books', 'atomic-habits'), book('atomic-habits')))
    })
})

describe('reading sessions', () => {
    beforeEach(async () => {
        await setDoc(doc(adminDb, 'books', 'atomic-habits'), book('atomic-habits'))
        await setDoc(doc(adminDb, 'books', 'deep-work'), book('deep-work', {
            title: 'Deep Work',
            authors: ['Cal Newport'],
        }))
    })

    it('starts a reading session and the pointer in one transaction', async () => {
        await assertSucceeds(runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 's1'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
        }))
        const snap = await raw(['readingSessions', 's1'])
        assert.equal(snap.data().status, 'reading')
    })

    it('denies creating a reading session without the pointer', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 's1'), session('atomic-habits', { status: 'reading' })))
    })

    it('records six finished sessions for one book', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        for (let i = 1; i <= 6; i += 1) {
            await assertSucceeds(setDoc(doc(adminDb, 'readingSessions', `past-${i}`), session('atomic-habits', {
                status: 'finished',
                finishedAt: ts,
                rating: i % 6,
            })))
        }
    })

    it('denies pausing, finishing, or abandoning the current session without the pointer', async () => {
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 's1'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
        })

        await assertFails(updateDoc(doc(adminDb, 'readingSessions', 's1'), { status: 'paused', updatedAt: ts }))
        await assertFails(updateDoc(doc(adminDb, 'readingSessions', 's1'), {
            status: 'finished',
            finishedAt: ts,
            rating: 5,
            updatedAt: ts,
        }))
        await assertFails(updateDoc(doc(adminDb, 'readingSessions', 's1'), { status: 'abandoned', updatedAt: ts }))

        const sessionSnap = await raw(['readingSessions', 's1'])
        const pointerSnap = await raw(['settings', 'currentReading'])
        assert.equal(sessionSnap.data().status, 'reading')
        assert.equal(pointerSnap.data().sessionId, 's1')
    })

    it('pauses, finishes, and abandons when the pointer is cleared in the same transaction', async () => {
        for (const status of ['paused', 'finished', 'abandoned']) {
            await testEnv.clearFirestore()
            await setDoc(doc(adminDb, 'books', 'atomic-habits'), book('atomic-habits'))
            await runTransaction(adminDb, async (tx) => {
                tx.set(doc(adminDb, 'readingSessions', 's1'), session('atomic-habits', { status: 'reading' }))
                tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
            })
            const patch = { status, updatedAt: ts }
            if (status === 'finished') {
                patch.finishedAt = ts
                patch.rating = 5
            }
            await assertSucceeds(runTransaction(adminDb, async (tx) => {
                tx.update(doc(adminDb, 'readingSessions', 's1'), patch)
                tx.set(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
            }))
            const pointerSnap = await raw(['settings', 'currentReading'])
            assert.equal(pointerSnap.data().sessionId, null)
            assert.equal((await raw(['readingSessions', 's1'])).data().status, status)
        }
    })

    it('resumes a paused session only together with the pointer', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await setDoc(doc(adminDb, 'readingSessions', 's1'), session('atomic-habits', { status: 'paused' }))
        await assertFails(updateDoc(doc(adminDb, 'readingSessions', 's1'), { status: 'reading', updatedAt: ts }))
        await assertSucceeds(runTransaction(adminDb, async (tx) => {
            tx.update(doc(adminDb, 'readingSessions', 's1'), { status: 'reading', updatedAt: ts })
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
        }))
    })

    it('switches books atomically and rejects a switch that leaves the old session reading', async () => {
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'a'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'a'))
        })

        await assertFails(runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'b'), session('deep-work', {
                status: 'reading',
                title: 'Deep Work',
                authors: ['Cal Newport'],
            }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('deep-work', 'b'))
        }))
        assert.equal((await raw(['settings', 'currentReading'])).data().sessionId, 'a')
        assert.equal((await raw(['readingSessions', 'b'])).exists(), false)

        await assertSucceeds(runTransaction(adminDb, async (tx) => {
            tx.update(doc(adminDb, 'readingSessions', 'a'), { status: 'paused', updatedAt: ts })
            tx.set(doc(adminDb, 'readingSessions', 'b'), session('deep-work', {
                status: 'reading',
                title: 'Deep Work',
                authors: ['Cal Newport'],
            }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('deep-work', 'b'))
        }))
        assert.equal((await raw(['readingSessions', 'a'])).data().status, 'paused')
        assert.equal((await raw(['readingSessions', 'b'])).data().status, 'reading')
        assert.equal((await raw(['settings', 'currentReading'])).data().sessionId, 'b')
    })

    it('rejects two reading sessions and a pointer aimed at a non-reading session', async () => {
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'a'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'a'))
        })
        await assertFails(runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'b'), session('deep-work', {
                status: 'reading',
                title: 'Deep Work',
                authors: ['Cal Newport'],
            }))
            tx.update(doc(adminDb, 'readingSessions', 'a'), { status: 'reading', updatedAt: ts })
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('deep-work', 'b'))
        }))
        await assertSucceeds(runTransaction(adminDb, async (tx) => {
            tx.update(doc(adminDb, 'readingSessions', 'a'), { status: 'paused', updatedAt: ts })
            tx.set(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        }))
        await setDoc(doc(adminDb, 'readingSessions', 'done'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: null,
        }))
        await assertFails(setDoc(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'done')))
    })

    it('allows a finished past session while another session stays current', async () => {
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'current'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'current'))
        })
        await assertSucceeds(setDoc(doc(adminDb, 'readingSessions', 'past'), session('deep-work', {
            status: 'finished',
            title: 'Deep Work',
            authors: ['Cal Newport'],
            finishedAt: ts,
            rating: 4,
        })))
        await assertFails(runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'bad'), session('deep-work', {
                status: 'finished',
                title: 'Deep Work',
                authors: ['Cal Newport'],
                finishedAt: ts,
                rating: 4,
            }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('deep-work', 'bad'))
        }))
    })

    it('enforces ratings, page counts, required keys, and unexpected keys', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 'bad-rating'), session('atomic-habits', {
            status: 'paused',
            rating: 9,
        })))
        await assertSucceeds(setDoc(doc(adminDb, 'readingSessions', 'rated'), session('atomic-habits', {
            status: 'paused',
            rating: 5,
        })))
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 'bad-pages'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: null,
            progress: progress({ currentPage: 41, pageCount: 40, percent: 100 }),
        })))
        await assertSucceeds(setDoc(doc(adminDb, 'readingSessions', 'ok-pages'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: 0,
            progress: progress({ currentPage: 40, pageCount: 40, percent: 100 }),
        })))
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 'missing'), omit(session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: null,
        }), 'rating')))
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 'extra'), {
            ...session('atomic-habits', { status: 'finished', finishedAt: ts, rating: null }),
            note: 'nope',
        }))
        await assertFails(setDoc(doc(adminDb, 'readingSessions', 'bad-progress'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: null,
            progress: { currentPage: 1, pageCount: 10 },
        })))
    })

    it('keeps public ratings on public sessions and hides unlisted sessions', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await setDoc(doc(adminDb, 'readingSessions', 'public-done'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: 5,
        }))
        const visible = await assertSucceeds(getDoc(doc(anonDb, 'readingSessions', 'public-done')))
        assert.equal(visible.data().rating, 5)

        await assertSucceeds(updateDoc(doc(adminDb, 'readingSessions', 'public-done'), {
            bookVisibility: 'unlisted',
            updatedAt: ts,
        }))
        await assertFails(getDoc(doc(anonDb, 'readingSessions', 'public-done')))
        await assertSucceeds(getDoc(doc(anonDb, 'books', 'atomic-habits')))
    })

    it('requires the visibility filter on public session queries', async () => {
        await setDoc(doc(adminDb, 'settings', 'currentReading'), emptyPointer())
        await setDoc(doc(adminDb, 'readingSessions', 'public-done'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: 5,
        }))
        await setDoc(doc(adminDb, 'readingSessions', 'hidden'), session('atomic-habits', {
            status: 'finished',
            finishedAt: ts,
            rating: 2,
        }))
        await updateDoc(doc(adminDb, 'readingSessions', 'hidden'), {
            bookVisibility: 'unlisted',
            updatedAt: ts,
        })
        await assertFails(getDocs(collection(anonDb, 'readingSessions')))
        const listed = await assertSucceeds(getDocs(query(
            collection(anonDb, 'readingSessions'),
            where('bookVisibility', '==', 'public'),
            where('status', '==', 'finished'),
        )))
        assert.deepEqual(listed.docs.map((item) => item.id), ['public-done'])
        await assertSucceeds(getDocs(collection(adminDb, 'readingSessions')))
    })

    it('deletes a session the pointer does not name, and refuses the current one', async () => {
        await runTransaction(adminDb, async (tx) => {
            tx.set(doc(adminDb, 'readingSessions', 'current'), session('atomic-habits', { status: 'reading' }))
            tx.set(doc(adminDb, 'settings', 'currentReading'), pointer('atomic-habits', 'current'))
        })
        await setDoc(doc(adminDb, 'readingSessions', 'past'), session('deep-work', {
            status: 'finished',
            title: 'Deep Work',
            authors: ['Cal Newport'],
            finishedAt: ts,
            rating: null,
        }))
        await assertFails(deleteDoc(doc(adminDb, 'readingSessions', 'current')))
        await assertSucceeds(deleteDoc(doc(adminDb, 'readingSessions', 'past')))
    })
})

describe('public pointer privacy', () => {
    async function seedInconsistent(sessionPatch) {
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            const db = ctx.firestore()
            await setDoc(doc(db, 'books', 'atomic-habits'), book('atomic-habits'))
            await setDoc(doc(db, 'readingSessions', 's1'), session('atomic-habits', {
                status: 'reading',
                ...sessionPatch,
            }))
            await setDoc(doc(db, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
        })
    }

    it('allows an anonymous read only for a public reading session of a public book', async () => {
        await seedInconsistent({ bookVisibility: 'public', status: 'reading' })
        await assertSucceeds(getDoc(doc(anonDb, 'settings', 'currentReading')))
    })

    it('hides the pointer when the current session is unlisted, paused, or the book is unlisted', async () => {
        await seedInconsistent({ bookVisibility: 'unlisted', status: 'reading' })
        await assertFails(getDoc(doc(anonDb, 'settings', 'currentReading')))
        await assertSucceeds(getDoc(doc(adminDb, 'settings', 'currentReading')))

        await testEnv.clearFirestore()
        await seedInconsistent({ bookVisibility: 'public', status: 'paused' })
        await assertFails(getDoc(doc(anonDb, 'settings', 'currentReading')))

        await testEnv.clearFirestore()
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            const db = ctx.firestore()
            await setDoc(doc(db, 'books', 'atomic-habits'), book('atomic-habits', { visibility: 'unlisted' }))
            await setDoc(doc(db, 'readingSessions', 's1'), session('atomic-habits', {
                status: 'reading',
                bookVisibility: 'public',
            }))
            await setDoc(doc(db, 'settings', 'currentReading'), pointer('atomic-habits', 's1'))
        })
        await assertFails(getDoc(doc(anonDb, 'settings', 'currentReading')))
    })
})

describe('private notes', () => {
    it('is admin-only and requires every field, including explicit nulls', async () => {
        await assertFails(getDoc(doc(anonDb, 'privateNotes', 'n1')))
        await assertFails(getDoc(doc(strangerDb, 'privateNotes', 'n1')))
        await assertSucceeds(setDoc(doc(adminDb, 'privateNotes', 'n1'), note()))
        await assertSucceeds(getDoc(doc(adminDb, 'privateNotes', 'n1')))
        await assertFails(setDoc(doc(adminDb, 'privateNotes', 'missing'), omit(note(), 'page')))
        await assertFails(setDoc(doc(adminDb, 'privateNotes', 'extra'), { ...note(), rating: 5 }))
        await assertFails(updateDoc(doc(adminDb, 'privateNotes', 'n1'), {
            createdAt: Timestamp.fromDate(new Date('2026-02-01T00:00:00.000Z')),
        }))
        await assertSucceeds(updateDoc(doc(adminDb, 'privateNotes', 'n1'), {
            body: 'Updated.',
            updatedAt: ts,
        }))
    })
})

describe('existing site collections', () => {
    it('accepts a public article view create and an increment of one', async () => {
        await assertSucceeds(setDoc(doc(anonDb, 'articles', 'post'), {
            views: 1,
            firstViewed: iso,
            lastViewed: iso,
            slug: 'post',
        }))
        await assertSucceeds(updateDoc(doc(anonDb, 'articles', 'post'), {
            views: increment(1),
            lastViewed: iso,
            slug: 'post',
        }))
        await assertFails(updateDoc(doc(anonDb, 'articles', 'post'), {
            views: 10,
            lastViewed: iso,
            slug: 'post',
        }))
        await assertFails(updateDoc(doc(anonDb, 'articles', 'post'), {
            views: increment(1),
            lastViewed: ts,
            slug: 'post',
        }))
        await assertFails(deleteDoc(doc(anonDb, 'articles', 'post')))
    })

    it('accepts a public newsletter signup and hides the list', async () => {
        const payload = {
            email: 'reader@example.com',
            firstName: '',
            subscribedAt: ts,
            isActive: true,
            source: 'website',
            ipAddress: 'unknown',
            userAgent: 'test',
            preferences: { weeklyUpdate: true, newPosts: true, specialOffers: false },
        }
        await assertSucceeds(setDoc(doc(anonDb, 'newsletter_subscribers', 'sub-1'), payload))
        await assertFails(getDoc(doc(anonDb, 'newsletter_subscribers', 'sub-1')))
        await assertFails(getDoc(doc(strangerDb, 'newsletter_subscribers', 'sub-1')))
        await assertSucceeds(getDoc(doc(adminDb, 'newsletter_subscribers', 'sub-1')))
    })

    it('keeps presence public to read and admin-only to write', async () => {
        await assertSucceeds(setDoc(doc(adminDb, 'presence', 'owner'), { lastSeen: ts }))
        await assertSucceeds(getDoc(doc(anonDb, 'presence', 'owner')))
        await assertFails(setDoc(doc(strangerDb, 'presence', 'owner'), { lastSeen: ts }))
        await assertFails(setDoc(doc(adminDb, 'presence', 'owner'), { lastSeen: ts, status: 'online' }))
    })

    it('keeps net worth and the dashboard admin-only', async () => {
        await assertFails(getDoc(doc(anonDb, 'networth', 'holdings')))
        await assertFails(getDoc(doc(strangerDb, 'dashboard', 'main')))
        await assertFails(setDoc(doc(strangerDb, 'networth', 'holdings'), { cash: [] }))
        await assertSucceeds(setDoc(doc(adminDb, 'networth', 'holdings'), { cash: [], updatedAt: iso }))
        await assertSucceeds(setDoc(doc(adminDb, 'dashboard', 'main'), { goals: [] }))
        await assertSucceeds(getDoc(doc(adminDb, 'networth', 'holdings')))
    })

    it('lets anyone read comment counts and only an admin write them', async () => {
        await assertFails(setDoc(doc(anonDb, 'commentCounts', 'post'), { count: 1 }))
        await assertSucceeds(setDoc(doc(adminDb, 'commentCounts', 'post'), { count: 1 }))
        await assertSucceeds(getDoc(doc(anonDb, 'commentCounts', 'post')))
    })
})
