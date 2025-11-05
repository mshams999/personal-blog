import React, { useMemo } from 'react'
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
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews'
import { formatRating } from '../utils/ratings'
import { useBulkPostRatings, getRatingFromBulk } from '../hooks/useRatings'
import { useCommentCounts } from '../hooks/useCommentCounts'

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

    // Debug logging
    console.log('HomePage render - loading:', loading, 'error:', error)

    // Memoize posts to prevent infinite re-renders
    const recentPosts = useMemo(() => {
        try {
            const posts = getRecentPosts().sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest first
            console.log('HomePage recentPosts:', posts.length, 'posts:', posts)
            return posts
        } catch (err) {
            console.error('Error getting recent posts:', err)
            return []
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
        const theme = config.theme

        // Get dynamic rating for this post from Firestore
        const ratingInfo = getRatingFromBulk(ratingsData, post.slug)
        const { averageRating, totalRatings } = ratingInfo

        // Theme configurations
        const themeStyles = {
            gradient: {
                container: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white",
                overlay: "absolute inset-0 bg-black/20",
                category: "bg-white/20 backdrop-blur-sm text-white border border-white/30",
                title: "text-white drop-shadow-lg",
                meta: "text-white/80",
                excerpt: "text-white/90",
                continue: "text-white/80"
            },
            minimal: {
                container: "bg-white dark:bg-dark-700 border border-gray-100 dark:border-dark-600",
                overlay: "",
                category: "bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300",
                title: "text-gray-900 dark:text-white",
                meta: "text-gray-500 dark:text-gray-400",
                excerpt: "text-gray-600 dark:text-gray-300",
                continue: "text-gray-500 dark:text-gray-400"
            },
            modern: {
                container: "bg-white dark:bg-dark-700 border-l-4 border-blue-500 shadow-lg",
                overlay: "",
                category: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                title: "text-gray-900 dark:text-white",
                meta: "text-gray-500 dark:text-gray-400",
                excerpt: "text-gray-600 dark:text-gray-300",
                continue: "text-blue-500 dark:text-blue-400"
            },
            dark: {
                container: "bg-gray-900 text-white border border-gray-700",
                overlay: "absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent",
                category: "bg-gray-700 text-gray-200",
                title: "text-white",
                meta: "text-gray-300",
                excerpt: "text-gray-200",
                continue: "text-gray-300"
            },
            colorful: {
                container: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700",
                overlay: "",
                category: "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200",
                title: "text-gray-900 dark:text-white",
                meta: "text-gray-500 dark:text-gray-400",
                excerpt: "text-gray-600 dark:text-gray-300",
                continue: "text-cyan-600 dark:text-cyan-400"
            },
            glass: {
                container: "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-white shadow-xl",
                overlay: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent",
                category: "bg-white/20 backdrop-blur-sm text-white border border-white/30",
                title: "text-white drop-shadow-lg",
                meta: "text-white/80",
                excerpt: "text-white/90",
                continue: "text-white/80"
            },
            elegant: {
                container: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 border border-gray-200 dark:border-dark-500",
                overlay: "",
                category: "bg-gray-200 dark:bg-dark-500 text-gray-700 dark:text-gray-300",
                title: "text-gray-900 dark:text-white font-serif",
                meta: "text-gray-500 dark:text-gray-400",
                excerpt: "text-gray-600 dark:text-gray-300 italic",
                continue: "text-gray-500 dark:text-gray-400"
            },
            vibrant: {
                container: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white",
                overlay: "absolute inset-0 bg-black/10",
                category: "bg-white/20 backdrop-blur-sm text-white border border-white/30",
                title: "text-white drop-shadow-lg font-bold",
                meta: "text-white/90",
                excerpt: "text-white/90",
                continue: "text-white/80"
            }
        }

        const currentTheme = themeStyles[theme] || themeStyles.minimal

        return (
            <Link
                to={`/post/${post.slug}`}
                className={`block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1 card-hover-glow ${config.size} ${currentTheme.container}`}
            >
                <div className={`relative ${isLargeCard ? 'h-56 sm:h-64 md:h-72 lg:h-64' : 'h-52 sm:h-56 md:h-60 lg:h-48'} overflow-hidden`}>
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image'
                        }}
                    />
                    {currentTheme.overlay && <div className={currentTheme.overlay}></div>}

                    {category && (
                        <div className="absolute top-4 left-4 z-10">
                            <span
                                className={`inline-block px-3 py-1 text-xs font-medium rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 magnetic ${currentTheme.category}`}
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

                    {/* Gradient overlay for better text readability on certain themes */}
                    {['gradient', 'glass', 'vibrant'].includes(theme) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    )}

                    {/* New badge for recent posts */}
                    {new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <div className="absolute top-4 start-4 z-10">
                            <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse-glow">
                                جديد
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6 relative z-10">
                    <h3 className={`font-bold mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors duration-300 ${isLargeCard ? 'text-xl' : 'text-lg'} ${currentTheme.title}`}>
                        {post.title}
                    </h3>

                    <div className={`flex items-center text-xs mb-3 gap-4 ${currentTheme.meta}`}>
                        <div className="flex items-center gap-1">
                            {author && (
                                <>
                                    <img
                                        src={author.avatar}
                                        alt={author.name}
                                        className="w-4 h-4 rounded-full ring-1 ring-white/30"
                                    />
                                    <span className="font-medium">{author.name}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} دقيقة</span>
                        </div>
                    </div>

                    <p className={`text-sm line-clamp-3 mb-4 leading-relaxed ${currentTheme.excerpt}`}>
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${currentTheme.continue}`}>
                            متابعة القراءة ←
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                            <FirebaseCommentCount
                                post={post}
                                showIcon={true}
                                className={currentTheme.meta}
                            />
                            <div className="flex items-center gap-1">
                                <Star className={`h-3 w-3 ${['gradient', 'glass', 'vibrant', 'dark'].includes(theme) ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-400 fill-yellow-400'}`} />
                                <span className={currentTheme.meta}>
                                    {formatRating(averageRating)} ({totalRatings})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements for certain themes */}
                {theme === 'modern' && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
                )}
                {theme === 'elegant' && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-500 dark:from-dark-500 dark:to-dark-400"></div>
                )}
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
        console.warn('TinaCMS failed to load, falling back to static posts:', error)
    }

    // Add safety check for empty posts
    if (!recentPosts || recentPosts.length === 0) {
        console.warn('No posts available to display')
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
                            أحدث المقالات
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            اكتشف أحدث محتوانا
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
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <span>Load More Articles</span>
                                <div className="ms-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Top Posts */}
                        <div className="bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 dark:border-dark-600/50 hover:shadow-xl transition-all duration-300 glass animate-slideInRight">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary-500" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">أفضل المقالات</h3>
                                </div>
                                {viewsLoading && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">جاري التحميل...</div>
                                )}
                            </div>
                            <div className="space-y-4">
                                {sortedPosts.slice(0, 4).map((post, index) => {
                                    const author = getAuthorById(post.authorId)
                                    return (
                                        <Link key={post.id} to={`/post/${post.slug}`} className="block group">
                                            <div className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 animate-fadeInUp stagger-${index + 1}`}>
                                                <div className="flex-shrink-0 relative">
                                                    <span className="flex w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full items-center justify-center text-xs font-bold shadow-lg">
                                                        {index + 1}
                                                    </span>
                                                    {index === 0 && (
                                                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {author?.name} • {formatDateArabicShort(post.date)}
                                                        </p>
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
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Most Commented */}
                        <div className="bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 dark:border-dark-600/50 hover:shadow-xl transition-all duration-300 glass animate-slideInRight stagger-2">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageCircle className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    الأكثر تعليقاً
                                    {commentsLoading && (
                                        <span className="ms-2 text-sm text-gray-500 dark:text-gray-400">(جارٍ التحميل...)</span>
                                    )}
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {(sortedByComments && sortedByComments.length > 0 ? sortedByComments : recentPosts || [])
                                    .slice(0, 3)
                                    .map((post, index) => {
                                        if (!post) return null
                                        const commentCount = getCommentCount ? getCommentCount(post.slug) : 0
                                        return (
                                            <Link key={post.id} to={`/post/${post.slug}`} className={`flex items-center gap-3 group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 animate-fadeInUp stagger-${index + 1}`}>
                                                <div className="relative">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-white dark:ring-dark-600 shadow-md group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <span className="absolute -top-2 -end-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounceIn">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                                                        <span>{formatDateArabicShort(post.date)}</span>
                                                        <span>—</span>
                                                        <div className="flex items-center gap-1">
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>
                                                                {commentsLoading ? (
                                                                    <span className="animate-pulse">جارٍ التحميل...</span>
                                                                ) : (
                                                                    `${commentCount} ${commentCount === 0 ? 'تعليق' : commentCount === 1 ? 'تعليق واحد' : commentCount === 2 ? 'تعليقان' : 'تعليقات'}`
                                                                )}
                                                            </span>
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

            {/* Categories Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <Link to="/categories" className="group">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">
                            Explore by Category
                        </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Discover articles organized by your interests
                    </p>
                    <div className="mt-4 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </div>
                <Categories
                    showTitle={false}
                    className="transform hover:scale-105 transition-transform duration-300"
                    columns="lg:grid-cols-6"
                />
            </div>

            {/* Newsletter Section */}
            <Newsletter />
        </div>
    )
}

export default HomePage
