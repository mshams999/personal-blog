import React, { useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { Link } from 'react-router-dom'
import { Clock, MessageCircle, Star, Calendar, Eye } from 'lucide-react'
import { format } from 'date-fns'
import Newsletter from '../components/Newsletter'
import Carousel from '../components/Carousel'
import Hero from '../components/Hero'
import DisqusCommentCount from '../components/DisqusCommentCount'
import ViewCounter from '../components/ViewCounter'
import { useFirebaseAnalytics, formatViewCount } from '../hooks/useFirebaseAnalytics'
import { getPostRating, formatRating } from '../utils/ratings'
import { useDisqusCommentCounts } from '../hooks/useDisqusCommentCounts'

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
    const { siteMetadata, getRecentPosts, getAuthorById, getCategoryById } = useData()

    // Memoize posts to prevent infinite re-renders
    const recentPosts = useMemo(() => {
        return getRecentPosts()
    }, [getRecentPosts])

    // Fetch article view counts using Firebase Analytics
    const { views, loading: viewsLoading, sortedPosts } = useFirebaseAnalytics(recentPosts)

    // Fetch Disqus comment counts for Most Commented section
    const { sortedByComments, getCommentCount, loading: commentsLoading } = useDisqusCommentCounts(recentPosts)

    // Define the layout pattern for masonry effect
    const getCardSize = (index) => {
        const patterns = [
            'md:row-span-2', // Large card
            'md:row-span-1', // Regular card
            'md:row-span-1', // Regular card
            'md:row-span-2', // Large card
            'md:row-span-1', // Regular card
            'md:row-span-1', // Regular card
            'md:row-span-2', // Large card
            'md:row-span-1', // Regular card
            'md:row-span-1', // Regular card
            'md:row-span-2', // Large card
        ]
        return patterns[index % patterns.length]
    }

    const PostCard = ({ post, index, className = '' }) => {
        const author = getAuthorById(post.authorId)
        const category = getCategoryById(post.categoryId)
        const isLargeCard = className.includes('row-span-2')

        // Get dynamic rating for this post
        const { averageRating, totalRatings } = getPostRating(post.slug)

        return (
            <Link
                to={`/post/${post.slug}`}
                className={`block bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-all duration-300 group cursor-pointer ${className}`}
            >
                <div className={`relative ${isLargeCard ? 'h-64' : 'h-48'} overflow-hidden`}>
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image'
                        }}
                    />
                    {category && (
                        <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-sm">
                                {category.name}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className={`font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors ${isLargeCard ? 'text-xl' : 'text-lg'}`}>
                        {post.title}
                    </h3>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                            {author && (
                                <>
                                    <img
                                        src={author.avatar}
                                        alt={author.name}
                                        className="w-4 h-4 rounded-full"
                                    />
                                    <span>{author.name}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min read</span>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Continue Reading
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <DisqusCommentCount post={post} currentUrl={`${window.location.origin}/post/${post.slug}`} />
                            <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span>{formatRating(averageRating)} ({totalRatings})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Featured Posts Carousel */}
                <div className="mb-12">
                    <Carousel
                        posts={recentPosts.slice(0, 4)} // Show first 4 posts in carousel
                        autoSlide={true}
                        slideInterval={6000}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Posts Area */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Latest Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
                            {recentPosts.map((post, index) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    index={index}
                                    className={getCardSize(index)}
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors">
                                Load More
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Top Posts */}
                        <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-600">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Posts</h3>
                                {viewsLoading && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Loading views...</div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {sortedPosts.slice(0, 4).map((post, index) => {
                                    const author = getAuthorById(post.authorId)
                                    return (
                                        <Link key={post.id} to={`/post/${post.slug}`} className="block group">
                                            <div className="flex items-start space-x-2">
                                                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {author?.name} • {format(new Date(post.date), 'MMM dd')}
                                                        </p>
                                                        <ViewCounter
                                                            articleSlug={post.slug}
                                                            fallbackCount={post.viewCount}
                                                            shouldIncrement={false}
                                                            size="sm"
                                                            variant="minimal"
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
                        <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-600">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Most Commented
                                {commentsLoading && (
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(Loading...)</span>
                                )}
                            </h3>
                            <div className="space-y-4">
                                {(sortedByComments && sortedByComments.length > 0 ? sortedByComments : recentPosts || [])
                                    .slice(0, 3)
                                    .map((post, index) => {
                                        if (!post) return null
                                        const commentCount = getCommentCount ? getCommentCount(post.slug) : 0
                                        return (
                                            <Link key={post.id} to={`/post/${post.slug}`} className="flex items-center space-x-3 group">
                                                <div className="relative">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <span className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                                                        <span>{format(new Date(post.date), 'MMM dd')}</span>
                                                        <span>—</span>
                                                        <div className="flex items-center space-x-1">
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>
                                                                {commentsLoading ? (
                                                                    <span className="animate-pulse">Loading...</span>
                                                                ) : (
                                                                    `${commentCount} Comment${commentCount !== 1 ? 's' : ''}`
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

            {/* Newsletter Section */}
            <Newsletter />
        </div>
    )
}

export default HomePage
