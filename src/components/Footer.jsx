import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MessageCircle, ArrowUp, Eye } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { format } from 'date-fns'
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews'
import { useDisqusCommentCounts } from '../hooks/useDisqusCommentCounts'
import DisqusCommentCount from './DisqusCommentCount'

/**
 * Footer component with modern design and social links
 * Last updated: July 5, 2025
 * 
 * Features:
 * - Horizontal layout with three sections
 * - Most Commented: Uses real Disqus comment counts via API
 * - Popular posts: Sorted by Firebase Analytics view counts
 * - Short Reads: Posts with ≤3 min read time
 * - Newsletter signup section
 * - Social media icons
 * - Scroll to top button
 */
const Footer = () => {
    const { posts, getAuthorById } = useData()
    const { viewCounts, getViewCount, loading: viewsLoading } = useBulkArticleViews(posts)

    // Create sorted posts with consistent view counts
    const sortedPosts = useMemo(() => {
        if (!posts || posts.length === 0) return []

        return posts
            .map(post => ({
                ...post,
                viewCount: getViewCount(post.slug)
            }))
            .sort((a, b) => b.viewCount - a.viewCount)
    }, [posts, viewCounts, getViewCount])

    // Use a try-catch to handle potential errors
    let commentData = { sortedByComments: [], getCommentCount: () => 0, loading: false }
    try {
        commentData = useDisqusCommentCounts(posts)
    } catch (error) {
        console.error('Error in useDisqusCommentCounts:', error)
    }

    const { sortedByComments, getCommentCount, loading: commentsLoading } = commentData

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleSubscribe = (e) => {
        e.preventDefault()
        // Handle newsletter subscription
        alert('Newsletter subscription feature would be implemented here!')
    }

    return (
        <footer className="bg-gray-50 dark:bg-dark-800 py-16">
            {/* Hidden elements for Disqus comment count calculation - only if posts exist */}
            {posts && posts.length > 0 && (
                <div style={{ display: 'none' }}>
                    {posts.map(post => (
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Widget Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    {/* Most Commented */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                            Most Commented
                            {commentsLoading && (
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(Loading...)</span>
                            )}
                        </h3>
                        <div className="space-y-4">
                            {(sortedByComments && sortedByComments.length > 0 ? sortedByComments : posts || [])
                                .slice(0, 3)
                                .map((post, index) => {
                                    if (!post) return null
                                    const commentCount = getCommentCount ? getCommentCount(post.slug) : 0
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/post/${post.slug}`}
                                            className="flex items-center space-x-3 hover:bg-white dark:hover:bg-dark-700 p-3 rounded-lg transition-colors group"
                                        >
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
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-500 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                                                    <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
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

                    {/* Popular */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Popular</h3>
                        <div className="space-y-4">
                            {(sortedPosts && sortedPosts.length > 0 ? sortedPosts : posts || [])
                                .slice(0, 3)
                                .map((post, index) => {
                                    if (!post) return null
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/post/${post.slug}`}
                                            className="flex items-start space-x-3 hover:bg-white dark:hover:bg-dark-700 p-3 rounded-lg transition-colors group"
                                        >
                                            <span className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center font-bold text-lg">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-primary-500 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                                                    <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                                                    <span>—</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{formatViewCount(getViewCount(post.slug))} views</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Short Reads */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Short Reads</h3>
                        <div className="space-y-4">
                            {(posts || [])
                                .filter(p => p && p.readTime <= 3)
                                .slice(0, 3)
                                .map((post, index) => {
                                    if (!post) return null
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/post/${post.slug}`}
                                            className="flex items-center space-x-3 hover:bg-white dark:hover:bg-dark-700 p-3 rounded-lg transition-colors group"
                                        >
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-primary-500 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                                                    <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                                                    <span>—</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{post.readTime} min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="text-center py-16 bg-white dark:bg-dark-700 rounded-2xl relative">
                    <div className="max-w-md mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stay in the Loop</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Subscribe to my newsletter for all the latest updates
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 mb-6">
                            <input
                                type="email"
                                placeholder="Your email address"
                                required
                                className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </form>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                            <input type="checkbox" className="rounded" required />
                            <span>I agree to the <Link to="/terms" className="text-primary-500 hover:text-primary-600 underline">terms & conditions</Link></span>
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center space-x-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z" />
                                </svg>
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                </svg>
                            </a>
                            <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>


                </div>
            </div>
        </footer>
    )
}

export default Footer
