import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

/**
 * CategoryPage component for displaying posts filtered by category
 * 
 * Features:
 * - Shows all posts from a specific category
 * - Grid layout similar to home page
 * - Category header with description
 * - Breadcrumb navigation
 * - Related categories
 */
const CategoryPage = () => {
    const { categorySlug } = useParams()
    const {
        getCategoryBySlug,
        getPostsByCategory,
        getAuthorById,
        getCategoryById,
        categories
    } = useData()

    // Get the current category
    const category = getCategoryBySlug(categorySlug)

    // Get posts for this category
    const categoryPosts = useMemo(() => {
        if (!category) return []
        return getPostsByCategory(category.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [category, getPostsByCategory])

    // Get other categories for "Related Categories" section
    const otherCategories = categories ? categories.filter(cat => cat.slug !== categorySlug) : []

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Category Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        The category you're looking for doesn't exist.
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

    const PostCard = ({ post }) => {
        const author = getAuthorById(post.authorId)
        const postCategory = getCategoryById(post.categoryId)

        return (
            <Link
                to={`/post/${post.slug}`}
                className="block bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
                <div className="relative h-52 sm:h-56 md:h-60 lg:h-48 overflow-hidden">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image'
                        }}
                    />
                    {postCategory && (
                        <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-sm">
                                {postCategory.name}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        <span>{post.readTime} min read</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        {author && (
                            <div className="flex items-center">
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="h-5 w-5 rounded-full mr-2"
                                />
                                <span>{author.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
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
                    Discover {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'} in the {category.name.toLowerCase()} category
                </p>
            </div>

            {/* Posts Grid */}
            {categoryPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categoryPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
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

            {/* Related Categories */}
            {otherCategories.length > 0 && (
                <div className="border-t border-gray-200 dark:border-dark-600 pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Explore Other Categories
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {otherCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.slug}`}
                                className="group p-4 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-all duration-300 text-center"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors text-sm">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {getPostsByCategory(cat.id).length} articles
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryPage
