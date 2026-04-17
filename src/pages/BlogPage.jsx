import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import PostCard from '../components/PostCard'
import Rule from '../components/editorial/Rule'
import Kicker from '../components/editorial/Kicker'
import MetaTags from '../components/MetaTags'
import { useBulkArticleViews } from '../hooks/useFirebaseViews'

const POSTS_PER_PAGE = 12

const BlogPage = () => {
    const { getAllPosts, categories } = useHybridData()
    const [searchParams, setSearchParams] = useSearchParams()

    const currentPage = parseInt(searchParams.get('page')) || 1
    const selectedCategory = searchParams.get('category')

    const allPosts = useMemo(() => {
        const posts = getAllPosts()
        return selectedCategory ? posts.filter((p) => p.categoryId === selectedCategory) : posts
    }, [selectedCategory, getAllPosts])

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE
        return allPosts.slice(start, start + POSTS_PER_PAGE)
    }, [currentPage, allPosts])

    const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
    const { getViewCount } = useBulkArticleViews(paginated)

    const setCategory = (id) => {
        if (id) setSearchParams({ category: id, page: '1' })
        else setSearchParams({})
    }
    const setPage = (p) => {
        const params = new URLSearchParams()
        if (selectedCategory) params.set('category', selectedCategory)
        params.set('page', String(p))
        setSearchParams(params)
        window.scrollTo(0, 0)
    }

    const activeCategory = categories?.find((c) => c.id === selectedCategory)
    const [feature, ...rest] = paginated
    const standard = rest.slice(0, 4)
    const notes = rest.slice(4)

    return (
        <>
            <MetaTags
                title="المقالات"
                description="جميع مقالات المدونة — قصص من المناوبات وخواطر في الطب والقراءة."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Header */}
                <header className="mb-10">
                    <Kicker className="mb-3">المدونة</Kicker>
                    <h1 className="font-display text-display-xl md:text-display-2xl leading-[1.05] text-ink">
                        {activeCategory ? activeCategory.name : 'المقالات'}
                    </h1>
                    <p className="small-caps text-ink-muted mt-4">
                        {allPosts.length} مقالة
                        {activeCategory ? <> · ضمن تصنيف {activeCategory.name}</> : null}
                    </p>
                </header>

                <Rule />

                {/* Category filter rail */}
                <nav
                    className="flex flex-wrap gap-x-5 gap-y-3 my-8"
                    aria-label="تصفية حسب التصنيف"
                >
                    <button
                        onClick={() => setCategory(null)}
                        className={`small-caps pb-1 border-b transition-colors ${
                            !selectedCategory
                                ? 'border-accent text-ink'
                                : 'border-transparent text-ink-muted hover:text-ink'
                        }`}
                    >
                        الكل
                    </button>
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`small-caps pb-1 border-b transition-colors ${
                                selectedCategory === cat.id
                                    ? 'border-accent text-ink'
                                    : 'border-transparent text-ink-muted hover:text-ink'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </nav>

                <Rule />

                {paginated.length === 0 ? (
                    <div className="py-20 text-center">
                        <h2 className="font-display text-2xl text-ink mb-2">لا توجد مقالات بعد</h2>
                        <div className="mx-auto w-16 border-t border-rule my-4" />
                        <p className="font-serif text-ink-muted mb-6">
                            جرّب تصنيفاً آخر أو عُد إلى الصفحة الرئيسية.
                        </p>
                        <Link
                            to="/"
                            className="small-caps border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5"
                        >
                            العودة للرئيسية →
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Feature */}
                        {feature && (
                            <section className="my-12 reveal-up">
                                <PostCard
                                    post={feature}
                                    variant="feature"
                                    viewCount={getViewCount(feature.slug)}
                                />
                            </section>
                        )}

                        {/* Standard rows */}
                        {standard.length > 0 && (
                            <section className="my-12 space-y-12">
                                {standard.map((p, i) => (
                                    <div
                                        key={p.id || p.slug}
                                        className={i > 0 ? 'pt-12 border-t border-rule' : ''}
                                    >
                                        <PostCard
                                            post={p}
                                            variant="standard"
                                            viewCount={getViewCount(p.slug)}
                                        />
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Notes grid */}
                        {notes.length > 0 && (
                            <section className="my-12">
                                <Rule ornament="•" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mt-10">
                                    {notes.map((p) => (
                                        <PostCard
                                            key={p.id || p.slug}
                                            post={p}
                                            variant="note"
                                            viewCount={getViewCount(p.slug)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav
                                className="mt-16 pt-6 border-t border-rule flex items-center justify-between"
                                aria-label="تصفح الصفحات"
                            >
                                <button
                                    onClick={() => setPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="small-caps border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    ← السابقة
                                </button>
                                <p className="small-caps text-ink-muted">
                                    صفحة {currentPage} من {totalPages}
                                </p>
                                <button
                                    onClick={() => setPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="small-caps border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    التالية →
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default BlogPage
