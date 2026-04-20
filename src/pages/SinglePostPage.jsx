import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowUp, ArrowRight } from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import DisqusComments from '../components/DisqusComments'
import MetaTags from '../components/MetaTags'
import ReadingProgress from '../components/ReadingProgress'
import TableOfContents from '../components/TableOfContents'
import ShareRail from '../components/ShareRail'
import PostCard from '../components/PostCard'
import Kicker from '../components/editorial/Kicker'
import Byline from '../components/editorial/Byline'
import SectionHeader from '../components/editorial/SectionHeader'
import StoryblokContent from '../components/StoryblokContent'

const ExcerptFallback = ({ content }) =>
    content ? (
        <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {content}
            </div>
        </div>
    ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">No content available</div>
    )
import { useArticleViews, useBulkArticleViews } from '../hooks/useFirebaseViews'
import {
    generateBlogPostingSchema,
    generateBreadcrumbSchema,
    insertMultipleSchemas,
} from '../utils/schemaGenerator'

/**
 * Editorial SinglePostPage.
 *   - Reading progress hairline at top
 *   - Typography-first header (Kicker + display-xl title + standfirst + Byline)
 *   - Optional full-bleed cover figure
 *   - Sticky ShareRail + TableOfContents rails on lg+
 *   - Prose via .prose-editorial (Source Serif / Amiri)
 *   - AuthorBio + Related + Disqus below
 */
const SinglePostPage = () => {
    const { slug } = useParams()
    const {
        getPostBySlug,
        getAuthorById,
        getCategoryById,
        loading: dataLoading,
        posts,
    } = useHybridData()

    const [mdxContent, setMdxContent] = useState(null)
    const [contentLoading, setContentLoading] = useState(true)
    const [showScrollTop, setShowScrollTop] = useState(false)

    const post = getPostBySlug(slug)
    const author = post ? getAuthorById(post.authorId) : null
    const category = post ? getCategoryById(post.categoryId) : null

    const { viewCount } = useArticleViews(post?.slug, true, post?.date)

    const relatedPosts = useMemo(
        () =>
            post
                ? posts
                    .filter((p) => p.id !== post.id && p.categoryId === post.categoryId)
                    .slice(0, 3)
                : [],
        [post, posts]
    )
    const { getViewCount } = useBulkArticleViews(relatedPosts)

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!post) return
        window.scrollTo(0, 0)
        loadContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.slug])

    useEffect(() => {
        if (!post) return
        const schemas = []
        const bp = generateBlogPostingSchema(post, author, category)
        if (bp) schemas.push({ schema: bp, id: 'blog-posting' })
        const bc = generateBreadcrumbSchema([
            { name: 'الرئيسية', url: '/' },
            {
                name: category?.name || 'المقالات',
                url: category ? `/category/${category.slug}` : '/blog',
            },
            { name: post.title, url: `/post/${post.slug}` },
        ])
        if (bc) schemas.push({ schema: bc, id: 'breadcrumb' })
        if (schemas.length) insertMultipleSchemas(schemas)
    }, [post?.slug, category?.id])

    const loadContent = () => {
        try {
            setContentLoading(true)
            if (!post?.body) {
                setMdxContent(<ExcerptFallback content={post?.excerpt} />)
            } else {
                setMdxContent(<StoryblokContent content={post.body} />)
            }
        } catch {
            setMdxContent(<ExcerptFallback content={post?.excerpt} />)
        } finally {
            setContentLoading(false)
        }
    }

    if (dataLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                <p className="small-caps text-ink-muted">جارٍ التحميل…</p>
            </div>
        )
    }

    if (!post) return <Navigate to="/blog" replace />

    const url = `${window.location.origin}/post/${post.slug}`
    const isRTL =
        typeof document !== 'undefined' && document.documentElement.dir === 'rtl'

    return (
        <>
            <MetaTags
                title={post.title}
                description={post.excerpt}
                image={post.featuredImage}
                url={url}
                type="article"
                author={author?.name}
                publishedTime={new Date(post.date).toISOString()}
            />

            <ReadingProgress targetSelector="article.post-article" />

            <article className="post-article" dir="rtl">
                {/* Header */}
                <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Link
                            to="/blog"
                            className="small-caps text-ink-muted hover:text-accent transition-colors inline-flex items-center gap-1"
                        >
                            <ArrowRight className="w-3.5 h-3.5" />
                            العودة
                        </Link>
                        {category && (
                            <>
                                <span className="text-ink-muted/40">·</span>
                                <Link to={`/category/${category.slug}`}>
                                    <Kicker>{category.name}</Kicker>
                                </Link>
                            </>
                        )}
                    </div>

                    <h1 className="font-display text-display-xl md:text-display-2xl leading-[1.15] text-ink mb-12 md:mb-16">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="font-serif text-lg md:text-xl text-ink-muted leading-relaxed max-w-prose-editorial mb-8">
                            {post.excerpt}
                        </p>
                    )}

                    <Byline
                        author={author?.name || 'د. محمد شمس'}
                        avatar={author?.avatar}
                        date={post.date}
                        readTime={post.readTime}
                        viewCount={viewCount}
                    />
                </header>

                {/* Cover image */}
                {post.featuredImage && (
                    <figure className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                        <div className="relative aspect-[16/9] overflow-hidden bg-rule/40 rounded-2xl border border-rule">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    </figure>
                )}

                {/* Body with rails */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-[1fr_minmax(0,44rem)_1fr] lg:gap-8 lg:items-start">
                        {/* TOC rail (desktop) + mobile top bar */}
                        <div className="lg:flex lg:justify-start lg:sticky lg:top-28 lg:self-start">
                            <TableOfContents
                                containerSelector="article.post-article .prose-editorial"
                                deps={[mdxContent]}
                            />
                        </div>

                        {/* Prose + TOC + end-of-article cluster */}
                        <div className="min-w-0">
                            <div
                                className="prose-editorial mx-auto"
                                data-has-dropcap={isRTL ? 'false' : 'true'}
                            >
                                {contentLoading ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-rule/60 rounded w-3/4" />
                                        <div className="h-4 bg-rule/60 rounded w-1/2" />
                                        <div className="h-4 bg-rule/60 rounded w-5/6" />
                                    </div>
                                ) : (
                                    mdxContent
                                )}
                            </div>

                            {/* Inline share (mobile) */}
                            <div className="lg:hidden">
                                <ShareRail url={url} title={post.title} inline />
                            </div>

                            <DisqusComments post={post} currentUrl={url} />

                            {post.tags?.length > 0 && (
                                <div className="my-10">
                                    <p className="kicker mb-3">وسوم</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="small-caps text-ink-muted border-b border-rule pb-0.5"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {relatedPosts.length > 0 && (
                                <section className="my-16">
                                    <SectionHeader kicker="المزيد" title="قد يعجبك أيضاً" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {relatedPosts.map((p) => (
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
                        </div>

                        {/* Share rail */}
                        <aside className="hidden lg:flex lg:sticky lg:top-28 lg:self-start justify-start">
                            <ShareRail url={url} title={post.title} />
                        </aside>
                    </div>
                </div>
            </article>

            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 end-8 w-10 h-10 rounded-full border border-rule bg-paper text-ink-muted hover:text-accent hover:border-accent transition-colors flex items-center justify-center z-40"
                    aria-label="عودة إلى الأعلى"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
            )}
        </>
    )
}

export default SinglePostPage
