import React from 'react'

export default function Byline({
    author = 'د. محمد شمس',
    avatar,
    date,
    readTime,
    className = '',
}) {
    const formattedDate = date
        ? (typeof date === 'string' ? date : new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }))
        : null

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
            <div className="flex flex-col leading-tight">
                <span className="font-serif text-ink text-base">{author}</span>
                <span className="small-caps">
                    {formattedDate}
                    {formattedDate && readTime && <span className="mx-2 opacity-50">·</span>}
                    {readTime && <span>{readTime}</span>}
                </span>
            </div>
        </div>
    )
}
