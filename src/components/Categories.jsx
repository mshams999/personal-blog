import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../contexts/DataContext'

/**
 * Categories component for displaying all available categories
 * 
 * Features:
 * - Grid layout of category cards
 * - Shows article count for each category
 * - Linkable to category pages
 * - Responsive design
 */
const Categories = ({
    title = "Categories",
    className = "",
    showTitle = true,
    columns = "lg:grid-cols-6"
}) => {
    const { categories, getPostsByCategory } = useData()

    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <div className={className}>
            {showTitle && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    {title}
                </h2>
            )}

            <div className={`grid grid-cols-2 md:grid-cols-3 ${columns} gap-4`}>
                {categories.map((category) => {
                    const postCount = getPostsByCategory(category.id).length

                    return (
                        <Link
                            key={category.id}
                            to={`/category/${category.slug}`}
                            className="group p-6 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-all duration-300 text-center hover:border-primary-200 dark:hover:border-primary-600"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors mb-2">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {postCount} {postCount === 1 ? 'article' : 'articles'}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Categories
