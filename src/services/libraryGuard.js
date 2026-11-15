/**
 * Decides where library Firestore calls go.
 *
 * Reads and writes use the Firebase project configured for the site
 * (the same app as the rest of the blog). Data survives an editor restart
 * because it lives in that project.
 *
 * Set VITE_FIRESTORE_EMULATOR to exactly "true" only when a test should
 * talk to the local emulator instead. Production builds ignore that flag.
 * `npm run dev` does not set it, so local development uses the live project.
 */

const BLOCKED_MESSAGE =
    'منفذ محاكي Firestore غير صالح. عطّل VITE_FIRESTORE_EMULATOR لاستخدام مشروع Firebase الحي، أو اضبط VITE_FIRESTORE_EMULATOR_PORT على رقم من 1 إلى 65535.'

export function libraryBlockedError(message = BLOCKED_MESSAGE) {
    return Object.assign(new Error(message), { code: 'library/emulator-required' })
}

export function isLibraryBlockedError(error) {
    return error?.code === 'library/emulator-required'
}

function emulatorEndpoint(env) {
    const host = String(env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost').trim() || 'localhost'
    const raw = env.VITE_FIRESTORE_EMULATOR_PORT
    const port = raw === undefined || raw === '' ? 8080 : Number(raw)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        return {
            error: libraryBlockedError(
                'منفذ محاكي Firestore غير صالح. اضبط VITE_FIRESTORE_EMULATOR_PORT على رقم من 1 إلى 65535.',
            ),
        }
    }
    return { host, port }
}

export function resolveLibraryTarget(env) {
    const source = env && typeof env === 'object' ? env : {}

    if (source.PROD === true) {
        return { mode: 'production' }
    }

    if (source.VITE_FIRESTORE_EMULATOR === 'true') {
        const endpoint = emulatorEndpoint(source)
        if (endpoint.error) return { mode: 'blocked', error: endpoint.error }
        return {
            mode: 'emulator',
            host: endpoint.host,
            port: endpoint.port,
            projectId: String(source.VITE_FIRESTORE_EMULATOR_PROJECT || 'demo-reading-library'),
        }
    }

    return { mode: 'production' }
}

export function withLibraryAccess(env, operation) {
    const target = resolveLibraryTarget(env)
    if (target.mode === 'blocked') throw target.error
    return operation(target)
}
