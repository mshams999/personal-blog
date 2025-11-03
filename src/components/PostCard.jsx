import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Calendar } from 'lucide-react'
import { useHybridData } from '../contexts/HybridDataContext'
import DisqusCommentCount from './DisqusCommentCount'
import { format } from 'date-fns'

/**
 * PostCard component for displaying post previews in a grid
 * 
 * Features:
 * - Clean, modern card design with hover effects
 * - Featured image with subtle zoom effect
 * - Category badge with glass morphism
 * - Post metadata (date, read time)
 * - Responsive design that works in any grid layout
 * - Staggered animation on initial render
 */
const PostCard = ({ post, index = 0 }) => {
    const { getAuthorById, getCategoryById } = useHybridData()
    const navigate = useNavigate()
    const author = getAuthorById(post.authorId)
    const category = getCategoryById(post.categoryId)

    // Format the date
    const formattedDate = format(new Date(post.date), 'MMM dd, yyyy')

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
        <div
            className={`card-hover bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-600 transition-all duration-300 h-full animate-slide-up cursor-pointer ${delayClass}`}
            onClick={handleCardClick}
        >
            {/* Featured Image with hover zoom effect */}
            <div className="relative h-52 sm:h-56 md:h-60 lg:h-48 overflow-hidden img-hover-zoom">
                <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                />

                {/* Category Badge */}
                {category && (
                    <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium glass text-gray-900 dark:text-white rounded-full shadow-sm">
                            {category.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                {/* Post Meta */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} min read</span>
                    </div>
                    <div className="comment-count-container">
                        <DisqusCommentCount
                            post={post}
                            currentUrl={`${window.location.origin}/post/${post.slug}`}
                        />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                </p>

                {/* Author */}
                {author && (
                    <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-dark-600">
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-6 h-6 rounded-full mr-2"
                            loading="lazy"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {author.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCard