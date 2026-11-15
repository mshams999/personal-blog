import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import BookProgress from '../../components/library/BookProgress'
import {
    archiveBook,
    deleteBook,
    draftForAction,
    listLibrary,
    saveBook,
} from '../../services/adminBookService'
import { READING_STATUSES } from '../../services/readingPlan'
import { formatAuthors, statusLabels } from '../../utils/libraryFormat'

export default function LibraryAdminPage() {
    const [books, setBooks] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState('')
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('all')
    const [pageDrafts, setPageDrafts] = useState({})

    const load = () => {
        setStatus('loading')
        listLibrary().then((result) => {
            setBooks(result.books)
            setStatus('ready')
        }).catch((loadError) => {
            setError(loadError.message || 'تعذّر تحميل المكتبة.')
            setStatus('error')
        })
    }

    useEffect(() => { load() }, [])

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase()
        return books.filter((book) => {
            if (filter !== 'all' && book.readingStatus !== filter) return false
            if (!needle) return true
            const authors = formatAuthors(book.authors).toLowerCase()
            return book.title?.toLowerCase().includes(needle) || authors.includes(needle)
        })
    }, [books, filter, query])

    const run = async (book, action) => {
        setError('')
        try {
            await action()
            load()
        } catch (actionError) {
            setError(actionError.message || `تعذّر تحديث «${book.title}».`)
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags title="مكتبة القراءة" description="أدر الكتب التي تقرأها." url="https://mohamedshams.com/admin/books" type="website" />
            <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeader as="h1" kicker="المكتبة" title="مكتبة القراءة" />
                <div className="flex flex-wrap gap-2">
                    <Link to="/admin/books/import" className="small-caps border border-rule px-4 py-2 text-ink hover:border-ink">استيراد من غودريدز</Link>
                    <Link to="/admin/books/new" className="small-caps border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-paper">أضف كتابًا</Link>
                </div>
            </div>
            <p className="mt-4 max-w-2xl font-serif text-lg text-ink-muted">يمكن قراءة أكثر من كتاب في الوقت نفسه.</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ابحث بالعنوان أو المؤلف"
                    aria-label="ابحث في المكتبة"
                    className="w-full border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent sm:max-w-sm"
                />
                <div className="flex flex-wrap gap-2">
                    <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>الكل</FilterButton>
                    {READING_STATUSES.map((item) => (
                        <FilterButton key={item} active={filter === item} onClick={() => setFilter(item)}>{statusLabels[item]}</FilterButton>
                    ))}
                </div>
            </div>

            {error && <p className="mt-6 font-serif text-ink">{error}</p>}
            {status === 'loading' && <p className="mt-8 font-serif text-ink-muted">جارٍ التحميل…</p>}
            {status === 'ready' && visible.length === 0 && <p className="mt-8 font-serif text-ink-muted">لا توجد كتب مطابقة.</p>}

            <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {visible.map((book) => (
                    <li key={book.id} className="smooth-card grid gap-4 p-4 sm:grid-cols-[7rem_1fr]">
                        <div className="aspect-[3/4] bg-rule/30">
                            {book.coverUrl ? <img src={book.coverUrl} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div>
                            <p className="small-caps text-accent">{statusLabels[book.readingStatus] || book.readingStatus}{book.visibility === 'public' ? '' : ' · غير مدرج'}</p>
                            <h2 className="mt-2 font-display text-3xl text-ink">{book.title}</h2>
                            <p className="mt-1 font-serif text-ink-muted">{formatAuthors(book.authors)}</p>
                            <div className="mt-4 max-w-sm"><BookProgress progress={book.progressView} /></div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link to={`/admin/books/${book.id}/edit`} className="small-caps border border-rule px-3 py-1">تعديل</Link>
                                {book.readingStatus !== 'reading' && (
                                    <button type="button" className="small-caps border border-rule px-3 py-1" onClick={() => run(book, () => saveBook(draftForAction(book, { readingStatus: 'reading' }), { existingId: book.id }))}>أقرأ الآن</button>
                                )}
                                {book.readingStatus !== 'finished' && (
                                    <button type="button" className="small-caps border border-rule px-3 py-1" onClick={() => run(book, () => saveBook(draftForAction(book, { readingStatus: 'finished' }), { existingId: book.id }))}>أنهيتُه</button>
                                )}
                                <button type="button" className="small-caps border border-rule px-3 py-1" onClick={() => {
                                    if (window.confirm(`أرشفة «${book.title}»؟ سيختفي من المكتبة العامة.`)) {
                                        run(book, () => archiveBook(book))
                                    }
                                }}>أرشفة</button>
                                <button type="button" className="small-caps border border-rule px-3 py-1" onClick={() => {
                                    if (window.confirm(`حذف «${book.title}»؟ لا يمكن التراجع عن ذلك.`)) {
                                        run(book, () => deleteBook(book.id))
                                    }
                                }}>حذف</button>
                            </div>
                            <form className="mt-4 flex gap-2" onSubmit={(event) => {
                                event.preventDefault()
                                run(book, () => saveBook(draftForAction(book, { currentPage: pageDrafts[book.id] ?? book.currentPage ?? '' }), { existingId: book.id }))
                            }}>
                                <input
                                    aria-label={`الصفحة الحالية لـ ${book.title}`}
                                    inputMode="numeric"
                                    value={pageDrafts[book.id] ?? book.currentPage ?? ''}
                                    onChange={(event) => setPageDrafts((current) => ({ ...current, [book.id]: event.target.value }))}
                                    className="w-24 border border-rule bg-paper px-2 py-1 font-serif text-ink"
                                />
                                <button type="submit" className="small-caps text-accent">تحديث الصفحة</button>
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function FilterButton({ active, onClick, children }) {
    return (
        <button type="button" onClick={onClick} className={`small-caps border px-3 py-1 ${active ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'}`}>
            {children}
        </button>
    )
}
