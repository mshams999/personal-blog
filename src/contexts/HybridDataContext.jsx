import React, { createContext, useContext, useState, useEffect } from 'react'
import blogData from '../data/info.json'
import { fetchTinaPosts, convertTinaPostToBlogFormat } from '../utils/tinaDataLoader'

const HybridDataContext = createContext()

/**
 * Hybrid Data Provider that combines static JSON data with TinaCMS data
 * 
 * This provider merges:
 * - Static data from info.json (authors, categories, site metadata)
 * - Dynamic posts from TinaCMS MDX files
 * 
 * TinaCMS posts take precedence over static posts with the same slug
 */
export const HybridDataProvider = ({ children }) => {
    const [tinaPosts, setTinaPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load TinaCMS posts on mount
    useEffect(() => {
        const loadTinaPosts = async () => {
            try {
                setLoading(true)
                setError(null)

                // Add timeout to prevent infinite loading
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('TinaCMS loading timeout')), 10000)
                )

                const fetchPromise = fetchTinaPosts()
                const posts = await Promise.race([fetchPromise, timeoutPromise])

                const convertedPosts = posts.map(convertTinaPostToBlogFormat)
                setTinaPosts(convertedPosts)
                console.log(`✅ Loaded ${convertedPosts.length} TinaCMS posts`)
            } catch (err) {
                console.warn('⚠️ TinaCMS unavailable, using static posts only:', err.message)
                setError(err)
                setTinaPosts([]) // Fallback to static posts only
            } finally {
                setLoading(false)
            }
        }

        loadTinaPosts()
    }, [])

    /**
     * Get all posts (TinaCMS + static, with TinaCMS taking precedence)
     */
    const getAllPosts = () => {
        const staticPosts = blogData.posts || []
        const tinaPostSlugs = new Set(tinaPosts.map(post => post.slug))

        console.log('getAllPosts - staticPosts:', staticPosts.length, 'tinaPosts:', tinaPosts.length)
        console.log('Static posts:', staticPosts)
        console.log('Tina posts:', tinaPosts)

        // Filter out static posts that have been replaced by TinaCMS posts
        const filteredStaticPosts = staticPosts.filter(post => !tinaPostSlugs.has(post.slug))

        // Combine TinaCMS posts with remaining static posts
        const allPosts = [...tinaPosts, ...filteredStaticPosts]
            .sort((a, b) => new Date(b.date) - new Date(a.date))

        console.log('getAllPosts result:', allPosts.length, 'posts')
        return allPosts
    }

    /**
     * Get recent posts
     */
    const getRecentPosts = (limit = 10) => {
        return getAllPosts().slice(0, limit)
    }

    /**
     * Find a post by its slug (TinaCMS posts take precedence)
     */
    const getPostBySlug = (slug) => {
        // First check TinaCMS posts
        const tinaPost = tinaPosts.find(post => post.slug === slug)
        if (tinaPost) return tinaPost

        // Fallback to static posts
        return blogData.posts?.find(post => post.slug === slug) || null
    }

    /**
     * Find an author by their ID
     */
    const getAuthorById = (id) => {
        return blogData.authors?.find(author => author.id === id) || null
    }

    /**
     * Find a category by its ID
     */
    const getCategoryById = (id) => {
        return blogData.categories?.find(category => category.id === id) || null
    }

    /**
     * Find a category by its slug
     */
    const getCategoryBySlug = (slug) => {
        return blogData.categories?.find(category => category.slug === slug) || null
    }

    /**
     * Get posts by category ID
     */
    const getPostsByCategory = (categoryId) => {
        return getAllPosts().filter(post => post.categoryId === categoryId)
    }

    /**
     * Get posts by author ID
     */
    const getPostsByAuthor = (authorId) => {
        return getAllPosts().filter(post => post.authorId === authorId)
    }

    /**
     * Get posts by tag
     */
    const getPostsByTag = (tag) => {
        return getAllPosts().filter(post =>
            post.tags && post.tags.some(postTag =>
                postTag.toLowerCase() === tag.toLowerCase()
            )
        )
    }

    /**
     * Search posts by title or excerpt
     */
    const searchPosts = (query) => {
        const lowercaseQuery = query.toLowerCase()
        return getAllPosts().filter(post =>
            post.title.toLowerCase().includes(lowercaseQuery) ||
            post.excerpt.toLowerCase().includes(lowercaseQuery)
        )
    }

    /**
     * Get featured posts (first 3 posts)
     */
    const getFeaturedPosts = () => {
        return getRecentPosts(3)
    }

    const contextValue = {
        // Static data from info.json
        siteMetadata: blogData.siteMetadata,
        navigation: blogData.navigation,
        authors: blogData.authors,
        categories: blogData.categories,

        // Hybrid post data
        posts: getAllPosts(),
        tinaPosts,
        loading,
        error,

        // Helper functions
        getAllPosts,
        getRecentPosts,
        getPostBySlug,
        getAuthorById,
        getCategoryById,
        getCategoryBySlug,
        getPostsByCategory,
        getPostsByAuthor,
        getPostsByTag,
        searchPosts,
        getFeaturedPosts
    }

    return (
        <HybridDataContext.Provider value={contextValue}>
            {children}
        </HybridDataContext.Provider>
    )
}

export const useHybridData = () => {
    const context = useContext(HybridDataContext)
    if (!context) {
        throw new Error('useHybridData must be used within a HybridDataProvider')
    }
    return context
}

export default HybridDataContext
