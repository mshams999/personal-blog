import React from 'react'

export default function Standfirst({ children, className = '' }) {
    return (
        <p
            className={`font-serif text-lg md:text-xl leading-relaxed text-ink-muted max-w-prose-editorial ${className}`}
        >
            {children}
        </p>
    )
}
