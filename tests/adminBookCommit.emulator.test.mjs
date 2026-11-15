import assert from 'node:assert/strict'
import test from 'node:test'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createIfAbsent } from '../src/services/bookSavePlan.js'

const host = process.env.FIRESTORE_EMULATOR_HOST || ''

test('book creation against the emulator never overwrites an existing slug', async (t) => {
    if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host)) {
        t.skip('FIRESTORE_EMULATOR_HOST must point at the local emulator')
        return
    }

    const projectId = 'demo-reading-library'
    initializeApp({ projectId })
    const db = getFirestore()
    const id = `test-isbn-${Date.now()}`
    const ref = db.collection('books').doc(id)

    try {
        const [first, second] = await Promise.all([
            createIfAbsent((operation) => db.runTransaction(operation), ref, { title: 'First writer' }),
            createIfAbsent((operation) => db.runTransaction(operation), ref, { title: 'Second writer' }),
        ])
        const stored = await ref.get()
        const outcomes = [first, second]
        const created = outcomes.filter((result) => result == null)
        const rejected = outcomes.filter((result) => result)
        assert.equal(created.length, 1)
        assert.equal(rejected.length, 1)
        assert.equal(rejected[0].title, stored.data().title)

        const repeat = await createIfAbsent(
            (operation) => db.runTransaction(operation),
            ref,
            { title: 'Silent overwrite' },
        )
        const after = await ref.get()
        assert.equal(repeat.title, stored.data().title)
        assert.equal(after.data().title, stored.data().title)
    } finally {
        await ref.delete()
    }
})
