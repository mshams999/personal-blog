import React from 'react'

const toArabicDigits = (n) => Number(n).toLocaleString('ar-EG')

const pluralAr = (n, forms) => {
    const rule = new Intl.PluralRules('ar').select(n)
    return forms[rule] || forms.other
}

const formatReadTime = (minutes) => {
    const n = Number(minutes)
    if (!Number.isFinite(n) || n <= 0) return null
    const unit = n === 2
        ? 'دقيقتان'
        : pluralAr(n, { one: 'دقيقة', few: 'دقائق', many: 'دقيقة', other: 'دقيقة' })
    const prefix = n === 2 ? unit : `${toArabicDigits(n)} ${unit}`
    return `${prefix} قراءة — مش هياخد من وقتك كتير`
}

const formatViews = (count) => {
    const n = Number(count)
    if (!Number.isFinite(n) || n <= 0) return null
    return `انت القارئ رقم ${toArabicDigits(n)} للمقالة دي`
}

const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return null
    const formatted = d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    return `كتبناه بتاريخ ${formatted}`
}

export default function Byline({
    author = 'د. محمد شمس',
    avatar,
    date,
    readTime,
    viewCount,
    className = '',
}) {
    const parts = [formatDate(date), formatReadTime(readTime), formatViews(viewCount)].filter(Boolean)

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {avatar && (
                <img
                    src={avatar}
                    alt={author}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-rule"
                    loading="lazy"
                />
            )}
            <div className="flex flex-col leading-tight min-w-0">
                <span className="font-serif text-ink text-base">{author}</span>
                {parts.length > 0 && (
                    <span className="font-serif text-sm text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                        {parts.map((part, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="inline-block w-px h-3.5 bg-rule/80"
                                    />
                                )}
                                <span>{part}</span>
                            </React.Fragment>
                        ))}
                    </span>
                )}
            </div>
        </div>
    )
}
