import { normalizeSlug } from '../services/bookSavePlan.js'

export const UNMAPPED_FIELDS = [
    'Book Id',
    'Date Added',
    'Original Publication Year',
    'Read Count',
    'Owned Copies',
]

export const SESSION_LIMITATION = 'جلسة القراءة تحتاج تاريخ بدء، وملف غودريدز لا يحتويه. لن يُخترع تاريخ، ولن تُنشأ جلسة.'

const SHELF_STATUS = {
    read: 'finished',
    'to-read': 'want',
    'currently-reading': null,
}

const IGNORED_SHELVES = new Set(['read', 'to-read', 'currently-reading'])

const BINDING_FORMAT = {
    paperback: 'Paperback',
    'mass market paperback': 'Paperback',
    hardcover: 'Hardcover',
    'kindle edition': 'Kindle',
    ebook: 'digital',
}

export function parseCsv(text) {
    const source = String(text ?? '').replace(/^\uFEFF/, '')
    const rows = []
    let row = []
    let cell = ''
    let quoted = false
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index]
        if (quoted) {
            if (char === '"') {
                if (source[index + 1] === '"') {
                    cell += '"'
                    index += 1
                } else {
                    quoted = false
                }
            } else {
                cell += char
            }
        } else if (char === '"') {
            quoted = true
        } else if (char === ',') {
            row.push(cell)
            cell = ''
        } else if (char === '\n') {
            row.push(cell)
            rows.push(row)
            row = []
            cell = ''
        } else if (char !== '\r') {
            cell += char
        }
    }
    if (cell.length || row.length) {
        row.push(cell)
        rows.push(row)
    }
    return rows.filter((item) => item.some((value) => String(value).trim()))
}

export function cleanIsbn(value) {
    let text = String(value ?? '').trim()
    const wrapped = text.match(/^=(?:"(.*)"|'(.*)')$/)
    if (wrapped) text = wrapped[1] ?? wrapped[2] ?? ''
    return text.replace(/[^0-9Xx]/g, '').toUpperCase()
}

function cleanText(value) {
    const text = String(value ?? '').trim()
    return text || ''
}

function wholeNumber(value) {
    const text = cleanText(value)
    if (!text) return { value: null }
    const number = Number(text)
    if (!Number.isInteger(number)) return { error: true }
    return { value: number }
}

export function goodreadsDate(value) {
    const text = cleanText(value)
    if (!text) return null
    const match = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/)
    if (!match) return undefined
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(Date.UTC(year, month - 1, day))
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
        return undefined
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function authorsOf(row) {
    const primary = cleanText(row.Author)
    const extra = cleanText(row['Additional Authors'])
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    const authors = []
    for (const name of [primary, ...extra]) {
        if (name && !authors.includes(name)) authors.push(name)
    }
    return authors
}

function categoriesOf(value) {
    return cleanText(value)
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item && !IGNORED_SHELVES.has(item.toLowerCase()))
        .slice(0, 30)
}

function ratingOf(value) {
    const text = cleanText(value)
    if (!text) return { value: null }
    const number = Number(text)
    if (!Number.isFinite(number)) return { error: true }
    if (number === 0) return { value: null }
    if (!Number.isInteger(number) || number < 1 || number > 5) return { error: true }
    return { value: number }
}

function noteBody(row) {
    const parts = [cleanText(row['My Review']), cleanText(row['Private Notes']), cleanText(row.Spoiler)]
        .filter(Boolean)
    return parts.join('\n\n')
}

function identityKey(title, author) {
    return `${normalizeSlug(title)}|${normalizeSlug(author)}`
}

