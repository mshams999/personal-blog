import React from 'react'
import { Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import Rule from '../components/editorial/Rule'
import Kicker from '../components/editorial/Kicker'
import MetaTags from '../components/MetaTags'

const AllCategoriesPage = () => {
    const { categories = [], getPostsByCategory } = useHybridData()

    const withCounts = categories
        .map((c) => ({ ...c, count: getPostsByCategory(c.id).length }))
        .sort((a, b) => b.count - a.count)

    const total = withCounts.reduce((n, c) => n + c.count, 0)

    return (
        <>
            <MetaTags
                title="التصنيفات"
                description="تصفح جميع التصنيفات — قصص، طب، قراءة، وسفر."
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header className="mb-8">
                    <Kicker className="mb-3">الفهرس</Kicker>
                    <h1 className="font-display text-display-xl md:text-display-2xl leading-[1.05] text-ink mb-4">
                        التصنيفات
                    </h1>
                    <p className="font-serif text-lg text-ink-muted leading-relaxed max-w-prose-editorial">
                        كل ما كُتب، مُصنَّفاً حسب الموضوع. {total} مقالة في {withCounts.length} تصنيفاً.
                    </p>
                </header>

                <Rule />

                {withCounts.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="font-serif text-ink-muted">لا توجد تصنيفات حالياً.</p>
                    </div>
                ) : (
                    <ul className="my-8">
                        {withCounts.map((cat, i) => (
                            <li key={cat.id} className={i === 0 ? '' : 'border-t border-rule'}>
                                <Link
                                    to={`/category/${cat.slug}`}
                                    className="group flex items-baseline justify-between gap-6 py-5 md:py-6"
                                >
                                    <span className="flex items-baseline gap-4">
                                        <span className="small-caps text-ink-muted/70 tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-display text-2xl md:text-3xl text-ink group-hover:text-accent transition-colors">
                                            {cat.name}
                                        </span>
                                    </span>
                                    <span className="small-caps text-ink-muted shrink-0">
                                        {cat.count} مقالة
                                    </span>
                                </Link>
                                {cat.description && (
                                    <p className="font-serif text-ink-muted leading-relaxed pb-5 max-w-prose-editorial">
                                        {cat.description}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default AllCategoriesPage
