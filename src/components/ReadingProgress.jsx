import React, { useEffect, useState, useRef } from 'react'

/**
 * ReadingProgress — 2px hairline bar at the very top of the viewport that
 * shows scroll progress through the target element (defaults to the first
 * <article> on the page). Uses rAF-throttled scroll listener.
 */
const ReadingProgress = ({ targetSelector = 'article' }) => {
    const [progress, setProgress] = useState(0)
    const rafRef = useRef(0)

    useEffect(() => {
        const compute = () => {
            const el = document.querySelector(targetSelector)
            if (!el) return setProgress(0)
            const rect = el.getBoundingClientRect()
            const total = rect.height - window.innerHeight
            if (total <= 0) return setProgress(rect.top < 0 ? 1 : 0)
            const scrolled = Math.min(Math.max(-rect.top, 0), total)
            setProgress(scrolled / total)
        }

        const onScroll = () => {
            if (rafRef.current) return
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0
                compute()
            })
        }

        compute()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [targetSelector])

    return (
        <div
            className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent pointer-events-none"
            aria-hidden="true"
        >
            <div
                className="h-full bg-accent origin-[var(--reading-origin,left)] transition-transform duration-100"
                style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
            />
        </div>
    )
}

export default ReadingProgress
