import assert from 'node:assert/strict'
import test from 'node:test'
import { createIfAbsent } from '../src/services/bookSavePlan.js'

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
