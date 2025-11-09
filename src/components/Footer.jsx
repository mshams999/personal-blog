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
 * Redesigned: July 10, 2025
 * 
 * Features:
 * - Concise and organized 4-column layout
 * - Sections for Most Commented, Popular, and Short Reads
 * - Integrated "About & Connect" section with social links
 * - Subtle tech stack display in the bottom bar
 * - Dynamic year display and "Made with" section
 */
const Footer = () => {
    const { posts, getAuthorById, getRecentPosts } = useHybridData()

    const recentPosts = useMemo(() => {
        try {
            const recent = getRecentPosts ? getRecentPosts(6) : posts.slice(0, 6)
            return recent || []
        } catch (err) {
            return []
        }
    }, [posts, getRecentPosts])

    const { viewCounts, getViewCount, loading: viewsLoading } = useBulkArticleViews(recentPosts)

    const sortedPosts = useMemo(() => {
        if (!recentPosts || recentPosts.length === 0) return []
        return recentPosts
            .map(post => ({
                ...post,
                viewCount: getViewCount(post.slug)
            }))
            .sort((a, b) => b.viewCount - a.viewCount)
    }, [recentPosts, viewCounts, getViewCount])

    let commentData = { sortedByComments: [], getCommentCount: () => 0, loading: false }
    try {
        commentData = useDisqusCommentCounts(recentPosts)
    } catch (error) {
        // Silent fail
    }
    const { sortedByComments, getCommentCount, loading: commentsLoading } = commentData

    const currentYear = new Date().getFullYear()

    const techStack = [
        { name: 'React', icon: '⚛️' },
        { name: 'Vite', icon: '⚡' },
        { name: 'Tailwind CSS', icon: '🎨' },
        { name: 'Firebase', icon: '🔥' },
        { name: 'TinaCMS', icon: '📝' },
    ]

    const socialLinks = [
        { name: 'Facebook', url: 'https://www.facebook.com/mosh936', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
        { name: 'Twitter', url: 'https://x.com/MohamedShams936', icon: Twitter, color: 'bg-gray-800 hover:bg-gray-900' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohamedshamsms/', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
        { name: 'Email', url: 'mailto:shamsmohamed155@gmail.com', icon: Mail, color: 'bg-green-600 hover:bg-green-700' },
        { name: 'GitHub', url: 'https://github.com/mshams999/personal-blog', icon: Github, color: 'bg-gray-900 hover:bg-black' },
    ]

    const renderPostList = (posts, type) => {
        return (posts || []).slice(0, 3).map(post => {
            if (!post) return null
            let meta
            switch (type) {
                case 'comments':
                    meta = <><MessageCircle className="w-3 h-3" /><span>{getCommentCount(post.slug)}</span></>
                    break
                case 'views':
                    meta = <><Eye className="w-3 h-3" /><span>{formatViewCount(getViewCount(post.slug))}</span></>
                    break
                case 'readTime':
                    meta = <><Clock className="w-3 h-3" /><span>{post.readTime} min</span></>
                    break
                default:
                    meta = null
            }

            return (
                <Link key={post.id} to={`/post/${post.slug}`} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700/50 transition-all duration-200">
                    <img src={post.featuredImage} alt={post.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {post.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {meta}
                        </div>
                    </div>
                </Link>
            )
        })
    }

    return (
        <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden border-t border-gray-200 dark:border-dark-700">
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {recentPosts && recentPosts.length > 0 && (
                <div style={{ display: 'none' }}>
                    {recentPosts.map(post => (
                        <a key={`disqus-count-${post.slug}`} href={`#disqus_thread`} data-disqus-identifier={post.slug} data-disqus-url={`${window.location.origin}/post/${post.slug}`}>0</a>
                    ))}
                </div>
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                            <Sparkles className="w-5 h-5 me-2 text-primary-500" />
                            مدونة د. شمس
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            أؤمن أن الفضول هو بداية كل معرفة.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group p-2 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                                    title={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <MessageCircle className="w-5 h-5 me-2 text-blue-500" />
                            الأكثر تعليقاً
                        </h3>
                        <div className="space-y-3">
                            {renderPostList(sortedByComments, 'comments')}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Eye className="w-5 h-5 me-2 text-orange-500" />
                            الأكثر قراءة
                        </h3>
                        <div className="space-y-3">
                            {renderPostList(sortedPosts, 'views')}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Clock className="w-5 h-5 me-2 text-green-500" />
                            قراءات سريعة
                        </h3>
                        <div className="space-y-3">
                            {renderPostList(posts.filter(p => p && p.readTime <= 3), 'readTime')}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200/50 dark:border-dark-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">بُنيت باستخدام:</span>
                        <div className="flex flex-wrap gap-3">
                            {techStack.map(tech => (
                                <div key={tech.name} title={tech.name} className="text-xl hover:scale-125 transition-transform duration-200">{tech.icon}</div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-start">
                        <div className="flex items-center justify-center sm:justify-start gap-1">
                            <span>صُنعت بـ</span>
                            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                            <span>بواسطة د. شمس</span>
                        </div>
                        <div>© {currentYear} جميع الحقوق محفوظة</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
