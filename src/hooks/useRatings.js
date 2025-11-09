import { useState, useEffect } from 'react'
import { getRating, getBulkRatings, isRatingsConfigured } from '../services/ratingService'

/**
 * Hook to fetch rating for a single post
 * @param {string} postSlug - The post slug (can include refresh key)
 * @returns {Object} { averageRating, totalRatings, userRating, loading }
 */
export const usePostRating = (postSlug) => {
    const [averageRating, setAverageRating] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRating = async () => {
            if (!postSlug) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Extract actual slug (remove refresh key if present)
                const actualSlug = postSlug.split('_')[0]

                if (isRatingsConfigured()) {
                    const result = await getRating(actualSlug)
                    setAverageRating(result.averageRating || 0)
                    setTotalRatings(result.totalRatings || 0)
                    setUserRating(result.userRating || 0)
                } else {
                    // No Firebase, show zeros
                    setAverageRating(0)
                    setTotalRatings(0)
                    setUserRating(0)
                }
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchRating()
    }, [postSlug])

    return { averageRating, totalRatings, userRating, loading }
}

/**
 * Hook to fetch ratings for multiple posts at once
 * More efficient than calling usePostRating multiple times
 * @param {Array<string>} postSlugs - Array of post slugs
 * @returns {Object} { ratings, loading }
 */
export const useBulkPostRatings = (postSlugs) => {
    const [ratings, setRatings] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRatings = async () => {
            if (!postSlugs || postSlugs.length === 0) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                if (isRatingsConfigured()) {
                    const result = await getBulkRatings(postSlugs)
                    setRatings(result)
                } else {
                    // No Firebase, return empty ratings
                    const emptyRatings = {}
                    postSlugs.forEach(slug => {
                        emptyRatings[slug] = {
                            averageRating: 0,
                            totalRatings: 0,
                            userRating: 0
                        }
                    })
                    setRatings(emptyRatings)
                }
            } catch (error) {
                // Return empty ratings on error
                const emptyRatings = {}
                postSlugs.forEach(slug => {
                    emptyRatings[slug] = {
                        averageRating: 0,
                        totalRatings: 0,
                        userRating: 0
                    }
                })
                setRatings(emptyRatings)
            } finally {
                setLoading(false)
            }
        }

        fetchRatings()
    }, [JSON.stringify(postSlugs)]) // Use JSON.stringify to properly compare array contents

    return { ratings, loading }
}

/**
 * Get rating for a specific post from bulk ratings result
 * @param {Object} ratings - Ratings object from useBulkPostRatings
 * @param {string} postSlug - Post slug
 * @returns {Object} { averageRating, totalRatings, userRating }
 */
export const getRatingFromBulk = (ratings, postSlug) => {
    if (!ratings || !postSlug || !ratings[postSlug]) {
        return {
            averageRating: 0,
            totalRatings: 0,
            userRating: 0
        }
    }
    return ratings[postSlug]
}
