import { doc, getDoc, runTransaction, setDoc } from 'firebase/firestore'
import { createIfAbsent } from './bookSavePlan.js'
import { ensureLibraryAuth, getLibraryFirestore } from './libraryService.js'
import { goodreadsBookDocument, goodreadsNoteDocument } from '../utils/goodreadsImport.js'

async function saveMissingNote(firestore, entry) {
    const note = goodreadsNoteDocument(entry)
    if (!note) return 'none'
    const noteRef = doc(firestore, 'privateNotes', entry.draft.slug)
    const existing = await getDoc(noteRef)
    if (existing.exists()) return 'unchanged'
    await setDoc(noteRef, note)
    return 'saved'
}

export async function commitGoodreadsImport(entries) {
    await ensureLibraryAuth()
    const firestore = getLibraryFirestore()
    const results = []
    for (const entry of entries) {
        const title = entry.draft.title
        try {
            const bookRef = doc(firestore, 'books', entry.draft.slug)
            const existing = await createIfAbsent(
                (operation) => runTransaction(firestore, operation),
                bookRef,
                goodreadsBookDocument(entry),
            )
            if (existing) {
                const note = await saveMissingNote(firestore, entry)
                results.push({
                    rowNumber: entry.rowNumber,
                    title,
                    status: 'skipped',
                    id: existing.id,
                    session: false,
                    note,
                })
                continue
            }
            const note = await saveMissingNote(firestore, entry)
            results.push({
                rowNumber: entry.rowNumber,
                title,
                status: 'imported',
                id: entry.draft.slug,
                session: false,
                note,
            })
        } catch (error) {
            results.push({
                rowNumber: entry.rowNumber,
                title,
                status: 'failed',
                session: false,
                message: error?.message || 'تعذّر حفظ الكتاب.',
            })
        }
    }
    return results
}
