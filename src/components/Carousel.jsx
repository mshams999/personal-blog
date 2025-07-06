import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
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
        <div className="relative w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-3xl overflow-hidden shadow-xl">
            {/* Carousel Container */}
            <div className="relative h-96 md:h-[28rem] lg:h-[32rem] overflow-hidden">
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide ? 'translate-x-0' :
                            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                            }`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col justify-center p-8 lg:p-12 bg-white dark:bg-dark-700">
                                {/* Category Badge */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 w-fit mb-4">
                                    {getCategoryById(post.categoryId)?.name || 'Uncategorized'}
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {post.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.readTime} min read</span>
                                    </div>
                                </div>

                                {/* Read More Button */}
                                <Link
                                    to={`/post/${post.slug}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-300 group w-fit"
                                >
                                    Read Full Article
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {posts.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors duration-300 group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors duration-300 group"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {posts.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                                : 'bg-white/50 dark:bg-gray-600/50 hover:bg-white/75 dark:hover:bg-gray-500/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Auto-play Indicator */}
            {isAutoPlaying && posts.length > 1 && (
                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Auto
                    </div>
                </div>
            )}
        </div>
    )
}

export default Carousel
