export function readBearer(authorizationHeader) {
    const header = String(authorizationHeader || '')
    if (!header.startsWith('Bearer ')) return ''
    return header.slice('Bearer '.length).trim()
}

/**
 * Owner gate for gallery functions. The browser check is not the boundary.
 * authorizeOwner allows the request only when all of these hold:
 * the ID token verifies (verifyOwnerToken passes checkRevoked: true),
 * decoded.galleryOwner === true as a boolean (the string "true" is rejected),
 * decoded.email_verified === true, and the email matches GALLERY_OWNER_EMAIL
 * case-insensitively. admin === true is not sufficient.
 * A missing owner email, or missing Firebase admin credentials, fails closed.
 */
export async function authorizeOwner(authorizationHeader, { ownerEmail, verifyIdToken }) {
    const token = readBearer(authorizationHeader)
    if (!token) return { ok: false, status: 401, error: 'missing-token' }

    const expected = String(ownerEmail || '').trim().toLowerCase()
    if (!expected) return { ok: false, status: 500, error: 'owner-not-configured' }

    let decoded
    try {
        decoded = await verifyIdToken(token)
    } catch (error) {
        const code = String(error?.code || '')
        if (code === 'gallery/not-configured') return { ok: false, status: 500, error: 'owner-not-configured' }
        return { ok: false, status: 401, error: 'invalid-token' }
    }

    const email = String(decoded?.email || '').trim().toLowerCase()
    const galleryOwner = decoded?.galleryOwner === true
    const verified = decoded?.email_verified === true
    if (!galleryOwner || !verified || email !== expected) {
        return { ok: false, status: 403, error: 'not-owner' }
    }

    return { ok: true, uid: decoded.uid, email: decoded.email }
}