export function mapGoodreadsRow(row, rowNumber) {
    const warnings = []
    const errors = []
    const title = cleanText(row.Title)
    const authors = authorsOf(row)
    const shelf = cleanText(row['Exclusive Shelf'])
    const readingStatus = SHELF_STATUS[shelf]
    if (!title) errors.push('العنوان فارغ.')
    if (!authors.length) errors.push('المؤلف فارغ.')
    if (!(shelf in SHELF_STATUS)) errors.push('رف غودريدز غير معروف.')
    if (title.length >= 500) errors.push('العنوان أطول من الحد المسموح.')
    if (authors.length > 20) errors.push('عدد المؤلفين أكبر من الحد المسموح.')

    const slug = normalizeSlug(title)
    if (title && !slug) errors.push('العنوان لا يصلح كمعرّف.')

    const pages = wholeNumber(row['Number of Pages'])
    if (pages.error || (pages.value != null && (pages.value < 0 || pages.value > 20000))) {
        errors.push('عدد الصفحات غير صالح.')
    }
    const year = wholeNumber(row['Year Published'])
    if (year.error || (year.value != null && (year.value < 0 || year.value > 2200))) {
        errors.push('سنة النشر غير صالحة.')
    }
    const rating = ratingOf(row['My Rating'])
    if (rating.error) errors.push('التقييم يجب أن يكون من 1 إلى 5.')

    const finishedOn = shelf === 'read' ? goodreadsDate(row['Date Read']) : null
    if (finishedOn === undefined) errors.push('تاريخ القراءة غير صالح.')
    if (shelf === 'read' && finishedOn == null) warnings.push('لا يوجد تاريخ قراءة. سيبقى تاريخ الانتهاء فارغًا.')

    const isbn13raw = cleanIsbn(row.ISBN13)
    const isbn10raw = cleanIsbn(row.ISBN)
    const isbn13 = isbn13raw.length === 13 ? isbn13raw : (isbn10raw.length === 13 ? isbn10raw : null)
    const isbn10 = isbn10raw.length === 10 ? isbn10raw : (isbn13raw.length === 10 ? isbn13raw : null)
    if ((isbn13raw && isbn13raw.length !== 13 && isbn13raw.length !== 10) || (isbn10raw && isbn10raw.length !== 10 && isbn10raw.length !== 13)) {
        warnings.push('رقم ISBN غير مكتمل، ولم يُحفظ.')
    }

    const binding = cleanText(row.Binding).toLowerCase()
    const formats = []
    if (binding && binding !== 'unknown binding') {
        const format = BINDING_FORMAT[binding]
        if (format) formats.push(format)
        else warnings.push(`صيغة «${row.Binding}» لا تطابق صيغ المكتبة، ولم تُحفظ.`)
    }

    const note = noteBody(row)
    if (note.length >= 20000) errors.push('المراجعة أطول من الحد المسموح.')

    return {
        rowNumber,
        goodreadsId: cleanText(row['Book Id']),
        shelf,
        needsChoice: shelf === 'currently-reading',
        warnings,
        errors,
        valid: errors.length === 0,
        duplicate: null,
        note,
        draft: {
            slug,
            title,
            authors,
            publisher: cleanText(row.Publisher) || null,
            publishedYear: year.value,
            pageCount: pages.value,
            rating: rating.value,
            formats,
            categories: categoriesOf(row.Bookshelves),
            isbn13,
            isbn10,
            readingStatus,
            startedAt: null,
            finishedAt: finishedOn || null,
            visibility: 'unlisted',
        },
    }
}

function matchTarget(record) {
    return {
        rowNumber: record.rowNumber ?? null,
        id: record.id || record.draft.slug,
        title: record.title || record.draft.title,
    }
}

function remember(index, record) {
    const target = matchTarget(record)
    if (record.draft.isbn13) index.isbn13.set(record.draft.isbn13, target)
    if (record.draft.isbn10) index.isbn10.set(record.draft.isbn10, target)
    if (record.draft.slug) index.slug.set(record.draft.slug, target)
    const author = record.draft.authors[0]
    if (record.draft.title && author) index.identity.set(identityKey(record.draft.title, author), target)
}

function matchExisting(record, index, source) {
    const author = record.draft.authors[0]
    const found = [
        [record.draft.isbn13 && index.isbn13.get(record.draft.isbn13), 'isbn13'],
        [record.draft.isbn10 && index.isbn10.get(record.draft.isbn10), 'isbn10'],
        [author && index.identity.get(identityKey(record.draft.title, author)), 'title-author'],
        [record.draft.slug && index.slug.get(record.draft.slug), 'slug'],
    ].find(([target]) => target)
    if (!found) return null
    return { source, reason: found[1], ...found[0] }
}

