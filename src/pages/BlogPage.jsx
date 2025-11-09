import React, { useState, useMemo } from 'react'
import { useHybridData } from '../contexts/HybridDataContext'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight, Calendar, Star } from 'lucide-react'
import { formatDateArabicFull } from '../utils/dateFormat'
import ViewCounter from '../components/ViewCounter'
import FirebaseCommentCount from '../components/FirebaseCommentCount'
import { formatRating } from '../utils/ratings'
import { useBulkPostRatings, getRatingFromBulk } from '../hooks/useRatings'

const POSTS_PER_PAGE = 12

const BlogPage = () => {
  const { getAllPosts, categories, getCategoryById, getAuthorById } = useHybridData()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = parseInt(searchParams.get('page')) || 1
  const selectedCategory = searchParams.get('category')

  // Get all posts, optionally filtered by category
  const allPosts = useMemo(() => {
    const posts = getAllPosts()
    if (selectedCategory) {
      return posts.filter(p => p.categoryId === selectedCategory)
    }
    return posts
  }, [selectedCategory, getAllPosts])

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return allPosts.slice(start, start + POSTS_PER_PAGE)
  }, [currentPage, allPosts])

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  // Fetch article ratings using Firebase Firestore
  const postSlugs = useMemo(() => paginatedPosts.map(post => post.slug), [paginatedPosts])
  const { ratings: ratingsData, loading: ratingsLoading } = useBulkPostRatings(postSlugs)

  const handleCategoryFilter = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId, page: '1' })
    } else {
      setSearchParams({})
    }
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams()
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    params.set('page', page)
    setSearchParams(params)
    window.scrollTo(0, 0)
  }

  const PostCard = ({ post }) => {
    const author = getAuthorById(post.authorId)
    const postCategory = getCategoryById(post.categoryId)

    // Get dynamic rating for this post from Firestore
    const ratingInfo = getRatingFromBulk(ratingsData, post.slug)
    const { averageRating, totalRatings } = ratingInfo

    return (
      <Link
        to={`/post/${post.slug}`}
        className="block bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-600 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      >
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image'
            }}
          />
          {postCategory && (
            <div className="absolute top-4 end-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-sm">
                {postCategory.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors leading-snug">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDateArabicFull(post.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime} دقيقة</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-dark-600">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  loading="lazy"
                  className="h-6 w-6 rounded-full ring-2 ring-gray-200 dark:ring-dark-600"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{author.name}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <div className="flex items-center gap-1">
                <ViewCounter articleSlug={post.slug} />
              </div>
              <FirebaseCommentCount
                post={post}
                showIcon={true}
                className="text-gray-500 dark:text-gray-400"
              />
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span>{formatRating(averageRating)} ({totalRatings})</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link to="/" className="hover:text-primary-500 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">المقالات</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          جميع المقالات
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          اكتشف مجموعة كاملة من المقالات والتجارب الشخصية والرؤى المتقدمة المنظمة حسب الفئات
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          تصفية حسب الفئة:
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!selectedCategory
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-600'
              }`}
          >
            جميع الفئات ({allPosts.length})
          </button>
          {categories?.map(cat => {
            const catPostCount = getAllPosts().filter(p => p.categoryId === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-600'
                  }`}
              >
                {cat.name} ({catPostCount})
              </button>
            )
          })}
        </div>
      </div>

      {/* Posts Count */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        عرض {paginatedPosts.length} من {allPosts.length} مقالة
        {selectedCategory && ` في فئة: ${categories?.find(c => c.id === selectedCategory)?.name}`}
      </p>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-12">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg font-medium transition-all ${currentPage === 1
                  ? 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                aria-label="الصفحة السابقة"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Show first page, last page, current page, and pages around current
                  const isVisible =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1

                  if (!isVisible) {
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <span key={page} className="px-2 py-1 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-600'
                        }`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                aria-label="الصفحة التالية"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            لا توجد مقالات في هذه الفئة حالياً
          </p>
          <Link
            to="/blog"
            className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
          >
            العودة إلى جميع المقالات
          </Link>
        </div>
      )}
    </div>
  )
}

export default BlogPage
