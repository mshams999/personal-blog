/**
 * Utility functions for handling article ratings
 * 
 * This now uses Firestore for persistent, shared ratings across all users.
 * Falls back to localStorage when offline or when Firestore is unavailable.
 */

import { getRating, saveRating as saveRatingToFirestore, isRatingsConfigured } from '../services/ratingService'

// Local storage key generator for fallback
export const getRatingsStorageKey = (postSlug) => `ratings_${postSlug}`
const getLocalUserRatingKey = (postSlug) => `user_rating_${postSlug}`

/**
 * Get average rating and total count for a post
 * Priority: Firestore > localStorage fallback
 * @param {string} postSlug - The post slug
 * @returns {Promise<Object>|Object} { averageRating, totalRatings } - Promise if using Firestore, Object if fallback
 */
export const getPostRating = async (postSlug) => {
    try {
        // Try Firestore first if configured
        if (isRatingsConfigured()) {
            const result = await getRating(postSlug)

            // If we got real data from Firestore, return it
            if (result.totalRatings > 0) {
                return {
                    averageRating: result.averageRating,
                    totalRatings: result.totalRatings
                }
            }

            // No ratings in Firestore yet, return zeros
            return {
                averageRating: 0,
                totalRatings: 0
            }
        }

        // Fallback to localStorage if Firestore not available
        return getLocalStorageRating(postSlug)
    } catch (error) {
        console.error('Error getting post rating from Firestore, using localStorage fallback:', error)
        return getLocalStorageRating(postSlug)
    }
}

/**
 * Synchronous version for backwards compatibility
 * Use this when you need immediate results (will use cached data)
 * @param {string} postSlug - The post slug
 * @returns {Object} { averageRating, totalRatings }
 */
export const getPostRatingSync = (postSlug) => {
    return getLocalStorageRating(postSlug)
}

/**
 * Get rating from localStorage (fallback method)
 * @param {string} postSlug - The post slug
 * @returns {Object} { averageRating, totalRatings }
 */
const getLocalStorageRating = (postSlug) => {
    try {
        const ratingsKey = getRatingsStorageKey(postSlug)
        const storedRatings = localStorage.getItem(ratingsKey)

        if (storedRatings) {
            const ratings = JSON.parse(storedRatings)
            const total = ratings.length
            const average = total > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / total : 0

            return {
                averageRating: average,
                totalRatings: total
            }
        } else {
            // No ratings yet
            return {
                averageRating: 0,
                totalRatings: 0
            }
        }
    } catch (error) {
        console.error('Error getting post rating from localStorage:', error)
        return {
            averageRating: 0,
            totalRatings: 0
        }
    }
}

/**
 * Save a user rating for a post
 * Priority: Firestore > localStorage fallback
 * @param {string} postSlug - The post slug
 * @param {number} rating - The rating value (1-5)
 * @returns {Promise<Object>} { averageRating, totalRatings, success }
 */
export const savePostRating = async (postSlug, rating) => {
    try {
        // Validate rating
        if (rating < 1 || rating > 5) {
            console.error('Invalid rating value:', rating)
            return { averageRating: 0, totalRatings: 0, success: false }
        }

        // Try Firestore first if configured
        if (isRatingsConfigured()) {
            const result = await saveRatingToFirestore(postSlug, rating)

            if (result.success) {
                // Also save to localStorage for offline/cache
                saveLocalStorageRating(postSlug, rating)

                return {
                    averageRating: result.averageRating,
                    totalRatings: result.totalRatings,
                    success: true
                }
            }
        }

        // Fallback to localStorage
        return saveLocalStorageRating(postSlug, rating)
    } catch (error) {
        console.error('Error saving post rating to Firestore, using localStorage fallback:', error)
        return saveLocalStorageRating(postSlug, rating)
    }
}

/**
 * Save rating to localStorage (fallback method)
 * @param {string} postSlug - The post slug
 * @param {number} rating - The rating value (1-5)
 * @returns {Object} { averageRating, totalRatings, success }
 */
const saveLocalStorageRating = (postSlug, rating) => {
    try {
        const ratingsKey = getRatingsStorageKey(postSlug)
        const userRatingKey = getLocalUserRatingKey(postSlug)
        const storedRatings = localStorage.getItem(ratingsKey)
        let ratings = storedRatings ? JSON.parse(storedRatings) : []

        // If user had a previous rating, replace it; otherwise add new rating
        const previousRating = localStorage.getItem(userRatingKey)
        if (previousRating) {
            const prevRating = parseFloat(previousRating)
            const index = ratings.indexOf(prevRating)
            if (index > -1) {
                ratings[index] = rating
            } else {
                ratings.push(rating)
            }
        } else {
            ratings.push(rating)
        }

        // Save updated ratings
        localStorage.setItem(ratingsKey, JSON.stringify(ratings))
        localStorage.setItem(userRatingKey, rating.toString())

        // Calculate new average
        const average = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0

        return {
            averageRating: average,
            totalRatings: ratings.length,
            success: true
        }
    } catch (error) {
        console.error('Error saving post rating to localStorage:', error)
        return { averageRating: 0, totalRatings: 0, success: false }
    }
}

/**
 * Get user's rating for a specific post
 * Priority: Firestore > localStorage fallback
 * @param {string} postSlug - The post slug
 * @returns {Promise<number>} User's rating (0 if not rated)
 */
export const getUserRating = async (postSlug) => {
    try {
        // Try Firestore first if configured
        if (isRatingsConfigured()) {
            const result = await getRating(postSlug)
            return result.userRating || 0
        }

        // Fallback to localStorage
        return getLocalUserRating(postSlug)
    } catch (error) {
        console.error('Error getting user rating from Firestore, using localStorage fallback:', error)
        return getLocalUserRating(postSlug)
    }
}

/**
 * Get user's rating from localStorage (synchronous fallback)
 * @param {string} postSlug - The post slug
 * @returns {number} User's rating (0 if not rated)
 */
const getLocalUserRating = (postSlug) => {
    try {
        const userRatingKey = getLocalUserRatingKey(postSlug)
        const userRating = localStorage.getItem(userRatingKey)
        return userRating ? parseFloat(userRating) : 0
    } catch (error) {
        console.error('Error getting user rating from localStorage:', error)
        return 0
    }
}

/**
 * Format rating for display
 * @param {number} rating - The rating value
 * @returns {string} Formatted rating string
 */
export const formatRating = (rating) => {
    return rating.toFixed(1)
}
