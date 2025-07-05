/**
 * Utility functions for handling article ratings
 */

// Local storage key generator
export const getRatingsStorageKey = (postSlug) => `ratings_${postSlug}`

/**
 * Get average rating and total count for a post
 * @param {string} postSlug - The post slug
 * @returns {Object} { averageRating, totalRatings }
 */
export const getPostRating = (postSlug) => {
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
            // Initialize with some sample ratings for demo based on post characteristics
            const baseRating = 3.5 + (postSlug.charCodeAt(0) % 3) * 0.5 // 3.5 to 5.0
            const ratingCount = 3 + (postSlug.length % 8) // 3 to 10 ratings
            const sampleRatings = Array.from({ length: ratingCount }, (_, i) => {
                // Generate ratings around the base rating with some variance
                const variance = (Math.random() - 0.5) * 1.0 // ±0.5 variance
                return Math.max(1, Math.min(5, baseRating + variance))
            })

            // Store the sample ratings
            localStorage.setItem(ratingsKey, JSON.stringify(sampleRatings))

            const average = sampleRatings.reduce((sum, rating) => sum + rating, 0) / sampleRatings.length
            return {
                averageRating: average,
                totalRatings: sampleRatings.length
            }
        }
    } catch (error) {
        console.error('Error getting post rating:', error)
        // Fallback rating
        return {
            averageRating: 4.0 + (postSlug.charCodeAt(0) % 10) * 0.1,
            totalRatings: 5
        }
    }
}

/**
 * Save a user rating for a post
 * @param {string} postSlug - The post slug
 * @param {number} rating - The rating value (1-5)
 * @returns {Object} { averageRating, totalRatings }
 */
export const savePostRating = (postSlug, rating) => {
    try {
        const ratingsKey = getRatingsStorageKey(postSlug)
        const userRatingKey = `user_rating_${postSlug}`
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
        const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length

        return {
            averageRating: average,
            totalRatings: ratings.length
        }
    } catch (error) {
        console.error('Error saving post rating:', error)
        return getPostRating(postSlug) // Fallback to current ratings
    }
}

/**
 * Get user's rating for a specific post
 * @param {string} postSlug - The post slug
 * @returns {number} User's rating (0 if not rated)
 */
export const getUserRating = (postSlug) => {
    try {
        const userRatingKey = `user_rating_${postSlug}`
        const userRating = localStorage.getItem(userRatingKey)
        return userRating ? parseFloat(userRating) : 0
    } catch (error) {
        console.error('Error getting user rating:', error)
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
