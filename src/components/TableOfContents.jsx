import React, { useEffect, useRef, useState } from 'react'

/**
 * TableOfContents — walks rendered h2/h3 inside the target container,
 * generates anchor IDs if missing, and highlights the active heading
 * via IntersectionObserver.
 *   - Sticky side rail on lg: screens (right-side for LTR, left-side for RTL)
 *   - Collapsible bar on mobile
 */
const slugify = (text) =>
    text
        .trim()
        .toLowerCase()
        .replace(/[\s\u00A0]+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]+/g, '')

const TableOfContents = ({ containerSelector = 'article .prose-editorial', deps = [] }) => {
    const [headings, setHeadings] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [open, setOpen] = useState(false)
    const observerRef = useRef(null)

    useEffect(() => {
        const container = document.querySelector(containerSelector)
        if (!container) return

        const nodes = Array.from(container.querySelectorAll('h2, h3'))
        const list = nodes.map((n) => {
            if (!n.id) n.id = slugify(n.textContent || '')
            return {
                id: n.id,
                text: n.textContent || '',
                level: n.tagName === 'H2' ? 2 : 3,
            }
        })
        setHeadings(list)

        if (observerRef.current) observerRef.current.disconnect()
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible[0]) setActiveId(visible[0].target.id)
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: [0, 1] }
        )
        nodes.forEach((n) => observerRef.current.observe(n))

        return () => observerRef.current && observerRef.current.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerSelector, ...deps])

    if (!headings.length) return null

    const handleClick = (e, id) => {
        e.preventDefault()
        const el = document.getElementById(id)
        if (!el) return
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
        setOpen(false)
    }

    const List = (
        <ol className="space-y-2 text-sm">
            {headings.map((h) => {
                const isActive = h.id === activeId
                return (
                    <li key={h.id} className={h.level === 3 ? 'ms-4' : ''}>
                        <a
                            href={`#${h.id}`}
                            onClick={(e) => handleClick(e, h.id)}
                            className={`block border-s pe-2 ps-3 py-1 font-serif leading-snug transition-colors ${
                                isActive
                                    ? 'border-accent text-ink'
                                    : 'border-rule text-ink-muted hover:text-ink'
                            }`}
                        >
                            {h.text}
                        </a>
                    </li>
                )
            })}
        </ol>
    )

    return (
        <>
            {/* Desktop: keep anchors in-flow so they start with article body text. */}
            <aside
                className="hidden lg:block lg:sticky lg:top-28 lg:self-start w-56 max-h-[70vh] overflow-auto"
                aria-label="جدول المحتويات"
            >
                <div className="bg-paper/90 backdrop-blur-sm border border-rule rounded-xl p-4">
                    <p className="kicker mb-3">في هذه المقالة</p>
                    {List}
                </div>
            </aside>

            {/* Mobile: fixed top anchor bar with expandable list. */}
            <div className="lg:hidden">
                <div className="fixed top-14 inset-x-0 z-30 border-y border-rule bg-paper/95 backdrop-blur-sm px-4">
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="w-full flex items-center justify-between py-3 small-caps"
                        aria-expanded={open}
                    >
                        <span>جدول المحتويات</span>
                        <span aria-hidden="true">{open ? '—' : '+'}</span>
                    </button>
                    {open && <div className="pb-4 max-h-[45vh] overflow-auto">{List}</div>}
                </div>
                <div className="h-14" aria-hidden="true" />
            </div>
        </>
    )
}

export default TableOfContents