export function analyzeGoodreadsImport(text, existingBooks = []) {
    const table = parseCsv(text)
    const header = table[0] || []
    const columns = Object.fromEntries(header.map((name, index) => [name, index]))
    const records = table.slice(1).map((cells, index) => {
        const row = {}
        header.forEach((name, cellIndex) => {
            row[name] = cells[cellIndex] ?? ''
        })
        return mapGoodreadsRow(row, index + 2)
    })

    const library = { isbn13: new Map(), isbn10: new Map(), identity: new Map(), slug: new Map() }
    for (const book of existingBooks) {
        remember(library, {
            draft: {
                isbn13: cleanIsbn(book.isbn13),
                isbn10: cleanIsbn(book.isbn10),
                slug: book.id || book.slug,
                title: book.title || '',
                authors: book.authors || [],
            },
            id: book.id,
            title: book.title,
        })
    }

    const seen = { isbn13: new Map(), isbn10: new Map(), identity: new Map(), slug: new Map() }
    for (const record of records) {
        if (!record.valid) continue
        const libraryMatch = matchExisting(record, library, 'library')
        const fileMatch = matchExisting(record, seen, 'csv')
        if (libraryMatch) record.duplicate = libraryMatch
        else if (fileMatch) record.duplicate = { source: 'csv', reason: fileMatch.reason, rowNumber: fileMatch.rowNumber, title: fileMatch.title }
        else remember(seen, record)
    }

    return {
        columns: header,
        missingColumns: ['Title', 'Author', 'Exclusive Shelf'].filter((name) => columns[name] == null),
        records,
        unmappedFields: UNMAPPED_FIELDS,
        sessionLimitation: SESSION_LIMITATION,
    }
}

export function selectionIssues(records, selectedIds, choices) {
    const selected = records.filter((record) => selectedIds.has(record.rowNumber) && record.valid && !record.duplicate)
    const pending = selected.filter((record) => record.needsChoice && !choices[record.rowNumber])
    const issues = []
    if (pending.length) issues.push('اختر حالة كل كتاب محدد ما زال قيد القراءة.')
    return issues
}

export function entriesToImport(records, selectedIds, choices) {
    if (selectionIssues(records, selectedIds, choices).length) return []
    return records
        .filter((record) => selectedIds.has(record.rowNumber) && record.valid && !record.duplicate)
        .map((record) => ({
            ...record,
            draft: {
                ...record.draft,
                readingStatus: record.needsChoice ? choices[record.rowNumber] : record.draft.readingStatus,
            },
        }))
        .filter((record) => ['want', 'reading', 'finished'].includes(record.draft.readingStatus))
}

export function goodreadsBookDocument(entry, now = new Date()) {
    const draft = entry.draft
    const finishedAt = draft.readingStatus === 'finished' && draft.finishedAt
        ? new Date(`${draft.finishedAt}T00:00:00.000Z`)
        : null
    return {
        slug: draft.slug,
        title: draft.title,
        authors: draft.authors,
        sortAuthor: draft.authors[0] || '',
        description: null,
        categories: draft.categories,
        language: '',
        isbn13: draft.isbn13,
        isbn10: draft.isbn10,
        publisher: draft.publisher,
        publishedYear: draft.publishedYear,
        pageCount: draft.pageCount,
        formats: draft.formats,
        coverUrl: null,
        visibility: 'unlisted',
        readingStatus: draft.readingStatus,
        currentPage: null,
        progressPercent: null,
        startedAt: null,
        finishedAt,
        rating: draft.rating,
        createdAt: now,
        updatedAt: now,
    }
}

export function goodreadsNoteDocument(entry, now = new Date()) {
    const body = String(entry.note || '').trim()
    if (!body) return null
    return {
        bookId: entry.draft.slug,
        sessionId: null,
        kind: 'note',
        body: body.slice(0, 19999),
        page: null,
        createdAt: now,
        updatedAt: now,
    }
}
