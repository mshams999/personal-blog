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
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">All Categories</span>
      </nav>

      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover articles organized by topics that interest you. From Medical mysteries and Social Articles to travel and lifestyle,
          find exactly what you're looking for.
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
