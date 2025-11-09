import React, { useMemo, useEffect } from 'react'
import { useHybridData } from '../contexts/HybridDataContext'
import { Link } from 'react-router-dom'
import { Clock, MessageCircle, Star, Calendar, Eye, TrendingUp, Sparkles } from 'lucide-react'
import { formatDateArabicShort } from '../utils/dateFormat'
import Newsletter from '../components/Newsletter'
import Categories from '../components/Categories'
import Carousel from '../components/Carousel'
import Hero from '../components/Hero'
import FirebaseCommentCount from '../components/FirebaseCommentCount'
import ViewCounter from '../components/ViewCounter'
import MetaTags from '../components/MetaTags'
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews'
import { formatRating } from '../utils/ratings'
import { useBulkPostRatings, getRatingFromBulk } from '../hooks/useRatings'
import { useCommentCounts } from '../hooks/useCommentCounts'
import {
    generateWebsiteSchema,
    generatePersonSchema,
    generateOrganizationSchema,
    insertMultipleSchemas
} from '../utils/schemaGenerator'

/**
 * HomePage component displaying all blog posts in a masonry layout
 * 
 * Features:
 * - Masonry-style layout with varying card sizes
 * - Featured posts with larger cards
 * - Sidebar with Top Posts and Most Commented sections
 * - Newsletter signup section
 * - Responsive design matching the provided screenshot
 */
