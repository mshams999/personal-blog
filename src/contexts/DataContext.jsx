import React, { createContext, useContext } from 'react'
import blogData from '../data/info.json'

const DataContext = createContext()

/**
 * Data Provider component for managing blog data
 * 
 * This component provides access to all blog data from info.json including:
 * - Site metadata (title, description, author, social links)
 * - Navigation items
 * - Authors information
 * - Categories
 * - Posts
 * - Footer data
 * 
 * It also provides utility functions for finding specific data by ID or slug
 */
export const DataProvider = ({ children }) => {
    /**
     * Find a post by its slug
     */
    const getPostBySlug = (slug) => {
        return blogData.posts.find(post => post.slug === slug)
    }

    /**
     * Find an author by their ID
     */
    const getAuthorById = (id) => {
        return blogData.authors.find(author => author.id === id)
    }

    /**
     * Find a category by its ID
     */
    const getCategoryById = (id) => {
        return blogData.categories.find(category => category.id === id)
    }

    /**
     * Get posts by category ID
     */
    const getPostsByCategory = (categoryId) => {
        return blogData.posts.filter(post => post.categoryId === categoryId)
    }

    /**
     * Get posts by author ID
     */
    const getPostsByAuthor = (authorId) => {
        return blogData.posts.filter(post => post.authorId === authorId)
    }

    /**
     * Get recent posts (sorted by date, newest first)
     */
    const getRecentPosts = (limit = 5) => {
        return [...blogData.posts]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
    }

    /**
     * Get popular posts (for simplicity, using footer data)
     */
    const getPopularPosts = () => {
        return blogData.footer.popularPosts.map(popular =>
            getPostBySlug(popular.slug)
        ).filter(Boolean)
    }

    /**
     * Get all unique tags from posts
     */
    const getAllTags = () => {
        const tags = new Set()
        blogData.posts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag))
        })
        return Array.from(tags)
    }

    const value = {
        // Raw data
        siteMetadata: blogData.siteMetadata,
        navigation: blogData.navigation,
        authors: blogData.authors,
        categories: blogData.categories,
        posts: blogData.posts,
        footer: blogData.footer,

        // Utility functions
        getPostBySlug,
        getAuthorById,
        getCategoryById,
        getPostsByCategory,
        getPostsByAuthor,
        getRecentPosts,
        getPopularPosts,
        getAllTags,
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

/**
 * Hook to access blog data context
 */
export const useData = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
