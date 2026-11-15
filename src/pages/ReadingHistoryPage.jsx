import { Link } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import SectionHeader from '../components/editorial/SectionHeader'
import { LibraryEmpty, LibraryError, LibraryLoading } from '../components/library/LibraryStatus'
import { useReadingHistory } from '../hooks/useReadingHistory'
import { formatAuthors, formatRating, formatTimestamp } from '../utils/libraryFormat'

export default function ReadingHistoryPage() {
    const { status, entries, error, retry } = useReadingHistory()

    return (
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 md:pt-14">
            <MetaTags
                title="سجل القراءة"
                description="الكتب التي أنهى محمد شمس قراءتها."
                url="https://mohamedshams.com/reading"
                type="website"
            />
            <SectionHeader
                as="h1"
                kicker="القراءة"
                title="سجل القراءة"
                trailing={<Link to="/library" className="small-caps text-accent hover:text-ink">المكتبة</Link>}
            />

            {status === 'loading' && <LibraryLoading />}
            {status === 'error' && <LibraryError error={error} onRetry={retry} />}
            {status === 'empty' && <LibraryEmpty>لا توجد جلسات منتهية في السجل العام.</LibraryEmpty>}

            {status === 'ready' && (
                <ol className="divide-y divide-rule border-y border-rule">
                    {entries.map((entry) => {
                        const authors = formatAuthors(entry.authors)
                        const title = entry.book ? (
                            <Link to={`/library/${entry.book.id}`} className="hover:text-accent">
                                {entry.title}
                            </Link>
                        ) : (
                            entry.title
                        )
                        return (
                            <li key={entry.key} className="py-6">
                                <h2 className="font-display text-3xl leading-snug text-ink">{title}</h2>
                                {authors && <p className="mt-2 font-serif text-ink-muted">{authors}</p>}
                                <p className="small-caps mt-3">
                                    {formatTimestamp(entry.finishedAt)}
                                    {formatRating(entry.rating) ? ` · ${formatRating(entry.rating)}` : ''}
                                </p>
                            </li>
                        )
                    })}
                </ol>
            )}
        </div>
    )
}
