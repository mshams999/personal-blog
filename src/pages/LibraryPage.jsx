import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import SectionHeader from '../components/editorial/SectionHeader'
import BookCard from '../components/library/BookCard'
import LibraryStats from '../components/library/LibraryStats'
import { LibraryEmpty, LibraryError, LibraryLoading } from '../components/library/LibraryStatus'
import { useLibraryCatalog } from '../hooks/useLibraryCatalog'
import { formatLabels, languageLabels } from '../utils/libraryFormat'

function normalize(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .trim()
}

function matchesQuery(book, query) {
    if (!query) return true
    const haystack = normalize([book.title, ...(book.authors || [])].join(' '))
    return haystack.includes(query)
}

export default function LibraryPage() {
    const { status, books, error, retry } = useLibraryCatalog()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [language, setLanguage] = useState('')
    const [format, setFormat] = useState('')
    const [readingStatus, setReadingStatus] = useState('')

    const categories = useMemo(() => {
        const values = new Set()
        books.forEach((book) => (book.categories || []).forEach((item) => values.add(item)))
        return [...values].sort((a, b) => a.localeCompare(b, 'ar'))
    }, [books])

    const languages = useMemo(() => {
        const values = new Set(books.map((book) => book.language).filter(Boolean))
        return [...values]
    }, [books])

    const formats = useMemo(() => {
        const values = new Set()
        books.forEach((book) => (book.formats || []).forEach((item) => values.add(item)))
        return [...values]
    }, [books])

    const visible = useMemo(() => {
        const query = normalize(search)
        return books
            .filter((book) => matchesQuery(book, query))
            .filter((book) => !category || (book.categories || []).includes(category))
            .filter((book) => !language || book.language === language)
            .filter((book) => !format || (book.formats || []).includes(format))
            .filter((book) => !readingStatus || book.readingStatus === readingStatus)
            .slice()
            .sort((a, b) => (a.sortAuthor || a.title || '').localeCompare(b.sortAuthor || b.title || '', 'ar'))
    }, [books, search, category, language, format, readingStatus])

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags
                title="المكتبة"
                description="كتب محمد شمس المتاحة للقراءة العامة."
                url="https://mohamedshams.com/library"
                type="website"
            />
            <SectionHeader
                as="h1"
                kicker="القراءة"
                title="المكتبة"
                trailing={<Link to="/reading" className="small-caps text-accent hover:text-ink">سجل القراءة</Link>}
            />

            {status === 'loading' && <LibraryLoading />}
            {status === 'error' && <LibraryError error={error} onRetry={retry} />}
            {status === 'empty' && <LibraryEmpty>لا توجد كتب عامة بعد.</LibraryEmpty>}

            {status === 'ready' && (
                <>
                    <LibraryStats books={books} active={readingStatus} onChange={setReadingStatus} />
                    <div className="mb-10 grid gap-3 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="ابحث بالعنوان أو المؤلف"
                            aria-label="ابحث بالعنوان أو المؤلف"
                            className="border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent"
                        />
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            aria-label="التصنيف"
                            className="border border-rule bg-paper px-3 py-2 font-serif text-ink"
                        >
                            <option value="">كل التصنيفات</option>
                            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <select
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                            aria-label="اللغة"
                            className="border border-rule bg-paper px-3 py-2 font-serif text-ink"
                        >
                            <option value="">كل اللغات</option>
                            {languages.map((item) => (
                                <option key={item} value={item}>{languageLabels[item] || item}</option>
                            ))}
                        </select>
                        <select
                            value={format}
                            onChange={(event) => setFormat(event.target.value)}
                            aria-label="الصيغة"
                            className="border border-rule bg-paper px-3 py-2 font-serif text-ink"
                        >
                            <option value="">كل الصيغ</option>
                            {formats.map((item) => (
                                <option key={item} value={item}>{formatLabels[item] || item}</option>
                            ))}
                        </select>
                    </div>

                    {visible.length === 0 ? (
                        <LibraryEmpty>{readingStatus ? 'لا توجد كتب في هذه القائمة.' : 'لا توجد كتب تطابق البحث.'}</LibraryEmpty>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                            {visible.map((book) => <BookCard key={book.id} book={book} />)}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
