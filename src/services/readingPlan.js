import { normalizeSlug } from './bookSavePlan.js'

export const FORMAT_OPTIONS = ['Paperback', 'Hardcover', 'Kindle', 'EPUB', 'PDF', 'Audiobook']
export const LEGACY_FORMATS = ['physical', 'digital', 'audio']
export const READING_STATUSES = ['want', 'reading', 'finished']

const SESSION_FORMAT = {
    Paperback: 'physical',
    Hardcover: 'physical',
    physical: 'physical',
    Kindle: 'digital',
    EPUB: 'digital',
    PDF: 'digital',
    digital: 'digital',
    Audiobook: 'audio',
    audio: 'audio',
}

export const STATUS_LABELS = {
    want: 'أريد قراءته',
    reading: 'أقرأ الآن',
    finished: 'أنهيتُه',
}

function cleanList(value) {
    const source = Array.isArray(value) ? value : String(value ?? '').split(/[\n,]/)
    return source.map((item) => String(item).trim()).filter(Boolean)
}

function optionalText(value, max) {
    const text = String(value ?? '').trim()
    if (!text) return null
    return max ? text.slice(0, max) : text
}

function optionalInt(value) {
    if (value == null || value === '') return null
    const number = Number(value)
    return Number.isInteger(number) ? number : null
}

function dateOrNull(value) {
    const text = String(value ?? '').trim()
    if (!text) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return undefined
    const date = new Date(`${text}T00:00:00.000Z`)
    return Number.isNaN(date.getTime()) ? undefined : date
}

export function readingProgress(currentPage, pageCount) {
    if (currentPage == null || currentPage === '') {
        return { currentPage: null, percent: null }
    }
    const page = Number(currentPage)
    if (!Number.isInteger(page) || page < 0 || page > 20000) {
        return { error: 'الصفحة الحالية يجب أن تكون رقمًا صحيحًا.' }
    }
    if (pageCount == null || pageCount === '') return { currentPage: page, percent: null }
    const count = Number(pageCount)
    if (!Number.isInteger(count) || count < 0 || count > 20000) {
        return { error: 'عدد الصفحات يجب أن يكون رقمًا صحيحًا.' }
    }
    if (count > 0 && page > count) return { error: 'الصفحة الحالية لا يمكن أن تتجاوز عدد الصفحات.' }
    if (count === 0) return { currentPage: page, percent: null }
    return { currentPage: page, percent: Math.round((page / count) * 1000) / 10 }
}

export function primarySessionFormat(formats) {
    for (const format of formats || []) {
        if (SESSION_FORMAT[format]) return SESSION_FORMAT[format]
    }
    return 'physical'
}

export function deriveReadingStatus(book, sessions = []) {
    if (READING_STATUSES.includes(book?.readingStatus)) return book.readingStatus
    const mine = sessions.filter((session) => session.bookId === (book?.id || book?.slug))
    if (mine.some((session) => session.status === 'reading')) return 'reading'
    return 'want'
}

export function displayProgress(book, session) {
    if (typeof book?.progressPercent === 'number') {
        return {
            currentPage: book.currentPage ?? 0,
            pageCount: book.pageCount ?? 0,
            percent: book.progressPercent,
        }
    }
    return session?.progress || null
}

/**
 * Builds the book, the optional public reading session, and the private note.
 * Private notes are never copied onto the book.
 */
