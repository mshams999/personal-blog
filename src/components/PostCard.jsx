import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Calendar, Eye, Star } from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import DisqusCommentCount from './DisqusCommentCount'
import ViewCounter from './ViewCounter'
import { formatDateArabicShort } from '../utils/dateFormat'
import { usePostRating } from '../hooks/useRatings'
import { formatRating } from '../utils/ratings'

/**
 * PostCard component for displaying post previews in a grid
 * 
 * Features:
 * - Modern card design with elegant hover effects
 * - Featured image with smooth zoom effect
 * - Category badge with glass morphism
 * - Comprehensive metadata display (author, date, views, comments, ratings)
 * - Responsive design that works in any grid layout
 * - Staggered animation on initial render
 */
const PostCard = ({ post, index = 0 }) => {
    const { getAuthorById, getCategoryById } = useHybridData()
    const navigate = useNavigate()
    const author = getAuthorById(post.authorId)
    const category = getCategoryById(post.categoryId)

    // Get dynamic rating for this post from Firestore
    const { averageRating, totalRatings } = usePostRating(post.slug)

    // Format the date
    const formattedDate = formatDateArabicShort(post.date)

    // Calculate animation delay based on index
    const delayClass = index > 4 ? 'delay-100' : `delay-${index * 100}`

    const handleCardClick = (e) => {
        // Allow clicking on comment count without navigating
        if (e.target.closest('.comment-count-container')) {
            e.preventDefault()
            return
        }
        // Navigate to post
        navigate(`/post/${post.slug}`)
    }

    return (
        <article
            className={`group bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 dark:border-dark-600 transition-all duration-500 h-full animate-slide-up cursor-pointer hover:-translate-y-2 ${delayClass}`}
            onClick={handleCardClick}
        >
            {/* Featured Image with hover zoom effect */}
            <div className="relative h-56 sm:h-60 md:h-64 lg:h-52 overflow-hidden">
                <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Category Badge */}
                {category && (
                    <div className="absolute top-4 end-4 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-white/90 dark:bg-dark-800/90 backdrop-blur-md text-gray-900 dark:text-white rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
                            {category.name}
                        </span>
                    </div>
                )}

                {/* New Badge for recent posts */}
                {new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-lg animate-pulse">
                            جديد
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col space-y-4">
                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Author Info */}
                {author && (
                    <div className="flex items-center gap-3 py-3 border-y border-gray-100 dark:border-dark-600">
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-10 h-10 rounded-full ring-2 ring-primary-100 dark:ring-primary-900/30 object-cover"
                            loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {author.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {author.title || 'كاتب'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Date and Read Time */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5 text-primary-500" />
                            <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5 text-primary-500" />
                            <span className="font-medium">{post.readTime} دقيقة</span>
                        </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Eye className="h-3.5 w-3.5 text-blue-500" />
                            <ViewCounter articleSlug={post.slug} />
                        </div>
                        <div className="comment-count-container flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <DisqusCommentCount
                                post={post}
                                currentUrl={`${window.location.origin}/post/${post.slug}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Rating Display */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-600">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 transition-all duration-300 ${i < Math.round(averageRating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatRating(averageRating)}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        ({totalRatings} {totalRatings === 1 ? 'تقييم' : 'تقييمات'})
                    </span>
                </div>

                {/* Read More Button */}
                <button className="mt-2 w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                    <span>متابعة القراءة</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </article>
    )
}

export default PostCard