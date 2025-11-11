import React, { useRef } from 'react'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateArabicShort } from '../utils/dateFormat'
import { useHybridData } from '../contexts/HybridDataContext'

/**
 * Carousel Component for Featured Posts
 * 
 * Features:
 * - Auto-sliding carousel with react-slick
 * - Swipe support for mobile and iPad
 * - Manual navigation with arrows
 * - Responsive design
 * - Smooth transitions
 * - Featured post highlights
 */
const Carousel = ({ posts = [], autoSlide = true, slideInterval = 5000 }) => {
    const sliderRef = useRef(null)
    const { getCategoryById } = useHybridData()

    // React Slick settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        swipe: true,
        swipeToSlide: false,
        touchThreshold: 10,
        cssEase: 'ease-in-out',
        arrows: false,
        rtl: true,
        draggable: true,
        touchMove: true,
        waitForAnimate: true,
        dotsClass: 'slick-dots custom-dots',
        appendDots: (dots) => (
            <div className="flex justify-center items-center gap-2 mt-6 mb-2">
                <ul className="flex items-center gap-2">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-300" />
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    swipe: true,
                    touchMove: true,
                    touchThreshold: 10,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    swipe: true,
                    touchMove: true,
                    touchThreshold: 10,
                }
            }
        ]
    }

    if (!posts || posts.length === 0) {
        return null
    }

    return (
        <div className="relative w-full carousel-container"
            style={{
                // Custom styles for slick dots
                '--slick-active-color': '#2563eb',
            }}
        >
            {/* Custom CSS for dots styling */}
            <style>{`
                .carousel-container .custom-dots {
                    position: static !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin: 1.5rem 0 0.5rem 0 !important;
                    padding: 0 !important;
                    list-style: none !important;
                }
                
                .carousel-container .custom-dots li {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: auto !important;
                    height: auto !important;
                    cursor: pointer !important;
                }
                
                .carousel-container .custom-dots li div {
                    width: 8px !important;
                    height: 8px !important;
                    border-radius: 50% !important;
                    background-color: #9CA3AF !important;
                    transition: all 0.3s ease !important;
                }
                
                .carousel-container .custom-dots li.slick-active div {
                    background-color: #3B82F6 !important;
                    width: 24px !important;
                    border-radius: 12px !important;
                    transform: scale(1.1) !important;
                }
                
                .dark .carousel-container .custom-dots li div {
                    background-color: #6B7280 !important;
                }
                
                .dark .carousel-container .custom-dots li.slick-active div {
                    background-color: #60A5FA !important;
                }
                
                .carousel-container .custom-dots li:hover div {
                    background-color: #6B7280 !important;
                    transform: scale(1.1) !important;
                }
                
                .dark .carousel-container .custom-dots li:hover div {
                    background-color: #9CA3AF !important;
                }
            `}</style>

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                <Slider ref={sliderRef} {...settings}>
                    {posts.map((post) => (
                        <div key={post.id}>
                            <Link
                                to={`/post/${post.slug}`}
                                className="block cursor-pointer"
                            >
                                {/* Mobile Layout: Stacked */}
                                <div className="lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-3xl overflow-hidden shadow-xl mx-2">
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
                                <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-3xl overflow-hidden shadow-xl mx-2">
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
                </Slider>
            </div>

            {/* Custom Navigation Arrows - Hidden on mobile */}
            {posts.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            sliderRef.current?.slickPrev()
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
                            sliderRef.current?.slickNext()
                        }}
                        className="hidden lg:flex absolute start-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors duration-300 group z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                </>
            )}
        </div>
    )
}

export default Carousel
