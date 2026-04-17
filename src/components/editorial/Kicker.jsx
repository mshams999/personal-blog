import React from 'react'

export default function Kicker({ children, as: Tag = 'span', className = '' }) {
    return (
        <Tag
            className={`inline-block font-sans uppercase tracking-[0.14em] text-[0.72rem] font-semibold text-accent ${className}`}
        >
            {children}
        </Tag>
    )
}
