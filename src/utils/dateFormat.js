/**
 * Arabic Date Formatting Utilities
 * Converts dates to Arabic format
 */

const arabicMonths = {
    1: 'يناير',
    2: 'فبراير',
    3: 'مارس',
    4: 'أبريل',
    5: 'مايو',
    6: 'يونيو',
    7: 'يوليو',
    8: 'أغسطس',
    9: 'سبتمبر',
    10: 'أكتوبر',
    11: 'نوفمبر',
    12: 'ديسمبر'
}

const arabicMonthsShort = {
    1: 'يناير',
    2: 'فبراير',
    3: 'مارس',
    4: 'أبريل',
    5: 'مايو',
    6: 'يونيو',
    7: 'يوليو',
    8: 'أغسطس',
    9: 'سبتمبر',
    10: 'أكتوبر',
    11: 'نوفمبر',
    12: 'ديسمبر'
}

/**
 * Format date to Arabic - Full format (e.g., "١٥ يناير ٢٠٢٥")
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDateArabicFull = (date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = arabicMonths[d.getMonth() + 1]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
}

/**
 * Format date to Arabic - Short format (e.g., "١٥ يناير")
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDateArabicShort = (date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = arabicMonthsShort[d.getMonth() + 1]
    return `${day} ${month}`
}

/**
 * Format date to Arabic - Month and Year (e.g., "يناير ٢٠٢٥")
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDateArabicMonthYear = (date) => {
    const d = new Date(date)
    const month = arabicMonths[d.getMonth() + 1]
    const year = d.getFullYear()
    return `${month} ${year}`
}

/**
 * Get relative time in Arabic (e.g., "منذ ٥ دقائق", "منذ ساعتين", "منذ ٣ أيام")
 * @param {Date|string} date 
 * @returns {string}
 */
export const getRelativeTimeArabic = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now - d
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffSecs < 60) {
        return 'الآن'
    } else if (diffMins < 60) {
        if (diffMins === 1) return 'منذ دقيقة'
        if (diffMins === 2) return 'منذ دقيقتين'
        if (diffMins <= 10) return `منذ ${diffMins} دقائق`
        return `منذ ${diffMins} دقيقة`
    } else if (diffHours < 24) {
        if (diffHours === 1) return 'منذ ساعة'
        if (diffHours === 2) return 'منذ ساعتين'
        if (diffHours <= 10) return `منذ ${diffHours} ساعات`
        return `منذ ${diffHours} ساعة`
    } else if (diffDays < 30) {
        if (diffDays === 1) return 'منذ يوم'
        if (diffDays === 2) return 'منذ يومين'
        if (diffDays <= 10) return `منذ ${diffDays} أيام`
        return `منذ ${diffDays} يوماً`
    } else if (diffMonths < 12) {
        if (diffMonths === 1) return 'منذ شهر'
        if (diffMonths === 2) return 'منذ شهرين'
        if (diffMonths <= 10) return `منذ ${diffMonths} أشهر`
        return `منذ ${diffMonths} شهراً`
    } else {
        if (diffYears === 1) return 'منذ سنة'
        if (diffYears === 2) return 'منذ سنتين'
        if (diffYears <= 10) return `منذ ${diffYears} سنوات`
        return `منذ ${diffYears} سنة`
    }
}
