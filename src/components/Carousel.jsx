import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateArabicShort } from '../utils/dateFormat'
import { useHybridData } from '../contexts/HybridDataContext'

/**
 * Carousel Component for Featured Posts
 * 
 * Features:
 * - Auto-sliding carousel
 * - Manual navigation with arrows
 * - Responsive design
 * - Smooth transitions
 * - Featured post highlights
 */
const Carousel = ({ posts = [], autoSlide = true, slideInterval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoSlide)
    const { getCategoryById } = useHybridData()

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || posts.length <= 1) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % posts.length)
        }, slideInterval)

        return () => clearInterval(interval)
    }, [isAutoPlaying, posts.length, slideInterval])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % posts.length)
        setIsAutoPlaying(false) // Pause auto-play when user interacts
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length)
        setIsAutoPlaying(false) // Pause auto-play when user interacts
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false) // Pause auto-play when user interacts
    }

    if (!posts || posts.length === 0) {
        return null
    }

    return (
        <div className="relative w-full">
            {/* Carousel Container with proper background only on desktop */}
            <div className="relative overflow-hidden">
                <div className="relative">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className={`transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'
                                }`}
                        >
                            <Link
                                to={`/post/${post.slug}`}
                                className="block cursor-pointer"
                            >
                                {/* Mobile Layout: Stacked */}
                                <div className="lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-3xl overflow-hidden shadow-xl">
                                    {/* Image Section */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center'}
                                            alt={post.title}
                                            className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex flex-col justify-between p-4 sm:p-6 bg-white dark:bg-dark-700">
                                        <div>
                                            {/* Category Badge */}
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 w-fit mb-3">
                                                {getCategoryById(post.categoryId)?.name || 'Uncategorized'}
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>

                                        {/* Meta Information */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDateArabicShort(post.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime} دقيقة</span>
                                            </div>
                                            <div className="me-auto">
                                                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout: Side by Side */}
                                <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-3xl overflow-hidden shadow-xl">
                                    <div className="grid grid-cols-2 h-[32rem]">
                                        {/* Image Section */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center'}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center'
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-col justify-between p-12 bg-white dark:bg-dark-700">
                                            <div>
                                                {/* Category Badge */}
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 w-fit mb-4">
                                                    {getCategoryById(post.categoryId)?.name || 'Uncategorized'}
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight line-clamp-2">
                                                    {post.title}
                                                </h2>

                                                {/* Excerpt */}
                                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            {/* Meta Information */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDateArabicShort(post.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{post.readTime} دقيقة</span>
                                                </div>
                                                <div className="me-auto">
                                                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Hidden on mobile to avoid clutter */}
            {posts.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            prevSlide()
                        }}
                        className="hidden lg:flex absolute end-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors duration-300 group z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            nextSlide()
                        }}
                        className="hidden lg:flex absolute start-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors duration-300 group z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                </>
            )}

            {/* Dot Indicators - Below the card */}
            {posts.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 mb-2">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                goToSlide(index)
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-blue-600 dark:bg-blue-400 w-8'
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}

                    {/* Auto-play Indicator */}
                    {isAutoPlaying && (
                        <div className="ms-3 flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-dark-700 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Auto</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Carousel
