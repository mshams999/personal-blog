/**
 * Simplified Firebase Analytics Hook - Stable Version
 * 
 * This version focuses on stability and prevents infinite re-renders
 * while maintaining basic view tracking functionality.
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { analytics } from '../config/firebase'
import { logEvent } from 'firebase/analytics'
import { incrementArticleView, isFirestoreConfigured } from '../services/firestoreService'

// Local storage key for view counts (fallback)
const VIEW_COUNTS_KEY = 'blog_article_views'

/**
 * Stable hook for Firebase Analytics with localStorage fallback
 * Provides view tracking without infinite re-render issues
 */
export const useFirebaseAnalytics = (posts = []) => {
    const [localViews, setLocalViews] = useState({})
    const [loading, setLoading] = useState(false)
    const initializedRef = useRef(false)

    // Create stable posts reference
    const postsHash = useMemo(() => {
        if (!Array.isArray(posts)) return ''
        return posts.map(p => p?.slug || '').sort().join('|')
    }, [posts?.length, posts?.map(p => p?.slug).join('|') || ''])

    // Load localStorage view counts once
    useEffect(() => {
        if (initializedRef.current || !postsHash) return

        initializedRef.current = true

        try {
            const storedViews = localStorage.getItem(VIEW_COUNTS_KEY)
            const existingViews = storedViews ? JSON.parse(storedViews) : {}

            // Initialize view counts for new posts
            const updatedViews = { ...existingViews }
            let hasChanges = false

            posts.forEach(post => {
                if (!post?.slug) return

                const articlePath = `/post/${post.slug}`
                if (!updatedViews[articlePath]) {
                    // Initialize with a base count based on post age
                    const postAge = Date.now() - new Date(post.date).getTime()
                    const daysSincePublished = Math.floor(postAge / (1000 * 60 * 60 * 24))
                    const baseViews = Math.max(1, Math.floor(daysSincePublished / 2))
                    updatedViews[articlePath] = baseViews
                    hasChanges = true
                }
            })

            setLocalViews(updatedViews)

            // Save if there were changes
            if (hasChanges) {
                localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(updatedViews))
            }

        } catch (error) {
            console.error('Error loading view counts:', error)
            setLocalViews({})
        }
    }, [postsHash])

    // Create stable views object
    const views = useMemo(() => localViews, [localViews])

    // Create sorted posts array
    const sortedPosts = useMemo(() => {
        if (!Array.isArray(posts)) return []

        return posts
            .map(post => {
                const viewCount = views[`/post/${post.slug}`] || 0
                return {
                    ...post,
                    viewCount
                }
            })
            .sort((a, b) => b.viewCount - a.viewCount)
    }, [posts, views])

    return {
        views,
        loading,
        sortedPosts,
        isFirestoreEnabled: false // Temporarily disabled
    }
}

/**
 * Simplified increment view count with localStorage fallback
 * @param {string} slug - Article slug
 * @returns {Promise<number>} - Updated view count
 */
export const incrementViewCount = async (slug) => {
    try {
        const articlePath = `/post/${slug}`

        // Use localStorage for now (Firestore temporarily disabled)
        const storedViews = localStorage.getItem(VIEW_COUNTS_KEY)
        const views = storedViews ? JSON.parse(storedViews) : {}

        views[articlePath] = (views[articlePath] || 0) + 1
        const newCount = views[articlePath]

        localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(views))

        // Track in Firebase Analytics
        if (analytics) {
            logEvent(analytics, 'article_view', {
                article_slug: slug,
                article_path: articlePath,
                view_count: newCount,
                source: 'localStorage'
            })
        }

        return newCount
    } catch (error) {
        console.error('Error incrementing view count:', error)
        return 0
    }
}

/**
 * Track page view event
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 * @param {Object} additionalData - Additional tracking data
 */
export const trackPageView = (pagePath, pageTitle, additionalData = {}) => {
    if (analytics) {
        logEvent(analytics, 'page_view', {
            page_path: pagePath,
            page_title: pageTitle,
            ...additionalData
        })
    }
}

/**
 * Track custom events
 * @param {string} eventName - Event name
 * @param {Object} parameters - Event parameters
 */
export const trackEvent = (eventName, parameters = {}) => {
    if (analytics) {
        logEvent(analytics, eventName, parameters)
    }
}

/**
 * Get view count for a specific article
 * @param {string} slug - Article slug
 * @param {Object} views - Views object from useFirebaseAnalytics hook
 * @returns {number} - View count for the article
 */
export const getArticleViewCount = (slug, views) => {
    return views[`/post/${slug}`] || 0
}

/**
 * Format view count for display
 * @param {number} count - View count
 * @returns {string} - Formatted view count
 */
export const formatViewCount = (count) => {
    if (!count || count === 0) return '0'
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
}
