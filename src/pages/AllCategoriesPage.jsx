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
                    Discover articles organized by topics that interest you. From technology and design to travel and lifestyle,
                    find exactly what you're looking for.
                </p>
            </div>

            {/* Categories Grid */}
            <Categories
                showTitle={false}
                columns="lg:grid-cols-4"
                className="mb-16"
            />

            {/* Popular Categories Section */}
            <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Most Popular Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories
                        .map(category => ({
                            ...category,
                            postCount: getPostsByCategory(category.id).length
                        }))
                        .sort((a, b) => b.postCount - a.postCount)
                        .slice(0, 3)
                        .map((category) => (
                            <Link
                                key={category.id}
                                to={`/category/${category.slug}`}
                                className="group p-6 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                                        {category.name}
                                    </h3>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                                </p>
                            </Link>
                        ))
                    }
                </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-12">
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                    Back to Home
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </div>
        </div>
    )
}

export default AllCategoriesPage
