export function normalizeSlug(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\u0600-\u06ff-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80)
}

export function suggestSlug(title) {
    return normalizeSlug(title)
}

export function snapshotExists(snapshot) {
    if (!snapshot) return false
    if (typeof snapshot.exists === 'function') return snapshot.exists()
    return snapshot.exists === true
}

/**
 * Creates the book only when the slug document is absent.
 * A transaction retry sees the winner's document and returns it unchanged.
 * set() is never called on a document that already exists.
 */
export async function createIfAbsent(runTransaction, docRef, data) {
    let existing = null
    await runTransaction(async (transaction) => {
        const snapshot = await transaction.get(docRef)
        if (snapshotExists(snapshot)) {
            existing = {
                id: docRef.id,
                title: snapshot.data()?.title || 'Untitled book',
                reasons: ['slug'],
            }
            return
        }
        transaction.set(docRef, data)
    })
    return existing
}
