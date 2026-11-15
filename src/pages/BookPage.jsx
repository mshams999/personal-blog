import { Link, useParams } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import StoryblokContent from '../components/StoryblokContent'
import SectionHeader from '../components/editorial/SectionHeader'
import BookProgress from '../components/library/BookProgress'
import { LibraryEmpty, LibraryError, LibraryLoading } from '../components/library/LibraryStatus'
import { useAuth } from '../context/AuthContext'
import { useBookReview } from '../hooks/useBookReview'
import { usePublicBook } from '../hooks/usePublicBook'
import { storyblokAdminUrl, storyblokStoryUrl } from '../lib/storyblok'
import {
    formatAuthors,
    formatLanguage,
    formatList,
    formatRating,
    formatTimestamp,
    formatLabels,
    statusLabels,
} from '../utils/libraryFormat'

function MetaRow({ label, value }) {
    if (!value) return null
    return (
        <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-rule py-3">
            <dt className="small-caps">{label}</dt>
            <dd className="font-serif text-ink">{value}</dd>
        </div>
    )
}

function BookReview({ bookId, review, isOwner }) {
    const editUrl = review?.id ? storyblokStoryUrl(review.id) : storyblokAdminUrl
    if (!review?.body && !isOwner) return null
    return (
        <section className="mt-16 max-w-3xl">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-3xl text-ink">قراءة شخصية</h2>
                {isOwner && (
                    <a href={editUrl} className="small-caps text-accent" target="_blank" rel="noreferrer">
                        {review?.body ? 'تعديل المراجعة' : 'اكتب المراجعة في ستوريبلوك'}
                    </a>
                )}
            </div>
            {review?.body ? (
                <div className="book-review mt-6 font-serif text-lg leading-relaxed text-ink">
                    <StoryblokContent content={review.body} />
                </div>
            ) : (
                <p className="mt-4 font-serif text-lg text-ink-muted">
                    أنشئ في ستوريبلوك قصة داخل المجلد library باسم {bookId}، واختر النوع Page، ثم اكتب المراجعة في حقل Body.
                </p>
            )}
        </section>
    )
}

export default function BookPage() {
    const { slug } = useParams()
    const { status, book, sessions, error, retry } = usePublicBook(slug)
    const review = useBookReview(slug)
    const { user } = useAuth()
    const isOwner = Boolean(user?.email) && user.email === import.meta.env.VITE_OWNER_EMAIL

    if (status === 'notFound') {
        return (
            <div className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6">
                <MetaTags
                    title="الكتاب غير موجود"
                    description="هذا الكتاب غير متاح في المكتبة العامة."
                    url={`https://mohamedshams.com/library/${slug || ''}`}
                    type="website"
                />
                <h1 className="font-display text-4xl text-ink">الكتاب غير موجود</h1>
                <p className="mt-4 font-serif text-lg text-ink-muted">هذا الكتاب غير متاح في المكتبة العامة.</p>
                <Link to="/library" className="small-caps mt-8 inline-block text-accent hover:text-ink">
                    العودة إلى المكتبة
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            {status === 'loading' && <LibraryLoading />}
            {status === 'error' && <LibraryError error={error} onRetry={retry} />}
            {status === 'ready' && book && (
                <>
                    <MetaTags
                        title={book.title}
                        description={book.description || formatAuthors(book.authors)}
                        image={book.coverUrl || undefined}
                        url={`https://mohamedshams.com/library/${book.id}`}
                        type="website"
                    />
                    <Link to="/library" className="small-caps mb-8 inline-block text-accent hover:text-ink">
                        المكتبة
                    </Link>
                    <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:gap-12">
                        <div className="aspect-[3/4] bg-rule/30">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                            ) : null}
                        </div>
                        <div>
                            <SectionHeader as="h1" kicker={formatLanguage(book.language)} title={book.title} />
                            <p className="font-serif text-xl text-ink-muted">{formatAuthors(book.authors)}</p>
                            {book.description && (
                                <p className="mt-6 font-serif text-lg leading-relaxed text-ink">{book.description}</p>
                            )}
                            <dl className="mt-8">
                                <MetaRow label="ISBN-13" value={book.isbn13} />
                                <MetaRow label="ISBN-10" value={book.isbn10} />
                                <MetaRow label="الناشر" value={book.publisher} />
                                <MetaRow label="السنة" value={book.publishedYear} />
                                <MetaRow label="الصفحات" value={book.pageCount} />
                                <MetaRow label="التصنيف" value={formatList(book.categories)} />
                                <MetaRow label="الصيغة" value={formatList(book.formats, formatLabels)} />
                            </dl>
                        </div>
                    </div>

                    <BookReview bookId={book.id} review={review} isOwner={isOwner} />

                    <section className="mt-16">
                        <h2 className="font-display text-3xl text-ink">جلسات القراءة</h2>
                        {sessions.length === 0 ? (
                            <div className="mt-6">
                                <LibraryEmpty>لا توجد جلسات قراءة عامة لهذا الكتاب.</LibraryEmpty>
                            </div>
                        ) : (
                            <ol className="mt-6 divide-y divide-rule border-y border-rule">
                                {sessions.map((session) => (
                                    <li key={session.key} className="py-5">
                                        <p className="small-caps text-accent">{statusLabels[session.status] || session.status}</p>
                                        <p className="mt-2 font-serif text-ink">
                                            {formatTimestamp(session.startedAt)}
                                            {session.finishedAt ? ` — ${formatTimestamp(session.finishedAt)}` : ''}
                                        </p>
                                        {formatRating(session.rating) && (
                                            <p className="mt-2 font-serif text-ink-muted">{formatRating(session.rating)}</p>
                                        )}
                                        <div className="mt-3 max-w-xs">
                                            <BookProgress progress={session.progress} />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </>
            )}
        </div>
    )
}
