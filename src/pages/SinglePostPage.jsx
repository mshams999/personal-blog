import React, { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowUp, MessageCircle, Star, ChevronDown, X, Facebook, Instagram, Twitter, Globe, Eye } from 'lucide-react'
import ReactStars from 'react-stars'
import { useHybridData } from '../contexts/HybridDataContext'
import AuthorBio from '../components/AuthorBio'
import DisqusComments from '../components/DisqusComments'
import DisqusCommentCount from '../components/DisqusCommentCount'
import ViewCounter from '../components/ViewCounter'
import ApplauseButton from '../components/ApplauseButton'
import SocialShareButton from '../components/SocialShareButton'
import MetaTags from '../components/MetaTags_fixed'
import { TinaCMSContent, StaticContent } from '../components/TinaCMSContent'
import { format } from 'date-fns'
import PostCard from '../components/PostCard'
import { useArticleViews } from '../hooks/useFirebaseViews'
import { getPostRating, savePostRating, getUserRating } from '../utils/ratings'

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
 * - Real-time view count tracking
 */
const SinglePostPage = () => {
  const { slug } = useParams()
  const { getPostBySlug, getAuthorById, getCategoryById, categories, getAllPosts } = useHybridData()
  const [mdxContent, setMdxContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [showRatingMessage, setShowRatingMessage] = useState(false)

  const post = getPostBySlug(slug)
  const author = post ? getAuthorById(post.authorId) : null
  const category = post ? getCategoryById(post.categoryId) : null

  // Get all posts for navigation
  const allPosts = getAllPosts()

  // Find current post index and get previous/next posts
  const currentPostIndex = allPosts.findIndex(p => p.slug === slug)
  const previousPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null
  const nextPost = currentPostIndex < allPosts.length - 1 ? allPosts[currentPostIndex + 1] : null

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📚 Post Navigation:', {
      currentPost: post?.title,
      currentIndex: currentPostIndex,
      totalPosts: allPosts.length,
      previousPost: previousPost?.title || 'None',
      nextPost: nextPost?.title || 'None'
    })
  }

  // Use Firebase view tracking for this article
  const { viewCount, loading: viewLoading } = useArticleViews(
    post?.slug,
    true, // shouldIncrement = true for article pages
    post?.date // Pass article date for consistent fallback
  )

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

      // Load ratings for this post
      loadRatings()
    }
  }, [post])

  const loadMDXContent = async (path) => {
    try {
      setLoading(true)

      // Check if the post has TinaCMS content (body field)
      if (post.body) {
        console.log('📝 Loading TinaCMS content for post:', post.title)
        console.log('🔍 Post body structure:', post.body)
        console.log('🔍 Post body type:', typeof post.body)

        // Check if the body is a string (markdown) or rich-text object
        if (typeof post.body === 'string') {
          // Simple markdown/text content
          const content = (
            <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert">
              <div
                className="tinacms-content"
                dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br/>') }}
              />
            </div>
          )
          setMdxContent(content)
        } else {
          // Rich text content - use TinaMarkdown
          const content = (
            <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert">
              <TinaCMSContent content={post.body} />
            </div>
          )
          setMdxContent(content)
        }
      } else {
        console.log('⚠️ No TinaCMS content found, falling back to excerpt')

        // Fallback to excerpt if no body content
        const content = (
          <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
              {post.excerpt}
            </p>

            <div className="my-10 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 shadow-sm">
              <h4 className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                📝 Content Not Available
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This post doesn't have full content available. This could be because:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4">
                <li>• The post body is empty in TinaCMS</li>
                <li>• The content failed to load</li>
                <li>• This is a legacy post</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <a href="/admin" className="text-primary-600 hover:text-primary-700 underline">
                  Edit this post in TinaCMS
                </a> to add content.
              </p>
            </div>
          </div>
        )
        setMdxContent(content)
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMdxContent(
        <div className="animate-fade-in">
          <p className="text-red-600 dark:text-red-400">Error loading content.</p>
        </div>
      )
    } finally {
      setLoading(false)
    }
  }

  // Rating helper functions using utility
  const loadRatings = () => {
    if (!post) return

    const { averageRating, totalRatings } = getPostRating(post.slug)
    const userRating = getUserRating(post.slug)

    setAverageRating(averageRating)
    setTotalRatings(totalRatings)
    setUserRating(userRating)
  }

  const handleRatingChange = (newRating) => {
    if (!post) return

    const { averageRating, totalRatings } = savePostRating(post.slug, newRating)

    // Update state
    setUserRating(newRating)
    setTotalRatings(totalRatings)
    setAverageRating(averageRating)

    // Show confirmation message
    setShowRatingMessage(true)
    setTimeout(() => setShowRatingMessage(false), 3000)
  }

  if (!post) {
    return <Navigate to="/" replace />
  }

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy')

  // Get related posts based on category
  const { posts } = useHybridData()
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.categoryId === post.categoryId)
    .slice(0, 2)

  // Get suggested posts for "You may also like" section (mix of related and recent posts)
  const suggestedPosts = posts
    .filter(p => p.id !== post.id)
    .sort((a, b) => {
      // Prioritize posts from same category, then by date
      if (a.categoryId === post?.categoryId && b.categoryId !== post?.categoryId) return -1
      if (b.categoryId === post?.categoryId && a.categoryId !== post?.categoryId) return 1
      return new Date(b.date) - new Date(a.date)
    })
    .slice(0, 4)

  // Parallax effect style for header image
  const parallaxStyle = {
    transform: `translateY(${scrollPosition * 0.4}px)`,
    transition: 'transform 0.1s ease-out'
  }

  return (
    <>
      {/* Meta Tags for Social Sharing */}
      <MetaTags
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        url={`${window.location.origin}/post/${post.slug}`}
        type="article"
        author={author?.name}
        publishedTime={new Date(post.date).toISOString()}
      />

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
                <Link
                  to={`/category/${category.slug}`}
                  className="inline-block px-4 py-2 text-sm font-medium bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-colors"
                >
                  {category.name}
                </Link>
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
              <DisqusCommentCount
                post={post}
                currentUrl={window.location.href}
                className="text-gray-300"
              />
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-4 animate-fade-in delay-300">
              <div className="flex items-center gap-2">
                <ReactStars
                  count={5}
                  value={averageRating}
                  size={24}
                  color1={'#374151'}
                  color2={'#FDE047'}
                  half={true}
                  edit={false}
                />
                <span className="text-white font-medium text-lg">
                  {averageRating.toFixed(1)}/5 ({totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Social Sharing Sidebar - Desktop */}
          <div className="hidden md:flex flex-col fixed right-8 top-1/3 items-center space-y-4 z-30">
            {/* Applause Button for sidebar */}
            <div className="bg-gray-100/90 backdrop-blur-sm rounded-full p-2 dark:bg-dark-700" title="Applaud this post">
              <ApplauseButton
                url={`${window.location.origin}/post/${post.slug}`}
                size="sm"
                className="applause-sidebar"
              />
            </div>
            <SocialShareButton
              url={`${window.location.origin}/post/${post.slug}`}
              title={post.title}
              text={post.excerpt}
              image={post.featuredImage}
              size="md"
            />
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

              <ViewCounter
                articleSlug={post.slug}
                shouldIncrement={false} // Don't double-increment, already handled by useArticleViews hook
                size="md"
                variant="default"
                articleDate={post.date}
              />
            </div>


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
          <div className="prose prose-lg dark:prose-dark max-w-none" dir="rtl">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/5"></div>
              </div>
            ) : post?.isTinaPost ? (
              // Render TinaCMS content with rich components
              <TinaCMSContent content={post.body} />
            ) : (
              // Render static content or fallback
              mdxContent || <StaticContent content={post?.excerpt} />
            )}
          </div>


          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-2xl border border-blue-100 dark:border-dark-600 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Rate This Article
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your feedback helps us create better content
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                {/* Current average rating display */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ReactStars
                      count={5}
                      value={averageRating}
                      size={20}
                      color1={'#9CA3AF'}
                      color2={'#FDE047'}
                      half={true}
                      edit={false}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {averageRating.toFixed(1)} average ({totalRatings} ratings)
                    </span>
                  </div>
                </div>

                {/* User rating input */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {userRating > 0 ? 'Your rating:' : 'Click to rate:'}
                  </p>
                  <ReactStars
                    count={5}
                    value={userRating}
                    size={32}
                    color1={'#D1D5DB'}
                    color2={'#F59E0B'}
                    half={false}
                    edit={true}
                    onChange={handleRatingChange}
                  />
                  {userRating > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Thanks for rating! You gave {userRating} star{userRating !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Rating confirmation message */}
                {showRatingMessage && (
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm animate-fade-in">
                    ✨ Thank you for your rating!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <DisqusComments
            post={post}
            currentUrl={window.location.href}
          />



          {/* Categories */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Categories</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors text-sm font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Action Bar */}
          <div className="md:hidden flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex space-x-4 items-center">
              {/* Mobile Applause Button */}
              <div title="Applaud this post">
                <ApplauseButton
                  url={`${window.location.origin}/post/${post.slug}`}
                  size="sm"
                  className="applause-mobile"
                />
              </div>
            </div>
            <SocialShareButton
              url={`${window.location.origin}/post/${post.slug}`}
              title={post.title}
              text={post.excerpt}
              image={post.featuredImage}
              size="md"
            />
          </div>



          {/* Previous/Next Post Navigation */}
          {(previousPost || nextPost) && (
            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Previous Post */}
              {previousPost ? (
                <Link
                  to={`/post/${previousPost.slug}`}
                  className="flex items-center space-x-4 group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={previousPost.featuredImage}
                    alt={previousPost.title}
                    className="w-20 h-20 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x80/A7D7D7/FFFFFF?text=Prev'
                    }}
                  />
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full mb-2">
                      Previous Post
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2 max-w-xs">
                      {previousPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {format(new Date(previousPost.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {/* Next Post */}
              {nextPost ? (
                <Link
                  to={`/post/${nextPost.slug}`}
                  className="flex items-center space-x-4 text-right group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full mb-2">
                      Next Post
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2 max-w-xs">
                      {nextPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {format(new Date(nextPost.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <img
                    src={nextPost.featuredImage}
                    alt={nextPost.title}
                    className="w-20 h-20 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x80/F2D4D4/FFFFFF?text=Next'
                    }}
                  />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          )}




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
    </>
  )
}

export default SinglePostPage
