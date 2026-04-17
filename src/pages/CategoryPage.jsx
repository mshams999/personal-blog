import React, { useEffect, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import PostCard from '../components/PostCard'
import Rule from '../components/editorial/Rule'
import Kicker from '../components/editorial/Kicker'
import SectionHeader from '../components/editorial/SectionHeader'
import MetaTags from '../components/MetaTags'
import { useBulkArticleViews } from '../hooks/useFirebaseViews'
import {
    generateCollectionPageSchema,
    generateBreadcrumbSchema,
    insertMultipleSchemas,
} from '../utils/schemaGenerator'

const CategoryPage = () => {
    const { categorySlug } = useParams()
    const { getCategoryBySlug, getPostsByCategory, categories } = useHybridData()

    const category = getCategoryBySlug(categorySlug)

    const posts = useMemo(() => {
        if (!category) return []
        return getPostsByCategory(category.id).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )
    }, [category, getPostsByCategory])

    const { getViewCount } = useBulkArticleViews(posts)
    const others = (categories || []).filter((c) => c.slug !== categorySlug)

    useEffect(() => {
        if (!category) return
        const schemas = []
        const cp = generateCollectionPageSchema(category, posts)
        if (cp) schemas.push({ schema: cp, id: 'collection-page' })
        const bc = generateBreadcrumbSchema([
            { name: 'الرئيسية', url: '/' },
            { name: 'التصنيفات', url: '/categories' },
            { name: category.name, url: `/category/${category.slug}` },
        ])
        if (bc) schemas.push({ schema: bc, id: 'breadcrumb' })
        if (schemas.length) insertMultipleSchemas(schemas)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.id])

    if (!category) return <Navigate to="/categories" replace />

    const [feature, ...rest] = posts
    const standard = rest.slice(0, 4)
    const notes = rest.slice(4)

    return (
        <>
            <MetaTags
                title={category.name}
                description={category.description || `مقالات ضمن تصنيف ${category.name}`}
                url={`${window.location.origin}/category/${category.slug}`}
                type="website"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Link to="/categories"><Kicker>التصنيفات</Kicker></Link>
                        <span className="text-ink-muted/40">·</span>
                        <Kicker>{category.name}</Kicker>
                    </div>
                    <h1 className="font-display text-display-xl md:text-display-2xl leading-[1.05] text-ink mb-4">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="font-serif text-lg text-ink-muted leading-relaxed max-w-prose-editorial">
                            {category.description}
                        </p>
                    )}
                    <p className="small-caps text-ink-muted mt-4">{posts.length} مقالة</p>
                </header>

                <Rule />

                {posts.length === 0 ? (
                    <div className="py-20 text-center">
                        <h2 className="font-display text-2xl text-ink mb-2">
                            لا توجد مقالات في هذا التصنيف
                        </h2>
                        <div className="mx-auto w-16 border-t border-rule my-4" />
                        <Link
                            to="/blog"
                            className="small-caps border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5"
                        >
                            تصفح جميع المقالات →
                        </Link>
                    </div>
                ) : (
                    <>
                        {feature && (
                            <section className="my-12 reveal-up">
                                <PostCard post={feature} variant="feature" viewCount={getViewCount(feature.slug)} />
                            </section>
                        )}

                        {standard.length > 0 && (
                            <section className="my-12 space-y-12">
                                {standard.map((p, i) => (
                                    <div key={p.id || p.slug} className={i > 0 ? 'pt-12 border-t border-rule' : ''}>
                                        <PostCard post={p} variant="standard" viewCount={getViewCount(p.slug)} />
                                    </div>
                                ))}
                            </section>
                        )}

                        {notes.length > 0 && (
                            <section className="my-12">
                                <Rule ornament="•" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mt-10">
                                    {notes.map((p) => (
                                        <PostCard key={p.id || p.slug} post={p} variant="note" viewCount={getViewCount(p.slug)} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {others.length > 0 && (
                    <section className="mt-24">
                        <SectionHeader kicker="أقسام أخرى" title="استكشف التصنيفات" />
                        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-5">
                            {others.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/category/${cat.slug}`}
                                        className="group flex items-baseline justify-between gap-4 py-3 border-b border-rule hover:border-accent transition-colors"
                                    >
                                        <span className="font-display text-lg text-ink group-hover:text-accent transition-colors">
                                            {cat.name}
                                        </span>
                                        <span className="small-caps text-ink-muted">
                                            {getPostsByCategory(cat.id).length}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    )
}

export default CategoryPage
