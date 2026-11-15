import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Kicker from '../editorial/Kicker'
import { LibraryError } from './LibraryStatus'
import { useReadingJourney } from '../../hooks/useReadingJourney'
import { formatDateArabicFull, formatDateArabicShort } from '../../utils/dateFormat'
import { formatAuthors, statusLabels } from '../../utils/libraryFormat'
import { buildReadingJourney, durationLabel } from '../../utils/readingJourney'

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function formatJourneyDate(date, withYear) {
    return withYear ? formatDateArabicFull(date) : formatDateArabicShort(date)
}

function dateLabel(item) {
    if (!item.startedAt) return ''
    const crossesYear = item.finishedAt && item.startedAt.getFullYear() !== item.finishedAt.getFullYear()
    const start = formatJourneyDate(item.startedAt, crossesYear)
    if (!item.finishedAt) return `بدأ ${start}`
    return `${start} إلى ${formatJourneyDate(item.finishedAt, crossesYear)}`
}

function JourneyCard({ item }) {
    const authors = formatAuthors(item.authors)
    const duration = durationLabel(item.durationDays)
    const percent = item.current && typeof item.progress?.percent === 'number'
        ? Math.max(0, Math.min(100, Math.round(item.progress.percent)))
        : null
    const pages = item.current
        && typeof item.progress?.currentPage === 'number'
        && typeof item.progress?.pageCount === 'number'
        && item.progress.pageCount > 0
        ? `${item.progress.currentPage} من ${item.progress.pageCount}`
        : null
    const shellClass = `group block snap-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${item.current ? 'w-48' : 'w-40'}`
    const body = (
        <>
            <div className="relative z-10 mb-5 flex justify-center">
                <span
                    className={`h-3.5 w-3.5 rounded-full border-2 bg-paper ${item.current ? 'border-accent ring-4 ring-accent/20' : 'border-ink/35'}`}
                />
            </div>
            <div className={`smooth-card smooth-card-interactive overflow-hidden ${item.current ? 'border-accent/40' : ''}`}>
                <div className="aspect-[3/4] bg-rule/25">
                    {item.coverUrl ? (
                        <img src={item.coverUrl} alt={item.title || 'غلاف الكتاب'} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full flex-col justify-between p-4">
                            <span className="h-px w-8 bg-ink/20" />
                            <span className="font-display text-5xl leading-none text-ink/25">{item.title?.slice(0, 1) || 'ك'}</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <p className="small-caps text-accent">{item.current ? 'أقرأ الآن' : (statusLabels[item.status] || 'أنهيتُه')}</p>
                    <h3 dir="auto" className="mt-2 line-clamp-3 font-display text-2xl leading-snug text-ink group-hover:text-accent">
                        {item.title}
                    </h3>
                    {authors && <p className="mt-1 line-clamp-1 font-serif text-sm text-ink-muted">{authors}</p>}
                    <p className="mt-3 font-serif text-sm text-ink">{dateLabel(item)}</p>
                    {duration && <p className="mt-1 font-serif text-sm text-ink-muted">{duration}</p>}
                    {percent != null && (
                        <div className="mt-4">
                            <div className="h-1 w-full bg-rule" aria-hidden="true">
                                <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
                            </div>
                            <p className="mt-2 font-serif text-sm text-ink-muted">
                                <span dir="ltr" className="inline-block">{percent}%</span>
                            </p>
                            {pages && (
                                <p className="font-serif text-sm text-ink-muted">
                                    <span dir="ltr" className="inline-block">{item.progress.currentPage} / {item.progress.pageCount}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
    if (!item.href) return <div className={shellClass}>{body}</div>
    return (
        <Link to={item.href} className={shellClass} data-milestone-link>
            {body}
        </Link>
    )
}

export default function ReadingJourney() {
    const { status, finished, current, error, retry } = useReadingJourney()
    const [year, setYear] = useState(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)
    const scrollerRef = useRef(null)
    const journey = useMemo(
        () => buildReadingJourney({ finished, current, year: year ?? undefined }),
        [finished, current, year],
    )
    const milestones = journey.milestones
    const selectedYear = journey.year

    useEffect(() => {
        if (year == null && journey.years.length) setYear(journey.year)
    }, [year, journey.year, journey.years.length])

    const measure = () => {
        const el = scrollerRef.current
        if (!el) return
        const cards = [...el.querySelectorAll('[data-milestone]')]
        const first = cards[0]
        const last = cards[cards.length - 1]
        if (!first || !last) {
            setAtStart(true)
            setAtEnd(true)
            return
        }
        const box = el.getBoundingClientRect()
        const firstBox = first.getBoundingClientRect()
        const lastBox = last.getBoundingClientRect()
        setAtStart(firstBox.right <= box.right + 8)
        setAtEnd(lastBox.left >= box.left - 8)
    }

    useEffect(() => {
        const el = scrollerRef.current
        if (!el) return undefined
        const frame = requestAnimationFrame(measure)
        el.addEventListener('scroll', measure, { passive: true })
        window.addEventListener('resize', measure)
        return () => {
            cancelAnimationFrame(frame)
            el.removeEventListener('scroll', measure)
            window.removeEventListener('resize', measure)
        }
    }, [status, selectedYear, milestones.length])

    const anchorIndex = () => {
        const el = scrollerRef.current
        if (!el) return 0
        const cards = [...el.querySelectorAll('[data-milestone]')]
        const edge = el.getBoundingClientRect().right
        let best = 0
        let bestDistance = Infinity
        cards.forEach((card, index) => {
            const distance = Math.abs(card.getBoundingClientRect().right - edge)
            if (distance < bestDistance) {
                best = index
                bestDistance = distance
            }
        })
        return best
    }

    const move = (step) => {
        const el = scrollerRef.current
        if (!el) return
        const cards = [...el.querySelectorAll('[data-milestone]')]
        const next = Math.max(0, Math.min(cards.length - 1, anchorIndex() + step))
        cards[next]?.scrollIntoView({
            inline: 'start',
            block: 'nearest',
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            move(1)
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            move(-1)
        }
    }

    if (status === 'error') {
        return (
            <section className="pt-8 md:pt-12">
                <LibraryError error={error} onRetry={retry} />
            </section>
        )
    }

    if (status === 'loading') {
        return (
            <section className="pt-8 md:pt-12" aria-busy="true" aria-live="polite">
                <div className="h-4 w-28 animate-pulse bg-rule/50" />
                <div className="mt-6 flex gap-6 overflow-hidden">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="h-80 w-40 shrink-0 animate-pulse rounded-[1.1rem] bg-rule/40" />
                    ))}
                </div>
            </section>
        )
    }

    if (!journey.years.length) return null

    return (
        <section className="min-w-0 pt-8 md:pt-12" aria-labelledby="reading-journey-title">
            <header className="mb-8 flex flex-col gap-4 border-b border-rule pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Kicker className="mb-2">القراءة</Kicker>
                    <h2 id="reading-journey-title" className="font-display text-display-lg leading-[1.1] text-ink">
                        رحلة القراءة
                    </h2>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {journey.years.length > 1 && (
                        <div role="group" aria-label="سنة الرحلة" className="flex gap-3">
                            {journey.years.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    aria-pressed={item === selectedYear}
                                    onClick={() => setYear(item)}
                                    className={`small-caps focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${item === selectedYear ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => move(-1)}
                            disabled={atStart}
                            className="small-caps text-ink-muted hover:text-ink disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                            السابق
                        </button>
                        <button
                            type="button"
                            onClick={() => move(1)}
                            disabled={atEnd}
                            className="small-caps text-ink-muted hover:text-ink disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </header>

            {milestones.length === 0 ? (
                <p className="font-serif text-lg text-ink-muted">لا توجد قراءة مسجّلة في {selectedYear}.</p>
            ) : (
                <div
                    ref={scrollerRef}
                    tabIndex={0}
                    role="region"
                    aria-label={`رحلة القراءة في ${selectedYear}`}
                    onKeyDown={onKeyDown}
                    dir="rtl"
                    className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:scroll-auto"
                >
                    <div className="relative flex w-max gap-8 pe-2">
                        {milestones.map((item, index) => {
                            const next = milestones[index + 1]
                            const halfNext = next ? (next.current ? '6rem' : '5rem') : null
                            return (
                                <div key={item.key} data-milestone className="relative shrink-0">
                                    {halfNext && (
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute top-[6px] z-0 h-px ${next.current ? 'bg-accent/70' : 'bg-rule'}`}
                                            style={{ insetInlineStart: '50%', width: `calc(50% + 2rem + ${halfNext})` }}
                                        />
                                    )}
                                    <JourneyCard item={item} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    )
}
