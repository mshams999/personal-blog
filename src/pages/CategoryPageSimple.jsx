import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { ArrowLeft } from 'lucide-react'

/**
 * Simple CategoryPage for debugging
 */
const CategoryPageSimple = () => {
    const { categorySlug } = useParams()
    const { getCategoryBySlug, getPostsByCategory, categories } = useData()

    console.log('CategoryPage - categorySlug:', categorySlug)
    console.log('CategoryPage - categories:', categories)

    // Get the current category
    const category = getCategoryBySlug ? getCategoryBySlug(categorySlug) : null
    console.log('CategoryPage - found category:', category)

    // Get posts for this category
    const categoryPosts = category && getPostsByCategory ?
        getPostsByCategory(category.id) : []
    console.log('CategoryPage - categoryPosts:', categoryPosts)

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Category Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        The category "{categorySlug}" doesn't exist.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Available categories: {categories?.map(cat => cat.slug).join(', ')}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <Link to="/" className="hover:text-primary-500 transition-colors">
                    Home
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">Categories</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{category.name}</span>
            </nav>

            {/* Category Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    {category.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Found {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'} in the {category.name.toLowerCase()} category
                </p>
            </div>

            {/* Simple Posts List */}
            {categoryPosts.length > 0 ? (
                <div className="space-y-4 mb-16">
                    {categoryPosts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-dark-700 p-6 rounded-lg border">
                            <h3 className="text-xl font-bold mb-2">
                                <Link
                                    to={`/post/${post.slug}`}
                                    className="hover:text-primary-500 transition-colors"
                                >
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                {post.excerpt}
                            </p>
                            <p className="text-sm text-gray-500">
                                {post.readTime} min read
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        No articles found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        There are currently no articles in the {category.name} category.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Browse All Articles
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CategoryPageSimple
