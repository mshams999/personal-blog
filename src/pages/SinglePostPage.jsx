import React, { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Clock, ArrowLeft, Share2, Bookmark, Heart, ArrowUp, MessageCircle, Star, ChevronDown, X, Facebook, Instagram, Twitter, Globe } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import AuthorBio from '../components/AuthorBio'
import DisqusComments from '../components/DisqusComments'
import { format } from 'date-fns'
import PostCard from '../components/PostCard'

/**
 * SinglePostPage component for displaying individual blog posts
 * 
 * Features:
 * - Dynamic post loading by slug
 * - Featured image header with parallax effect
 * - Glass morphism category badge
 * - Post metadata (author, date, read time)
 * - MDX content rendering with animations
 * - Author bio section
 * - Social sharing buttons
 * - Related posts section
 * - Responsive layout with reading optimizations
 */
const SinglePostPage = () => {
    const { slug } = useParams()
    const { getPostBySlug, getAuthorById, getCategoryById } = useData()
    const [mdxContent, setMdxContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)

    const post = getPostBySlug(slug)
    const author = post ? getAuthorById(post.authorId) : null
    const category = post ? getCategoryById(post.categoryId) : null

    // Handle scroll for parallax effect and scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            setScrollPosition(scrollY)
            setShowScrollTop(scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (post) {
            // Load MDX content
            loadMDXContent(post.mdxContentPath)
            // Scroll to top when post changes
            window.scrollTo(0, 0)
        }
    }, [post])

    const loadMDXContent = async (path) => {
        try {
            setLoading(true)
            // For demo purposes, we'll create sample content
            // In a real app, you would dynamically import the MDX file
            const content = generateSampleContent(post)
            setMdxContent(content)
        } catch (error) {
            console.error('Error loading MDX content:', error)
            setMdxContent(<p>Error loading content.</p>)
        } finally {
            setLoading(false)
        }
    }

    const generateSampleContent = (post) => {
        return (
            <div className="animate-fade-in">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                    {post.excerpt}
                </p>

                <p className="mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white mt-10 gradient-text">
                    Understanding the Concept
                </h2>
                <p className="mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <blockquote className="border-l-4 border-primary-500 pl-4 py-3 my-8 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-700 rounded-r-lg">
                    <p className="text-lg">
                        "The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb
                    </p>
                </blockquote>

                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white mt-8">
                    Key Takeaways
                </h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Focus on what matters most to you</li>
                    <li>Take action consistently, even if it's small</li>
                    <li>Learn from both successes and failures</li>
                    <li>Stay curious and open to new experiences</li>
                </ul>

                <div className="my-10 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">Pro Tip</h4>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white mt-10 gradient-text">
                    Moving Forward
                </h2>
                <p className="mb-6">
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>

                <p className="mb-6">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.
                </p>
            </div>
        )
    }

    if (!post) {
        return <Navigate to="/" replace />
    }

    const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy')

    // Get related posts based on category
    const { posts } = useData()
    const relatedPosts = posts
        .filter(p => p.id !== post.id && p.categoryId === post.categoryId)
        .slice(0, 2)

    // Parallax effect style for header image
    const parallaxStyle = {
        transform: `translateY(${scrollPosition * 0.4}px)`,
        transition: 'transform 0.1s ease-out'
    }

    return (
        <article className="min-h-screen pb-16 animate-fade-in">
            {/* Back Button - Fixed position over the header */}
            <div className="absolute top-6 left-6 z-30">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-white hover:text-gray-200 transition-colors group bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to posts
                </Link>
            </div>

            {/* Featured Image Header with Overlay Content */}
            <div
                className="w-full h-[70vh] md:h-[80vh] relative bg-cover bg-center overflow-hidden"
                style={{
                    backgroundImage: `url(${post.featuredImage})`,
                }}
            >
                {/* Background image with parallax effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{
                        backgroundImage: `url(${post.featuredImage})`,
                        transform: `translateY(${scrollPosition * 0.2}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                ></div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10"></div>

                {/* Header Content */}
                <div className="relative z-20 flex flex-col justify-center items-start h-full max-w-4xl mx-auto px-4 py-16 md:py-20 text-left">
                    {/* Category Tag */}
                    {category && (
                        <div className="mb-6 animate-fade-in">
                            <span className="inline-block px-4 py-2 text-sm font-medium bg-pink-400 text-white rounded-full">
                                {category.name}
                            </span>
                        </div>
                    )}

                    {/* Post Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 drop-shadow-lg animate-slide-up max-w-4xl">
                        {post.title}
                    </h1>

                    {/* Post Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-200 animate-fade-in delay-200 mb-4">
                        {/* Author */}
                        <span className="text-gray-300">by</span>
                        {author && (
                            <span className="font-medium text-white">{author.name}</span>
                        )}

                        <span className="text-gray-400">—</span>

                        {/* Date */}
                        <span className="text-gray-300">5 Years Ago</span>

                        <span className="text-gray-400">—</span>

                        {/* Updated date */}
                        <span className="text-gray-300">Updated: 2 Hours Ago</span>

                        <span className="text-gray-400">—</span>

                        {/* Comments */}
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-gray-300" />
                            <span className="text-gray-300">3</span>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2 animate-fade-in delay-300">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/50" />
                        </div>
                        <span className="text-white font-medium text-lg">4.5/5</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Social Sharing Sidebar - Desktop */}
                <div className="hidden md:flex flex-col fixed right-8 top-1/3 items-center space-y-4 z-30">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm ${liked ? 'bg-primary-500/90 text-white' : 'bg-gray-100/90 text-gray-700 hover:bg-gray-200/90'} dark:bg-dark-700 dark:text-white`}
                        aria-label="Like post"
                    >
                        <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm ${bookmarked ? 'bg-primary-500/90 text-white' : 'bg-gray-100/90 text-gray-700 hover:bg-gray-200/90'} dark:bg-dark-700 dark:text-white`}
                        aria-label="Bookmark post"
                    >
                        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        className="p-3 rounded-full bg-gray-100/90 text-gray-700 hover:bg-gray-200/90 transition-all backdrop-blur-sm dark:bg-dark-700 dark:text-white"
                        aria-label="Share post"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>

                {/* Post Header */}
                <header className="mb-12 animate-slide-up">
                    {/* Post Meta - Additional details */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
                        {author && (
                            <div className="flex items-center space-x-3">
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-dark-800"
                                />
                                <span className="font-medium">{author.name}</span>
                            </div>
                        )}

                        <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime} min read</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Post Content */}
                <div className="prose prose-lg dark:prose-dark max-w-none">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-4/5"></div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/5"></div>
                        </div>
                    ) : (
                        mdxContent
                    )}
                </div>

                {/* Comments Section */}
                <DisqusComments
                    post={post}
                    currentUrl={window.location.href}
                />

                {/* More Reading Section */}
                <div className="mt-16 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Continue Reading</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Discover more insights and stories that will inspire your journey. Our carefully curated collection of articles covers everything from personal development to creative inspiration.
                    </p>
                    <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium">
                        View all articles
                        <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </Link>
                </div>

                {/* Categories */}
                <div className="mt-16">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Categories</h3>
                    <div className="flex flex-wrap gap-3">
                        {['Art & Design', 'Travel', 'Lifestyle', 'Inspiration', 'Technology', 'Photography'].map((categoryName) => (
                            <button
                                key={categoryName}
                                className="px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors text-sm font-medium"
                            >
                                {categoryName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Action Bar */}
                <div className="md:hidden flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`p-2 rounded-full transition-all ${liked ? 'text-primary-500' : 'text-gray-500'}`}
                            aria-label="Like post"
                        >
                            <Heart className={`h-6 w-6 ${liked ? 'fill-primary-500' : ''}`} />
                        </button>
                        <button
                            onClick={() => setBookmarked(!bookmarked)}
                            className={`p-2 rounded-full transition-all ${bookmarked ? 'text-primary-500' : 'text-gray-500'}`}
                            aria-label="Bookmark post"
                        >
                            <Bookmark className={`h-6 w-6 ${bookmarked ? 'fill-primary-500' : ''}`} />
                        </button>
                    </div>
                    <button
                        className="p-2 rounded-full text-gray-500"
                        aria-label="Share post"
                    >
                        <Share2 className="h-6 w-6" />
                    </button>
                </div>

                {/* Enhanced Author Bio */}
                {author && (
                    <div className="mt-16 text-center animate-fade-in">
                        <div className="inline-block">
                            <img
                                src={author.avatar}
                                alt={author.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white dark:ring-dark-800 shadow-lg"
                            />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{author.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
                                {author.bio}
                            </p>

                            {/* Social Links */}
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="p-2 rounded-full bg-gray-200 dark:bg-dark-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500 transition-colors">
                                    <X className="h-5 w-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                                    <Globe className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Previous/Next Post Navigation */}
                <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://placehold.co/80x80/A7D7D7/FFFFFF?text=P1"
                            alt="Previous post"
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full mb-2">
                                Previous Post
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Any delicate you how kindness horrible outlived servants
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-right">
                        <div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full mb-2">
                                Next Post
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pianoforte solicitude so decisively unpleasing
                            </h4>
                        </div>
                        <img
                            src="https://placehold.co/80x80/F2D4D4/FFFFFF?text=P2"
                            alt="Next post"
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-16 text-center">
                    <button className="inline-flex items-center px-6 py-3 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors font-medium">
                        3 Comments
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                </div>

                {/* You May Also Like Section - Full Width */}
                <div className="mt-20 bg-gradient-to-r from-pink-300 to-pink-400 p-8 md:p-12 rounded-2xl text-white w-full">
                    <h2 className="text-3xl font-bold mb-8">You may also like</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Out believe has request not how comfort evident",
                                author: "Will Lewis",
                                category: "Art & Design",
                                image: "https://placehold.co/300x200/A7D7D7/FFFFFF?text=Illustration+1"
                            },
                            {
                                title: "Astonished and acceptance men two discretion",
                                author: "Will Lewis",
                                category: "Art & Design",
                                image: "https://placehold.co/300x200/F2D4D4/FFFFFF?text=Illustration+2"
                            },
                            {
                                title: "Pianoforte solicitude so decisively unpleasing",
                                author: "Will Lewis",
                                category: "Travel",
                                image: "https://placehold.co/300x200/D4E6F1/FFFFFF?text=Illustration+3"
                            },
                            {
                                title: "Songs in oh other avoid it hours woman style",
                                author: "Will Lewis",
                                category: "Lifestyle",
                                image: "https://placehold.co/300x200/FCF3CF/FFFFFF?text=Illustration+4"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-xl overflow-hidden text-gray-900 hover:transform hover:scale-105 transition-all duration-300">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-4">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-pink-100 text-pink-600 rounded-full mb-2">
                                        {item.category}
                                    </span>
                                    <h3 className="font-bold text-sm mb-2 line-clamp-2">{item.title}</h3>
                                    <p className="text-xs text-gray-600">{item.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-all duration-300 z-30 animate-fade-in"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </button>
            )}
        </article>
    )
}

export default SinglePostPage
