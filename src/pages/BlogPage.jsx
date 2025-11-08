import React, { useState, useMemo } from 'react'
import { useHybridData } from '../contexts/HybridDataContext'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateArabicShort } from '../utils/dateFormat'

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
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              !selectedCategory
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedPosts.map(post => {
              const category = getCategoryById(post.categoryId)
              const author = getAuthorById(post.authorId)
              
              return (
                <div
                  key={post.id}
                  className="group bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-dark-600 hover:border-primary-200 dark:hover:border-primary-600"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-600 dark:to-dark-700">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Category Badge */}
                    {category && (
                      <div className="flex items-center gap-2 mb-3">
                        <Link
                          to={`/category/${category.slug}`}
                          className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                          {category.name}
                        </Link>
                      </div>
                    )}
                    
                    {/* Post Title */}
                    <Link
                      to={`/post/${post.slug}`}
                      className="block mb-3 group-hover:text-primary-600 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {post.title}
                      </h3>
                    </Link>
                    
                    {/* Post Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-dark-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime} دقائق
                      </span>
                      <span>{formatDateArabicShort(post.date)}</span>
                    </div>
                    
                    {/* Read More Link */}
                    <Link
                      to={`/post/${post.slug}`}
                      className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm transition-colors"
                    >
                      اقرأ المزيد →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-12">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
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
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        currentPage === page
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
                className={`p-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
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
