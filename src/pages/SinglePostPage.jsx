import React, { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowUp, MessageCircle, Star, ChevronDown, X, Facebook, Instagram, Twitter, Globe, Eye } from 'lucide-react'
import ReactStars from 'react-stars'
import { useHybridData } from '../contexts/HybridDataContext'
import AuthorBio from '../components/AuthorBio'
import DisqusComments from '../components/DisqusComments'
import FirebaseCommentCount from '../components/FirebaseCommentCount'
import ViewCounter from '../components/ViewCounter'
import ApplauseButton from '../components/ApplauseButton'
import SocialShareButton from '../components/SocialShareButton'
import MetaTags from '../components/MetaTags_fixed'
import { TinaCMSContent, StaticContent } from '../components/TinaCMSContent'
import { format } from 'date-fns'
import PostCard from '../components/PostCard'
import { useArticleViews } from '../hooks/useFirebaseViews'
import { usePostRating } from '../hooks/useRatings'
import { savePostRating } from '../utils/ratings'

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
  const [showRatingMessage, setShowRatingMessage] = useState(false)

  const post = getPostBySlug(slug)
  const author = post ? getAuthorById(post.authorId) : null
  const category = post ? getCategoryById(post.categoryId) : null

  // Use a key to force refresh of ratings after user rates
  const [ratingsRefreshKey, setRatingsRefreshKey] = useState(0)

  // Fetch ratings from Firestore using hook
  const {
    averageRating,
    totalRatings,
    userRating,
    loading: ratingsLoading
  } = usePostRating(post?.slug + '_' + ratingsRefreshKey)

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

      // Note: Ratings are now loaded via usePostRating hook
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
          // Process markdown content to fix image paths and convert to HTML
          let processedBody = post.body
            .replace(/!\[([^\]]*)\]\(\/public\/uploads\//g, '![$1](/uploads/') // Fix image paths
            .replace(/\n/g, '<br/>'); // Convert line breaks

          // Basic markdown to HTML conversion for better display
          processedBody = processedBody
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>') // Convert markdown links
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" /><p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">$1</p></div>'); // Convert markdown images

          const content = (
            <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert arabic-text" dir="rtl">
              <div
                className="tinacms-content arabic-text"
                dir="rtl"
                style={{
                  direction: 'rtl',
                  textAlign: 'right',
                  fontFamily: '"Amiri", "Noto Sans Arabic", system-ui, -apple-system, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: processedBody }}
              />
            </div>
          )
          setMdxContent(content)
        } else {
          // Rich text content - use TinaMarkdown
          const content = (
            <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert arabic-text" dir="rtl">
              <TinaCMSContent content={post.body} />
            </div>
          )
          setMdxContent(content)
        }
      } else {
        console.log('⚠️ No TinaCMS content found, falling back to excerpt')

        // Fallback to excerpt if no body content
        const content = (
          <div className="animate-fade-in prose prose-lg max-w-none dark:prose-invert arabic-text" dir="rtl">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8 arabic-text"
              dir="rtl"
              style={{
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: '"Amiri", "Noto Sans Arabic", system-ui, -apple-system, sans-serif'
              }}>
              {post.excerpt}
            </p>

            <div className="my-10 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 shadow-sm" dir="rtl">
              <h4 className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-400 arabic-text" dir="rtl">
                📝 المحتوى غير متوفر
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 arabic-text" dir="rtl">
                هذا المقال لا يحتوي على محتوى كامل. قد يكون السبب:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 mr-4 arabic-text" dir="rtl">
                <li>• محتوى المقال فارغ في TinaCMS</li>
                <li>• فشل في تحميل المحتوى</li>
                <li>• هذا مقال قديم</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 arabic-text" dir="rtl">
                <a href="/admin" className="text-primary-600 hover:text-primary-700 underline">
                  تحرير هذا المقال في TinaCMS
                </a> لإضافة المحتوى.
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

  // Handle rating change - save to Firestore and trigger re-render
  const handleRatingChange = async (newRating) => {
    if (!post) return

    try {
      const result = await savePostRating(post.slug, newRating)

      if (result.success) {
        // Show confirmation message
        setShowRatingMessage(true)
        setTimeout(() => setShowRatingMessage(false), 3000)

        // Trigger re-fetch of ratings by changing the refresh key
        setRatingsRefreshKey(prev => prev + 1)
      } else {
        console.error('Failed to save rating')
      }
    } catch (error) {
      console.error('Error saving rating:', error)
    }
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

      <article className="min-h-screen pb-16 animate-fade-in" dir="rtl">
        {/* Back Button - Fixed position over the header */}
        <div className="absolute top-6 right-6 z-30">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-white hover:text-gray-200 transition-colors group bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            العودة للمقالات
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
          <div className="relative z-20 flex flex-col justify-center items-end h-full max-w-4xl mx-auto px-4 py-16 md:py-20 text-right">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 drop-shadow-lg animate-slide-up max-w-4xl text-right arabic-heading"
              dir="rtl"
              style={{
                fontFamily: '"Amiri", "Noto Sans Arabic", system-ui, -apple-system, sans-serif',
                direction: 'rtl',
                textAlign: 'right',
                lineHeight: '1.3'
              }}>
              {post.title}
            </h1>            {/* Post Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-200 animate-fade-in delay-200 mb-4 justify-end" dir="rtl">
              {/* Author */}
              <span className="text-gray-300">بواسطة</span>
              {author && (
                <span className="font-medium text-white">{author.name}</span>
              )}

              <span className="text-gray-400">—</span>

              {/* Date */}
              <span className="text-gray-300">منذ ٥ سنوات</span>

              <span className="text-gray-400">—</span>

              {/* Updated date */}
              <span className="text-gray-300">آخر تحديث: منذ ساعتين</span>

              <span className="text-gray-400">—</span>

              {/* Comments */}
              <div className="text-gray-300">
                <FirebaseCommentCount
                  post={post}
                  showIcon={false}
                  compact={false}
                />
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-4 animate-fade-in delay-300 justify-end">
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
                  {averageRating.toFixed(1)}/5 ({totalRatings} تقييم)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Social Sharing Sidebar - Desktop */}
          <div className="hidden md:flex flex-col fixed left-8 top-1/3 items-center space-y-4 z-30">
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
          <header className="mb-12 animate-slide-up" dir="rtl">
            {/* Post Meta - Additional details */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 justify-end">
              {author && (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-dark-800"
                  />
                  <span className="font-medium">{author.name}</span>
                </div>
              )}

              <div className="flex items-center space-x-1 space-x-reverse">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} دقيقة قراءة</span>
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
              <div className="flex flex-wrap gap-2 mt-6 justify-end" dir="rtl">
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
          <div className="prose prose-lg dark:prose-dark max-w-none arabic-text"
            dir="rtl"
            style={{
              fontFamily: '"Amiri", "Noto Sans Arabic", system-ui, -apple-system, sans-serif',
              lineHeight: '1.8',
              textAlign: 'right',
              direction: 'rtl'
            }}>
            {loading ? (
              <div className="animate-pulse space-y-6" dir="rtl">
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4 ml-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/2 ml-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-2/3 ml-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-4/5 ml-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/5 ml-auto"></div>
              </div>
            ) : post?.isTinaPost ? (
              // Render TinaCMS content with rich components
              <div dir="rtl" className="arabic-text">
                <TinaCMSContent content={post.body} />
              </div>
            ) : (
              // Render static content or fallback
              <div dir="rtl" className="arabic-text">
                {mdxContent || <StaticContent content={post?.excerpt} />}
              </div>
            )}
          </div>


          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-800 dark:to-dark-700 rounded-2xl border border-blue-100 dark:border-dark-600 relative overflow-hidden" dir="rtl">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  قيّم هذا المقال
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تقييمك يساعدنا في تحسين المحتوى
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
                      متوسط {averageRating.toFixed(1)} ({totalRatings} تقييم)
                    </span>
                  </div>
                </div>

                {/* User rating input */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {userRating > 0 ? 'تقييمك:' : 'اضغط للتقييم:'}
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
                      شكراً لك! لقد أعطيت {userRating} {userRating === 1 ? 'نجمة' : 'نجوم'}
                    </p>
                  )}
                </div>

                {/* Rating confirmation message */}
                {showRatingMessage && (
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm animate-fade-in">
                    ✨ شكراً لك على التقييم!
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
