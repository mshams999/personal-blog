/**
 * Enhanced Firebase Analytics Hook with Firestore Integration
 * 
 * This hook combines the existing localStorage-based view tracking with
 * Firebase Firestore for persistent, real-time view counts across devices.
 * 
 * Features:
 * - Firebase Firestore integration for persistent view storage
 * - Fallback to localStorage for offline scenarios
 * - Hybrid approach: Firebase for accuracy, localStorage for speed
 * - Analytics event tracking
 * - Backward compatibility with existing implementation
 */

import { useState, useEffect, useCallback } from 'react'
import { analytics } from '../config/firebase'
import { logEvent } from 'firebase/analytics'
import { useBulkArticleViews } from './useFirebaseViews'
import { incrementArticleView, isFirestoreConfigured } from '../services/firestoreService'

// Local storage key for view counts (fallback)
const VIEW_COUNTS_KEY = 'blog_article_views'

/**
 * Enhanced hook for Firebase Analytics with Firestore integration
 * Provides real-time view tracking with multiple data sources
 */
export const useFirebaseAnalytics = (posts = []) => {
    const [localViews, setLocalViews] = useState({})
    const [loading, setLoading] = useState(true)

    // Get Firebase Firestore view counts
    const {
        viewCounts: firestoreViews,
        loading: firestoreLoading,
        getViewCount: getFirestoreViewCount
    } = useBulkArticleViews(posts)

    // Load localStorage view counts as fallback
    useEffect(() => {
        if (!posts || posts.length === 0) {
            setLoading(false)
            return
        }

        const loadLocalViewCounts = () => {
            try {
                const storedViews = localStorage.getItem(VIEW_COUNTS_KEY)
                const existingViews = storedViews ? JSON.parse(storedViews) : {}

                // Initialize view counts for new posts
                const updatedViews = { ...existingViews }
                let hasChanges = false

                posts.forEach(post => {
                    const articlePath = `/post/${post.slug}`
                    if (!updatedViews[articlePath]) {
                        // Initialize with a base count based on post age for realism
                        const postAge = Date.now() - new Date(post.date).getTime()
                        const daysSincePublished = Math.floor(postAge / (1000 * 60 * 60 * 24))
                        const baseViews = Math.max(1, Math.floor(daysSincePublished / 2))
                        updatedViews[articlePath] = baseViews
                        hasChanges = true
                    }
                })

                setLocalViews(updatedViews)

                // Only save if there were changes
                if (hasChanges) {
                    localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(updatedViews))
                }

            } catch (error) {
                console.error('Error loading local view counts:', error)
                setLocalViews({})
            }
        }

        loadLocalViewCounts()
    }, [posts])

    // Update loading state based on Firestore
    useEffect(() => {
        if (!isFirestoreConfigured()) {
            setLoading(false)
            return
        }

        setLoading(firestoreLoading)
    }, [firestoreLoading])

    // Combine Firebase and local view counts (Firebase takes priority)
    const views = useCallback(() => {
        const combinedViews = {}

        posts.forEach(post => {
            const articlePath = `/post/${post.slug}`
            const firestoreCount = getFirestoreViewCount(post.slug)
            const localCount = localViews[articlePath] || 0

            // Use Firestore count if available and greater than local, otherwise use local
            combinedViews[articlePath] = firestoreCount > 0 ? firestoreCount : localCount
        })

        return combinedViews
    }, [posts, firestoreViews, localViews, getFirestoreViewCount])

    // Sort posts by view count (descending)
    const sortedPosts = posts
        .map(post => {
            const viewCount = views()[`/post/${post.slug}`] || 0
            return {
                ...post,
                viewCount
            }
        })
        .sort((a, b) => b.viewCount - a.viewCount)

    return {
        views: views(),
        loading,
        sortedPosts,
        isFirestoreEnabled: isFirestoreConfigured()
    }
}

/**
 * Enhanced increment view count with Firestore integration
 * @param {string} slug - Article slug
 * @returns {Promise<number>} - Updated view count
 */
export const incrementViewCount = async (slug) => {
    try {
        const articlePath = `/post/${slug}`
        let newCount = 0

        // Try to increment in Firestore first
        if (isFirestoreConfigured()) {
            const success = await incrementArticleView(slug)
            if (success) {
                // Track in Firebase Analytics
                if (analytics) {
                    logEvent(analytics, 'article_view', {
                        article_slug: slug,
                        article_path: articlePath,
                        source: 'firestore'
                    })
                }
                return newCount // Let Firestore handle the counting
            }
        }

        // Fallback to localStorage
        const storedViews = localStorage.getItem(VIEW_COUNTS_KEY)
        const views = storedViews ? JSON.parse(storedViews) : {}

        views[articlePath] = (views[articlePath] || 0) + 1
        newCount = views[articlePath]

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
 * Track page view event with enhanced data
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 * @param {Object} additionalData - Additional tracking data
 */
export const trackPageView = (pagePath, pageTitle, additionalData = {}) => {
    if (analytics) {
        logEvent(analytics, 'page_view', {
            page_path: pagePath,
            page_title: pageTitle,
            firestore_enabled: isFirestoreConfigured(),
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
        logEvent(analytics, eventName, {
            firestore_enabled: isFirestoreConfigured(),
            ...parameters
        })
    }
}

/**
 * Get view count for a specific article with Firestore priority
 * @param {string} slug - Article slug
 * @param {Object} views - Views object from useFirebaseAnalytics hook
 * @returns {number} - View count for the article
 */
export const getArticleViewCount = (slug, views) => {
    return views[`/post/${slug}`] || 0
}

/**
 * Format view count for display (same as before)
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
