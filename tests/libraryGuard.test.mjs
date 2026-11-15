import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveLibraryTarget, withLibraryAccess } from '../src/services/libraryGuard.js'

test('development without the emulator flag never runs a library operation', () => {
    let called = false
    assert.throws(
        () => withLibraryAccess({ DEV: true }, () => {
            called = true
        }),
        (error) => error.code === 'library/emulator-required',
    )
    assert.equal(called, false)
})

test('a false or missing emulator flag stays blocked', () => {
    for (const flag of [undefined, '', 'false', '1', 'TRUE']) {
        const target = resolveLibraryTarget({ DEV: true, VITE_FIRESTORE_EMULATOR: flag })
        assert.equal(target.mode, 'blocked', `flag ${String(flag)}`)
    }
})

test('development with the flag targets the emulator and defaults the host to localhost', () => {
    const target = resolveLibraryTarget({ DEV: true, VITE_FIRESTORE_EMULATOR: 'true' })
    assert.deepEqual(target, {
        mode: 'emulator',
        host: 'localhost',
        port: 8080,
        projectId: 'demo-reading-library',
    })
})

test('the emulator host and port are configurable', () => {
    const target = resolveLibraryTarget({
        DEV: true,
        VITE_FIRESTORE_EMULATOR: 'true',
        VITE_FIRESTORE_EMULATOR_HOST: '127.0.0.1',
        VITE_FIRESTORE_EMULATOR_PORT: '8090',
    })
    assert.equal(target.host, '127.0.0.1')
    assert.equal(target.port, 8090)
    assert.equal(target.projectId, 'demo-reading-library')
})

test('an invalid emulator port is blocked before any connection', () => {
    let called = false
    assert.throws(
        () => withLibraryAccess({
            DEV: true,
            VITE_FIRESTORE_EMULATOR: 'true',
            VITE_FIRESTORE_EMULATOR_PORT: '0',
        }, () => {
            called = true
        }),
        (error) => error.code === 'library/emulator-required',
    )
    assert.equal(called, false)
})

test('production uses the normal Firebase project and ignores the emulator flag', () => {
    let target = null
    withLibraryAccess({ PROD: true, VITE_FIRESTORE_EMULATOR: 'false' }, (resolved) => {
        target = resolved
    })
    assert.deepEqual(target, { mode: 'production' })

    withLibraryAccess({ PROD: true, DEV: true, VITE_FIRESTORE_EMULATOR: 'true' }, (resolved) => {
        target = resolved
    })
    assert.deepEqual(target, { mode: 'production' })
})

test('an empty environment is blocked instead of reaching production', () => {
    assert.equal(resolveLibraryTarget({}).mode, 'blocked')
    assert.equal(resolveLibraryTarget(undefined).mode, 'blocked')
})
