import React from 'react'

export default function Rule({ ornament, className = '', animated = false }) {
    if (ornament) {
        return (
            <div
                className={`flex items-center gap-4 my-8 text-ink-muted ${className}`}
                role="separator"
                aria-hidden="true"
            >
                <span className={`flex-1 h-px bg-rule ${animated ? 'rule-grow' : ''}`} />
                <span className="font-serif text-sm opacity-70 select-none">{ornament}</span>
                <span className={`flex-1 h-px bg-rule ${animated ? 'rule-grow' : ''}`} />
            </div>
        )
    }
    return (
        <hr
            className={`border-0 border-t border-rule my-8 ${animated ? 'rule-grow' : ''} ${className}`}
        />
    )
}
