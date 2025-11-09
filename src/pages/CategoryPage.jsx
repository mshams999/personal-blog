import React, { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import { Clock, Calendar, ArrowLeft, Eye, Star, MessageCircle } from 'lucide-react'
import { formatDateArabicFull } from '../utils/dateFormat'
import ViewCounter from '../components/ViewCounter'
import FirebaseCommentCount from '../components/FirebaseCommentCount'
import { formatRating } from '../utils/ratings'
import { useBulkPostRatings, getRatingFromBulk } from '../hooks/useRatings'
import MetaTags from '../components/MetaTags'
import {
    generateCollectionPageSchema,
    generateBreadcrumbSchema,
    insertMultipleSchemas
} from '../utils/schemaGenerator'

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
    } = useHybridData()

    // Get the current category
    const category = getCategoryBySlug(categorySlug)

    // Get posts for this category
    const categoryPosts = useMemo(() => {
        if (!category) return []
        return getPostsByCategory(category.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [category, getPostsByCategory])

    // Fetch article ratings using Firebase Firestore
    const postSlugs = useMemo(() => categoryPosts.map(post => post.slug), [categoryPosts])
    const { ratings: ratingsData, loading: ratingsLoading } = useBulkPostRatings(postSlugs)

    // Get other categories for "Related Categories" section
    const otherCategories = categories ? categories.filter(cat => cat.slug !== categorySlug) : []

    // Generate schemas for JSON-LD
    const collectionPageSchema = generateCollectionPageSchema(category, categoryPosts)
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'الرئيسية', url: '/' },
        { name: 'التصنيفات', url: '/categories' },
        { name: category?.name, url: `/category/${category?.slug}` }
    ])

    // Insert schemas on component mount/update
    useEffect(() => {
        if (collectionPageSchema || breadcrumbSchema) {
            const schemas = []
            if (collectionPageSchema) schemas.push({ schema: collectionPageSchema, id: 'collection-page' })
            if (breadcrumbSchema) schemas.push({ schema: breadcrumbSchema, id: 'breadcrumb' })
            insertMultipleSchemas(schemas)
        }
    }, [category?.id])

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        التصنيف غير موجود
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        التصنيف الذي تبحث عنه غير موجود.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        )
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
        <>
            {/* Meta Tags and Structured Data */}
            <MetaTags
                title={category?.name}
                description={category?.description || `مقالات عن ${category?.name}`}
                url={`${window.location.origin}/category/${category?.slug}`}
                type="website"
                schema={collectionPageSchema}
                schemaId="collection-page"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-10">
                    <Link to="/" className="hover:text-primary-500 transition-colors">
                        الرئيسية
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">التصنيفات</span>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{category.name}</span>
                </nav>

                {/* Category Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        {category.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        اكتشف {categoryPosts.length} {categoryPosts.length === 1 ? 'مقالة' : categoryPosts.length === 2 ? 'مقالتين' : 'مقالات'} في تصنيف {category.name}
                    </p>
                </div>

                {/* Posts Grid */}
                {categoryPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {categoryPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                            لم يتم العثور على مقالات
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                            لا توجد حالياً مقالات في تصنيف {category.name}.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            تصفح جميع المقالات
                        </Link>
                    </div>
                )}

                {/* Related Categories */}
                {otherCategories.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-dark-600 pt-16 mt-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            استكشف التصنيفات الأخرى
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                            {otherCategories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.slug}`}
                                    className="group p-5 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 text-center"
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors text-sm mb-1.5">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {getPostsByCategory(cat.id).length} مقالة
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CategoryPage
