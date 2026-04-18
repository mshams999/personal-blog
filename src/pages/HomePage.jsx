import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import MastheadLead from '../components/MastheadLead'
import BentoGrid from '../components/BentoGrid'
import Newsletter from '../components/Newsletter'
import PostCard from '../components/PostCard'
import MetaTags from '../components/MetaTags'
import Rule from '../components/editorial/Rule'
import SectionHeader from '../components/editorial/SectionHeader'
import Kicker from '../components/editorial/Kicker'
import { useBulkArticleViews } from '../hooks/useFirebaseViews'
import {
    generateWebsiteSchema,
    generatePersonSchema,
    generateOrganizationSchema,
    insertMultipleSchemas,
} from '../utils/schemaGenerator'

/**
 * Editorial HomePage
 *   1. Masthead lead (hero post, asymmetric bento)
 *   2. Latest bento grid (6 cells: 1 feature + 5 notes)
 *   3. By-category rail (horizontal scroll-snap per category)
 *   4. About strip + Newsletter
 */
const HomePage = () => {
    const { siteMetadata, getRecentPosts, categories = [], loading } = useHybridData()

    const recentPosts = useMemo(() => {
        try {
            return getRecentPosts(20).sort((a, b) => new Date(b.date) - new Date(a.date))
        } catch {
            return []
        }
    }, [getRecentPosts])

    const leadPost = recentPosts[0]
    const bentoPosts = recentPosts.slice(1, 7)
    const remaining = recentPosts.slice(7)

    const { getViewCount } = useBulkArticleViews(remaining)

    useEffect(() => {
        insertMultipleSchemas([
            { schema: generateWebsiteSchema(), id: 'website' },
            { schema: generatePersonSchema(), id: 'person' },
            { schema: generateOrganizationSchema(), id: 'organization' },
        ])
    }, [])

    // Group posts by category for the rail
    const postsByCategory = useMemo(() => {
        const map = {}
        categories.forEach((cat) => {
            map[cat.id] = recentPosts.filter((p) => p.categoryId === cat.id).slice(0, 6)
        })
        return map
    }, [categories, recentPosts])

    if (loading && recentPosts.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <p className="small-caps text-ink-muted">جارٍ التحميل…</p>
            </div>
        )
    }

    return (
        <>
            <MetaTags
                title={siteMetadata?.title || 'د. محمد شمس'}
                description={siteMetadata?.description}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1 — Masthead Lead */}
                <div className="pt-12 md:pt-20 pb-16 md:pb-20">
                    {leadPost && <MastheadLead post={leadPost} />}
                </div>

                <Rule ornament="•" />

                {/* 2 — Latest bento grid */}
                <section className="py-16 md:py-20 reveal-up delay-1">
                    <SectionHeader
                        kicker="الأحدث"
                        title="أحدث ما كُتب"
                        className="mb-10 md:mb-12"
                    />
                    <BentoGrid posts={bentoPosts} />
                </section>

                <Rule ornament="✦" />

                {/* 3 — By category rails */}
                <section className="py-16 md:py-20 space-y-16">
                    {categories
                        .filter((cat) => (postsByCategory[cat.id] || []).length > 0)
                        .slice(0, 4)
                        .map((cat, idx) => {
                            const items = postsByCategory[cat.id] || []
                            return (
                                <div key={cat.id} className={`reveal-up delay-${Math.min(idx + 1, 4)}`}>
                                    <div className="flex items-end justify-between mb-6 gap-6">
                                        <SectionHeader kicker={cat.name} title={cat.description || cat.name} />
                                        <Link
                                            to={`/category/${cat.slug}`}
                                            className="small-caps shrink-0 border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5"
                                        >
                                            المزيد →
                                        </Link>
                                    </div>
                                    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto snap-x snap-mandatory scroll-smooth">
                                        <ul className="flex gap-8 md:gap-10 min-w-max md:min-w-0 md:grid md:grid-cols-3 md:gap-10">
                                            {items.slice(0, 3).map((post) => (
                                                <li
                                                    key={post.id || post.slug}
                                                    className="snap-start w-[78vw] sm:w-[50vw] md:w-auto shrink-0"
                                                >
                                                    <PostCard post={post} variant="note" viewCount={getViewCount(post.slug)} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })}
                </section>

                <Rule ornament="•" />

                {/* 4 — About strip + Newsletter */}
                <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center reveal-up">
                    <div className="lg:col-span-2">
                        <div className="aspect-[4/5] overflow-hidden bg-rule/40 max-w-sm rounded-2xl border border-rule">
                            <img
                                src="/pictures/about-me.jpg"
                                alt="د. محمد شمس"
                                loading="lazy"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3 space-y-10">
                        <div>
                            <Kicker className="mb-3">عن الكاتب</Kicker>
                            <h2 className="font-display text-display-lg leading-tight text-ink mb-5">
                                من قلب التجربة، إلى عُمق الفكرة.
                            </h2>
                            <p className="font-serif text-lg text-ink-muted leading-relaxed max-w-prose-editorial">
                                طبيب مصري أعيش وأعمل في المملكة العربية السعودية. أكتب هنا عن الطب كما أراه — علمٌ نابض،
                                وإنسانية لا تفارق المريض ولا الطبيب. قصص من العيادات، وخواطر من المناوبات، وتجربة في السعي
                                وراء المعرفة.
                            </p>
                        </div>
                        <Newsletter />
                    </div>
                </section>
            </div>
        </>
    )
}

export default HomePage
