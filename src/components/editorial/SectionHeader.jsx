import React from 'react'
import Kicker from './Kicker'

export default function SectionHeader({
    kicker,
    title,
    trailing,
    as: Tag = 'h2',
    className = '',
}) {
    return (
        <header className={`mb-8 ${className}`}>
            <div className="flex items-end justify-between gap-6 border-b border-rule pb-3">
                <div>
                    {kicker && <Kicker className="mb-2">{kicker}</Kicker>}
                    <Tag className="font-display text-display-lg text-ink leading-[1.1]">
                        {title}
                    </Tag>
                </div>
                {trailing && (
                    <div className="shrink-0 text-ink-muted text-sm">{trailing}</div>
                )}
            </div>
        </header>
    )
}
