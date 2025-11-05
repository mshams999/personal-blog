import React from 'react'
import { Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import { ArrowRight } from 'lucide-react'
import Categories from '../components/Categories'

/**
 * AllCategoriesPage component for displaying all available categories
 * 
 * Features:
 * - Complete list of all categories
 * - Links to individual category pages
 * - Shows article count for each category
 * - Responsive grid layout
 */
const AllCategoriesPage = () => {
  const { categories, getPostsByCategory } = useHybridData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link to="/" className="hover:text-primary-500 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">جميع التصنيفات</span>
      </nav>

      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          تصفح حسب التصنيف
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          اكتشف المقالات المنظمة حسب المواضيع التي تهمك. من الألغاز الطبية والمقالات الاجتماعية إلى السفر وأسلوب الحياة، ابحث عن ما تبحث عنه بالضبط.
        </p>
      </div>

      {/* Categories Grid */}
      <Categories
        showTitle={false}
        columns="lg:grid-cols-4"
        className="mb-16"
      />




    </div>
  )
}

export default AllCategoriesPage