const HomePage = () => {
    const { siteMetadata, getRecentPosts, getAuthorById, getCategoryById, loading, error } = useHybridData()

    // Memoize posts to prevent infinite re-renders
    const recentPosts = useMemo(() => {
        try {
            const posts = getRecentPosts().sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest first
            return posts
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
        }
    }, [getRecentPosts])

    // Get the newest posts for carousel (top 5 most recent)
    const carouselPosts = useMemo(() => {
        return recentPosts.slice(0, 5)
    }, [recentPosts])

    // Fetch article view counts using Firebase Firestore
    const { viewCounts, getViewCount, loading: viewsLoading } = useBulkArticleViews(recentPosts)

    // Fetch article ratings using Firebase Firestore
    const postSlugs = useMemo(() => recentPosts.map(post => post.slug), [recentPosts])
    const { ratings: ratingsData, loading: ratingsLoading } = useBulkPostRatings(postSlugs)

    // Create sorted posts with consistent view counts
    const sortedPosts = useMemo(() => {
        if (!recentPosts || recentPosts.length === 0) return []

        return recentPosts
            .map(post => ({
                ...post,
                viewCount: getViewCount(post.slug)
            }))
            .sort((a, b) => b.viewCount - a.viewCount)
    }, [recentPosts, viewCounts, getViewCount])

    // Fetch Firebase comment counts for Most Commented section
    const { sortedByComments, getCommentCount, loading: commentsLoading } = useCommentCounts(recentPosts)

    // Generate schemas for JSON-LD
    const websiteSchema = generateWebsiteSchema()
    const personSchema = generatePersonSchema()
    const organizationSchema = generateOrganizationSchema()

    // Insert schemas on component mount
    useEffect(() => {
        const schemas = [
            { schema: websiteSchema, id: 'website' },
            { schema: personSchema, id: 'person' },
            { schema: organizationSchema, id: 'organization' }
        ]
        insertMultipleSchemas(schemas)
    }, [])

    // Define the layout pattern for masonry effect with themes
    const getCardConfig = (index) => {
        const patterns = [
            { size: 'md:row-span-2', theme: 'gradient' }, // Large card with gradient
            { size: 'md:row-span-1', theme: 'minimal' }, // Regular minimal card
            { size: 'md:row-span-1', theme: 'modern' }, // Regular modern card
            { size: 'md:row-span-2', theme: 'dark' }, // Large dark card
            { size: 'md:row-span-1', theme: 'colorful' }, // Regular colorful card
            { size: 'md:row-span-1', theme: 'minimal' }, // Regular minimal card
            { size: 'md:row-span-2', theme: 'glass' }, // Large glass morphism card
            { size: 'md:row-span-1', theme: 'modern' }, // Regular modern card
            { size: 'md:row-span-1', theme: 'elegant' }, // Regular elegant card
            { size: 'md:row-span-2', theme: 'vibrant' }, // Large vibrant card
        ]
        return patterns[index % patterns.length]
    }

    const PostCard = ({ post, index, config }) => {
        const author = getAuthorById(post.authorId)
        const category = getCategoryById(post.categoryId)
        const isLargeCard = config.size.includes('row-span-2')

        // Get dynamic rating for this post from Firestore
        const ratingInfo = getRatingFromBulk(ratingsData, post.slug)
        const { averageRating, totalRatings } = ratingInfo

        // Format date
        const formattedDate = formatDateArabicShort(post.date)

        // Check if this is the newest post (only the first post gets the badge)
        const isNewestPost = index === 0

        return (
            <Link
                to={`/post/${post.slug}`}
                className="block rounded-xl overflow-hidden bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 shadow-md hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
            >
                {/* Featured Image */}
                <div className={`relative ${isLargeCard ? 'h-56 sm:h-64 md:h-72 lg:h-64' : 'h-48 sm:h-52 md:h-56'} overflow-hidden bg-gray-100 dark:bg-dark-600`}>
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image'
                        }}
                    />

                    {/* Category Badge - Top Right */}
                    {category && (
                        <div className="absolute top-3 right-3 z-10">
                            <span
                                className="inline-block px-3 py-1.5 text-xs font-semibold bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 hover:scale-105 transition-transform duration-300"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    window.location.href = `/category/${category.slug}`
                                }}
                            >
                                {category.name}
                            </span>
                        </div>
                    )}

                    {/* New Badge - Only for the newest post */}
                    {isNewestPost && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg">
                                <Sparkles className="h-3 w-3" />
                                جديد
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4">
                    {/* Title */}
                    <h3 className={`font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight ${isLargeCard ? 'text-xl' : 'text-lg'}`}>
                        {post.title}
                    </h3>

                    {/* Description with decorative line */}
                    <div className="relative">
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-300 rounded-full"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed pr-4">
                            {post.excerpt}
                        </p>
                    </div>

                    {/* Metadata Section with decorative line */}
                    <div className="relative pt-4 mt-4 border-t border-gray-200 dark:border-dark-600">
                        {/* Author Info */}
                        {author && (
                            <div className="flex items-center gap-2.5 mb-4">
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    loading="lazy"
                                    className="w-9 h-9 rounded-full ring-2 ring-primary-100 dark:ring-primary-900/30 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {author.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Left Column */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Clock className="h-3.5 w-3.5 text-primary-500" />
                                    <span>{post.readTime} دقيقة</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">

                                    <ViewCounter articleSlug={post.slug} />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <FirebaseCommentCount
                                        post={post}
                                        showIcon={true}
                                        className="text-gray-600 dark:text-gray-400"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">{formatRating(averageRating)}</span>
                                    <span className="text-gray-400 dark:text-gray-500">({totalRatings})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // Show loading state while fetching TinaCMS posts
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Blog Posts...</h2>
                    <p className="text-gray-600 dark:text-gray-300">Fetching the latest content from TinaCMS</p>
                </div>
            </div>
        )
    }

    // Show error state if TinaCMS failed to load (will fallback to static posts)
    if (error) {
        // Silent - fallback to static posts
    }

    // Add safety check for empty posts
    if (!recentPosts || recentPosts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Posts Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        There are currently no blog posts available. This could be because:
                    </p>
                    <ul className="text-left text-gray-600 dark:text-gray-300 text-sm">
                        <li>• TinaCMS server is not running</li>
                        <li>• No posts have been created yet</li>
                        <li>• Static fallback posts are missing</li>
                    </ul>
                    <div className="mt-6">
                        <a
                            href="/admin"
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Create First Post
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Meta Tags and Structured Data */}
            <MetaTags
                title={siteMetadata?.title || 'مدونة محمد شمس'}
                description={siteMetadata?.description || 'مدونة شخصية تضم مقالات وتجارب في الطب والتكنولوجيا'}
                url={window.location.origin}
                type="website"
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Hidden elements for Disqus comment count calculation - only if posts exist */}
                {recentPosts && recentPosts.length > 0 && (
                    <div style={{ display: 'none' }}>
                        {recentPosts.map(post => (
                            <a
                                key={`disqus-count-${post.slug}`}
                                href={`#disqus_thread`}
                                data-disqus-identifier={post.slug}
                                data-disqus-url={`${window.location.origin}/post/${post.slug}`}
                            >
                                0
                            </a>
                        ))}
                    </div>
                )}

                {/* Hero Section */}
                <Hero />

                {/* Main Content Area */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Featured Posts Carousel - Newest Articles */}
                    <div className="mb-12">
                        <div className="text-center mb-8 animate-fadeInUp">
                            <h2 className="text-3xl font-bold text-gradient-animated mb-2">
                                آخر الحكايات والأفكار
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                اكتشف أحدث مانشرناه - التجربة الحياتية الخاصة بي من ضفاف الرحلة الى أعماق المغامرة
                            </p>
                            <div className="mt-4 w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="animate-slideInLeft">
                            <Carousel
                                posts={carouselPosts} // Use newest posts
                                autoSlide={true}
                                slideInterval={6000}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Posts Area */}
                        <div className="lg:col-span-3">
                            <div className="text-center mb-8 animate-fadeInUp">
                                <h2 className="text-2xl font-bold text-gradient-animated mb-2">
                                    جميع المقالات
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    استكشف مجموعتنا المتنوعة من القصص والرؤى
                                </p>
                                <div className="mt-4 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
                                {recentPosts.map((post, index) => {
                                    const config = getCardConfig(index)
                                    return (
                                        <div
                                            key={post.id}
                                            className={`animate-fadeInUp stagger-${(index % 6) + 1}`}
                                        >
                                            <PostCard
                                                post={post}
                                                index={index}
                                                config={config}
                                            />
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Load More Button */}
                            <div className="text-center mt-16 animate-fadeInUp">
                                <button className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 relative overflow-hidden">
                                    {/* Animated gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                    <span className="relative z-10">تحميل المزيد من المقالات</span>

                                    {/* Animated arrow */}
                                    <svg
                                        className="relative z-10 w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Top Posts - أفضل المقالات */}
                            <div className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-dark-700/95 dark:to-dark-800/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50 dark:border-dark-600/50 hover:shadow-2xl transition-all duration-500 glass animate-slideInRight overflow-hidden relative">
                                {/* Decorative gradient overlay */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/50 dark:border-dark-600/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl shadow-lg">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">الأكثر قراءة</h3>
                                    </div>
                                    {viewsLoading && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    )}
                                </div>

                                {/* Posts List */}
                                <div className="space-y-5">
                                    {sortedPosts.slice(0, 4).map((post, index) => {
                                        const author = getAuthorById(post.authorId)
                                        const rankColors = [
                                            'from-yellow-400 to-amber-500',
                                            'from-gray-300 to-gray-400',
                                            'from-orange-400 to-amber-600',
                                            'from-blue-400 to-indigo-500'
                                        ]
                                        return (
                                            <Link key={post.id} to={`/post/${post.slug}`} className="block group">
                                                <div className={`flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-dark-600/50 hover:bg-gradient-to-l hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/20 dark:hover:to-purple-900/20 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 animate-fadeInUp stagger-${index + 1}`}>
                                                    {/* Rank Badge */}
                                                    <div className="flex-shrink-0 relative">
                                                        <div className={`flex w-10 h-10 bg-gradient-to-br ${rankColors[index]} text-white rounded-xl items-center justify-center text-base font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                                            {index + 1}
                                                        </div>
                                                        {index === 0 && (
                                                            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                                <Sparkles className="w-3 h-3 text-white fill-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 space-y-2.5">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                                                            {post.title}
                                                        </h4>
                                                        <div className="flex items-center justify-between gap-3 text-xs">
                                                            <p className="text-gray-600 dark:text-gray-400 truncate">
                                                                <span className="font-medium">{author?.name}</span>
                                                                <span className="mx-1.5">•</span>
                                                                <span>{formatDateArabicShort(post.date)}</span>
                                                            </p>
                                                            <div className="flex-shrink-0">
                                                                <ViewCounter
                                                                    articleSlug={post.slug}
                                                                    fallbackCount={getViewCount(post.slug)}
                                                                    shouldIncrement={false}
                                                                    size="sm"
                                                                    variant="minimal"
                                                                    articleDate={post.date}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Most Commented - الأكثر تعليقاً */}
                            <div className="bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-dark-700/95 dark:to-blue-900/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100/50 dark:border-blue-900/30 hover:shadow-2xl transition-all duration-500 glass animate-slideInRight stagger-2 overflow-hidden relative">
                                {/* Decorative gradient overlay */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-200/30 dark:border-blue-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                            <MessageCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            الأكثر تعليقاً
                                        </h3>
                                    </div>
                                    {commentsLoading && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    )}
                                </div>

                                {/* Posts List */}
                                <div className="space-y-5">
                                    {(sortedByComments && sortedByComments.length > 0 ? sortedByComments : recentPosts || [])
                                        .slice(0, 3)
                                        .map((post, index) => {
                                            if (!post) return null
                                            const commentCount = getCommentCount ? getCommentCount(post.slug) : 0
                                            const rankBadgeColors = [
                                                'from-pink-500 to-rose-600',
                                                'from-purple-500 to-indigo-600',
                                                'from-blue-500 to-cyan-600'
                                            ]
                                            return (
                                                <Link key={post.id} to={`/post/${post.slug}`} className="block group">
                                                    <div className={`flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-dark-600/60 hover:bg-gradient-to-l hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 animate-fadeInUp stagger-${index + 1}`}>
                                                        {/* Image with Rank Badge */}
                                                        <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                            <img
                                                                src={post.featuredImage}
                                                                alt={post.title}
                                                                loading="lazy"
                                                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-dark-600 shadow-lg"
                                                            />
                                                            <div className={`absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br ${rankBadgeColors[index]} text-white text-xs rounded-full flex items-center justify-center font-bold shadow-xl group-hover:rotate-12 transition-transform duration-300`}>
                                                                {index + 1}
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0 space-y-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                                {post.title}
                                                            </h4>
                                                            <div className="flex flex-col gap-1.5">
                                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {formatDateArabicShort(post.date)}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                                        <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                                            {commentsLoading ? (
                                                                                <span className="animate-pulse">...</span>
                                                                            ) : (
                                                                                `${commentCount} ${commentCount === 0 ? 'تعليق' : commentCount === 1 ? 'تعليق' : commentCount === 2 ? 'تعليقان' : 'تعليقات'}`
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section - استكشف حسب التصنيف */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16 animate-fadeInUp">
                        <Link to="/categories" className="group inline-block">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent mb-6 group-hover:scale-105 transition-all duration-500">
                                تصفح الموضوعات حسب التصنيف
                            </h2>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            مقالات مُنظَّمة حسب اهتماماتك
                        </p>
                        <div className="mt-6 w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 mx-auto rounded-full shadow-lg"></div>
                    </div>
                    <Categories
                        showTitle={false}
                        className="transform transition-all duration-300"
                        columns="lg:grid-cols-6"
                    />
                </div>

                {/* Newsletter Section */}
                <Newsletter />
            </div>
        </>
    )
}

export default HomePage
