import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    Clock,
    MessageCircle,
    ArrowUp,
    Eye,
    Heart,
    Code,
    Sparkles,
    Calendar,
    Github,
    Linkedin,
    Mail,
    Twitter,
    Facebook,
    ExternalLink,
    Zap,
    Palette,
    Coffee
} from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import { format } from 'date-fns'
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews'
import { useDisqusCommentCounts } from '../hooks/useDisqusCommentCounts'
import DisqusCommentCount from './DisqusCommentCount'

/**
 * Footer component with modern design and engaging elements
 * Redesigned: July 8, 2025
 * 
 * Features:
 * - Modern gradient design matching blog's soul
 * - Most Commented, Popular, and Short Reads sections
 * - Stylish social media buttons with hover effects
 * - Tech stack showcase
 * - "Made with love" section
 * - Dynamic year display
 * - Scroll to top functionality
 * - Blog statistics and insights
 */
const Footer = () => {
    const { posts, getAuthorById, getRecentPosts } = useHybridData()

    // Use the same recent posts as HomePage for consistency
    const recentPosts = useMemo(() => {
        try {
            return getRecentPosts().sort((a, b) => new Date(b.date) - new Date(a.date))
        } catch (err) {
            console.error('Error getting recent posts in Footer:', err)
            return posts || []
        }
    }, [getRecentPosts, posts])

    const { viewCounts, getViewCount, loading: viewsLoading } = useBulkArticleViews(recentPosts)

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

    // Use a try-catch to handle potential errors
    let commentData = { sortedByComments: [], getCommentCount: () => 0, loading: false }
    try {
        commentData = useDisqusCommentCounts(recentPosts)
    } catch (error) {
        console.error('Error in useDisqusCommentCounts:', error)
    }

    const { sortedByComments, getCommentCount, loading: commentsLoading } = commentData

    const currentYear = new Date().getFullYear()

    const techStack = [
        { name: 'React', icon: '⚛️', color: 'text-blue-500' },
        { name: 'Vite', icon: '⚡', color: 'text-purple-500' },
        { name: 'Tailwind CSS', icon: '🎨', color: 'text-cyan-500' },
        { name: 'Firebase', icon: '🔥', color: 'text-orange-500' },
        { name: 'TinaCMS', icon: '📝', color: 'text-green-500' },
        { name: 'Lucide React', icon: '✨', color: 'text-pink-500' }
    ]

    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/mosh936',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            hoverTransform: 'hover:scale-110 hover:rotate-3'
        },
        {
            name: 'Twitter',
            url: 'https://x.com/MohamedShams936',
            icon: Twitter,
            color: 'bg-gray-800 hover:bg-gray-900',
            hoverTransform: 'hover:scale-110 hover:-rotate-3'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/mohamedshamsms/',
            icon: Linkedin,
            color: 'bg-blue-700 hover:bg-blue-800',
            hoverTransform: 'hover:scale-110 hover:rotate-6'
        },
        {
            name: 'Email',
            url: 'mailto:shamsmohamed155@gmail.com',
            icon: Mail,
            color: 'bg-green-600 hover:bg-green-700',
            hoverTransform: 'hover:scale-110 hover:-rotate-6'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/mshams999/personal-blog',
            icon: Github,
            color: 'bg-gray-900 hover:bg-black',
            hoverTransform: 'hover:scale-110 hover:rotate-12'
        }
    ]

    const blogStats = useMemo(() => {
        const totalPosts = posts?.length || 0
        const totalComments = sortedByComments?.reduce((sum, post) => sum + (getCommentCount ? getCommentCount(post.slug) : 0), 0) || 0
        const totalViews = sortedPosts?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0

        return {
            posts: totalPosts,
            comments: totalComments,
            views: totalViews,
            shortReads: posts?.filter(p => p && p.readTime <= 3).length || 0
        }
    }, [posts, sortedByComments, sortedPosts, getCommentCount])

    return (
        <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Hidden elements for Disqus comment count calculation */}
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">

                    {/* Most Commented Section */}
                    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
                                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Most Commented</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Engaging conversations</p>
                            </div>
                            {commentsLoading && (
                                <div className="ml-auto">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {(sortedByComments && sortedByComments.length > 0 ? sortedByComments : recentPosts || [])
                                .slice(0, 3)
                                .map((post, index) => {
                                    if (!post) return null
                                    const commentCount = getCommentCount ? getCommentCount(post.slug) : 0
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/post/${post.slug}`}
                                            className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                                                />
                                                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{format(new Date(post.date), 'MMM dd')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageCircle className="w-3 h-3" />
                                                        <span>{commentCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Popular Section */}
                    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl mr-4">
                                <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Popular</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Most viewed articles</p>
                            </div>
                            {viewsLoading && (
                                <div className="ml-auto">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {(sortedPosts && sortedPosts.length > 0 ? sortedPosts : recentPosts || [])
                                .slice(0, 3)
                                .map((post, index) => {
                                    if (!post) return null
                                    return (
                                        <Link
                                            key={post.id}
                                            to={`/post/${post.slug}`}
                                            className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                                                />
                                                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{format(new Date(post.date), 'MMM dd')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{formatViewCount(getViewCount(post.slug))}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Short Reads Section */}
                    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
                                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Short Reads</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Quick & insightful</p>
                            </div>
                        </div>

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
                                            className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{format(new Date(post.date), 'MMM dd')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-medium">
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

                {/* Blog Statistics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="text-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                            {blogStats.posts}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Articles</div>
                    </div>
                    <div className="text-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            {formatViewCount(blogStats.views)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Views</div>
                    </div>
                    <div className="text-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                            {blogStats.shortReads}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quick Reads</div>
                    </div>
                    <div className="text-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50">
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            {blogStats.comments}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments</div>
                    </div>
                </div>

                {/* Social Media & Tech Stack Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                    {/* Social Media */}
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start">
                            <Sparkles className="w-6 h-6 mr-3 text-primary-500" />
                            Let's Connect
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Follow my journey and connect with me across platforms
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative p-4 rounded-2xl ${social.color} text-white transition-all duration-300 ${social.hoverTransform} hover:shadow-xl`}
                                        title={social.name}
                                    >
                                        <IconComponent className="w-6 h-6" />
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ExternalLink className="w-3 h-3 text-gray-600 absolute top-0.5 left-0.5" />
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start">
                            <Code className="w-6 h-6 mr-3 text-primary-500" />
                            Built With
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Powered by modern technologies and tools
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {techStack.map((tech, index) => (
                                <div
                                    key={tech.name}
                                    className="group p-4 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="text-2xl mb-2">{tech.icon}</div>
                                    <div className={`text-sm font-semibold ${tech.color} group-hover:scale-110 transition-transform`}>
                                        {tech.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Made with Love & Copyright Section */}
                <div className="text-center py-8 border-t border-gray-200/50 dark:border-dark-700/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Made with Love */}
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <span className="mr-2">Made with</span>
                            <Heart className="w-5 h-5 text-red-500 animate-pulse mx-1" />
                            <span className="ml-1">and</span>
                            <Coffee className="w-5 h-5 text-amber-600 mx-2" />
                            <span>by Dr. Shams</span>
                        </div>

                        {/* Copyright */}
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                            © {currentYear} Dr. Shams Blog. All rights reserved.
                        </div>
                    </div>


                </div>
            </div>
        </footer>
    )
}

export default Footer
