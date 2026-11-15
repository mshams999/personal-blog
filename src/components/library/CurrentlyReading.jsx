import { Link } from 'react-router-dom'
import { useCurrentReading } from '../../hooks/useCurrentReading'
import { formatAuthors } from '../../utils/libraryFormat'
import { LibraryError } from './LibraryStatus'

function readingCue(progress) {
    const current = progress?.currentPage
    const total = progress?.pageCount
    const percent = typeof progress?.percent === 'number'
        ? Math.max(0, Math.min(100, Math.round(progress.percent)))
        : null
    const knownLength = typeof total === 'number' && total > 0
    const started = typeof current === 'number' && current > 0

    if (knownLength && !started) {
        return { percent: percent ?? 0, line: `كتاب من ${total} صفحة. الصفحة الأولى بانتظارك.` }
    }
    if (knownLength && started && current < total) {
        return { percent: percent ?? 0, line: `قرأت ${current} صفحة، وبقيت ${total - current}.` }
    }
    if (knownLength && started) {
        return { percent: 100, line: 'أوشكت على إغلاق الكتاب.' }
    }
    if (percent != null && percent > 0) {
        return { percent, line: `أكملت ${percent}٪ من الكتاب.` }
    }
    return { percent, line: 'عد إلى الصفحة التي توقفت عندها.' }
}

export default function CurrentlyReading() {
    const { status, book, progress, error, retry } = useCurrentReading()

    if (status === 'hidden') return null

    if (status === 'loading') {
        return (
            <div className="pt-8 md:pt-12" aria-busy="true" aria-live="polite">
                <div className="h-96 w-full max-w-[18rem] animate-pulse rounded-[1.1rem] bg-rule/40" />
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="pt-8 md:pt-12">
                <LibraryError error={error} onRetry={retry} />
            </div>
        )
    }

    const authors = formatAuthors(book.authors)
    const cue = readingCue(progress)

    return (
        <section className="pt-8 md:pt-12" aria-label="القراءة الحالية">
            <Link
                to={`/library/${book.id}`}
                aria-label={`أقرأ الآن: ${book.title}`}
                className="smooth-card smooth-card-interactive group flex w-full max-w-[18rem] flex-col overflow-hidden"
            >
                <div className="aspect-[3/4] bg-rule/30">
                    {book.coverUrl ? (
                        <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-end p-5">
                            <span className="font-display text-5xl text-ink/25">{book.title?.slice(0, 1)}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                    <p className="small-caps text-accent">أقرأ الآن</p>
                    <h2 className="mt-2 font-display text-3xl leading-tight text-ink group-hover:text-accent">
                        {book.title}
                    </h2>
                    {authors && <p className="mt-2 font-serif text-ink-muted">{authors}</p>}
                    <p className="mt-4 font-serif leading-relaxed text-ink">{cue.line}</p>
                    {cue.percent != null && (
                        <div className="mt-4 h-1 w-full bg-rule" aria-hidden="true">
                            <div className="h-full bg-accent" style={{ width: `${cue.percent}%` }} />
                        </div>
                    )}
                    <p className="small-caps mt-5 text-accent">تابع القراءة</p>
                </div>
            </Link>
        </section>
    )
}