export function buildLibraryEntry(draft, now = new Date()) {
    const errors = []
    const slug = normalizeSlug(draft.slug || draft.title)
    const title = String(draft.title ?? '').trim()
    const authors = cleanList(draft.authors).slice(0, 20)
    const formats = cleanList(draft.formats)
        .filter((value) => FORMAT_OPTIONS.includes(value) || LEGACY_FORMATS.includes(value))
        .slice(0, 4)
    const language = String(draft.language ?? '').trim().slice(0, 15)
    const visibility = draft.visibility === 'public' ? 'public' : 'unlisted'
    const readingStatus = READING_STATUSES.includes(draft.readingStatus) ? draft.readingStatus : 'want'

    if (!slug) errors.push('أدخل عنوانًا يمكن حفظه.')
    if (!title) errors.push('أدخل العنوان.')
    if (authors.length === 0) errors.push('أدخل مؤلفًا واحدًا على الأقل.')
    if (cleanList(draft.formats).length > 4) errors.push('اختر أربع صيغ على الأكثر.')

    const publishedYear = optionalInt(draft.publishedYear)
    if (draft.publishedYear !== '' && draft.publishedYear != null && publishedYear == null) {
        errors.push('سنة النشر يجب أن تكون رقمًا صحيحًا.')
    }
    if (publishedYear != null && (publishedYear < 0 || publishedYear > 2200)) {
        errors.push('سنة النشر خارج النطاق.')
    }

    const pageCount = optionalInt(draft.pageCount)
    if (draft.pageCount !== '' && draft.pageCount != null && pageCount == null) {
        errors.push('عدد الصفحات يجب أن يكون رقمًا صحيحًا.')
    }
    if (pageCount != null && (pageCount < 0 || pageCount > 20000)) {
        errors.push('عدد الصفحات خارج النطاق.')
    }

    const progress = readingProgress(draft.currentPage, pageCount)
    if (progress.error) errors.push(progress.error)

    const rating = draft.rating == null || draft.rating === '' ? null : Number(draft.rating)
    if (rating != null && (!Number.isInteger(rating) || rating < 0 || rating > 5)) {
        errors.push('التقييم يجب أن يكون من 1 إلى 5.')
    }

    const startedAt = dateOrNull(draft.startedOn)
    const finishedAt = dateOrNull(draft.finishedOn)
    if (startedAt === undefined) errors.push('تاريخ البدء غير صالح.')
    if (finishedAt === undefined) errors.push('تاريخ الانتهاء غير صالح.')

    if (errors.length) return { ok: false, errors }

    const isbnText = String(draft.isbn ?? '').trim()
    const originalText = String(draft.originalIsbn13 || draft.originalIsbn10 || '').trim()
    const isbnUnchanged = isbnText === originalText
    const book = {
        slug,
        title,
        authors,
        sortAuthor: String(draft.sortAuthor ?? '').trim() || authors[0],
        description: optionalText(draft.description, 10000),
        categories: cleanList(draft.categories).slice(0, 30),
        language,
        isbn13: isbnUnchanged ? (draft.originalIsbn13 || null) : (isbnText.slice(0, 31) || null),
        isbn10: isbnUnchanged ? (draft.originalIsbn10 || null) : null,
        publisher: optionalText(draft.publisher, 300),
        publishedYear,
        pageCount,
        formats,
        coverUrl: optionalText(draft.coverUrl, 2000),
        visibility,
        readingStatus,
        currentPage: progress.currentPage,
        progressPercent: progress.percent,
        startedAt: startedAt || (readingStatus === 'want' ? null : now),
        finishedAt: readingStatus === 'finished' ? (finishedAt || now) : null,
        rating,
    }

    const session = readingStatus === 'want' ? null : {
        bookId: slug,
        title,
        authors,
        bookVisibility: visibility,
        status: readingStatus,
        startedAt: book.startedAt,
        finishedAt: book.finishedAt,
        progress: {
            currentPage: progress.currentPage ?? 0,
            pageCount: pageCount ?? 0,
            percent: progress.percent ?? 0,
        },
        rating,
        format: primarySessionFormat(formats),
    }

    return {
        ok: true,
        book,
        session,
        noteBody: String(draft.notes ?? '').trim(),
    }
}

export function planCurrentReading({ bookId, sessionId, status, pointer }) {
    const namesThis = pointer?.bookId === bookId && Boolean(pointer?.sessionId)
    const namesOther = Boolean(pointer?.bookId && pointer.bookId !== bookId && pointer.sessionId)
    if (status === 'reading') {
        return {
            pointer: namesOther ? null : { bookId, sessionId },
            clearPointer: false,
        }
    }
    return {
        pointer: null,
        clearPointer: namesThis,
    }
}

export function dateInputValue(value) {
    if (!value) return ''
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toISOString().slice(0, 10)
}
