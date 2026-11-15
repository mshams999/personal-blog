import { formatDateArabicFull } from './dateFormat'

export const formatLabels = {
    digital: 'رقمي',
    physical: 'ورقي',
    audio: 'صوتي',
    Paperback: 'غلاف ورقي',
    Hardcover: 'غلاف مقوى',
    Kindle: 'كيندل',
    EPUB: 'EPUB',
    PDF: 'PDF',
    Audiobook: 'كتاب صوتي',
}

export const statusLabels = {
    want: 'أريد قراءته',
    reading: 'أقرأ الآن',
    finished: 'أنهيتُه',
}

export const languageLabels = {
    ar: 'العربية',
    en: 'الإنجليزية',
}

export function formatAuthors(authors) {
    if (!Array.isArray(authors)) return ''
    return authors.filter(Boolean).join('، ')
}

export function formatList(values, labels = {}) {
    if (!Array.isArray(values)) return ''
    return values.filter(Boolean).map((value) => labels[value] || value).join('، ')
}

export function formatTimestamp(value) {
    if (!value) return ''
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return formatDateArabicFull(date)
}

export function formatRating(rating) {
    if (typeof rating !== 'number') return ''
    return `التقييم ${rating} من 5`
}

export function formatLanguage(code) {
    if (!code) return ''
    return languageLabels[code] || code
}
