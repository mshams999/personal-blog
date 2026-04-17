import React from 'react'

export default function PullQuote({ children, cite, className = '' }) {
    return (
        <figure className={`pull-quote my-8 ${className}`}>
            <blockquote className="m-0 p-0 border-0 bg-transparent font-serif italic text-ink">
                {children}
            </blockquote>
            {cite && (
                <figcaption className="small-caps mt-3 not-italic">— {cite}</figcaption>
            )}
        </figure>
    )
}
