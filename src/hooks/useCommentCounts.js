import { useState, useEffect } from 'react'

/**
 * Hook to get comment counts for posts and sort them by most commented
 * This simulates getting comment counts - in a real implementation,
 * you would fetch actual Disqus comment counts via their API
 */
export const useCommentCounts = (posts) => {
    const [commentCounts, setCommentCounts] = useState({})
    const [loading, setLoading] = useState(true)
    const [sortedByComments, setSortedByComments] = useState([])

    useEffect(() => {
        if (!posts || posts.length === 0) {
            setLoading(false)
            return
        }

        // Simulate fetching comment counts
        const fetchCommentCounts = () => {
            const counts = {}

            // Generate realistic comment counts based on post characteristics
            posts.forEach(post => {
                // Create deterministic but varied comment counts based on post attributes
                const postAge = Date.now() - new Date(post.date).getTime()
                const daysSincePublished = Math.floor(postAge / (1000 * 60 * 60 * 24))

                // Newer posts tend to have fewer comments, older posts more
                const ageBonus = Math.min(daysSincePublished / 30, 3) // Max 3 point bonus

                // Posts with certain characteristics get more comments
                const titleLength = post.title.length
                const titleBonus = titleLength > 50 ? 2 : titleLength > 30 ? 1 : 0

                // Category bonus (some categories are more engaging)
                const categoryBonus = post.categoryId === 'lifestyle' ? 2 :
                    post.categoryId === 'travel' ? 1.5 :
                        post.categoryId === 'technology' ? 1 : 0.5

                // Read time bonus (optimal reading time gets more engagement)
                const readTimeBonus = post.readTime >= 3 && post.readTime <= 7 ? 1.5 :
                    post.readTime <= 2 ? 0.5 : 0

                // Calculate base comment count using post slug for consistency
                const slugHash = post.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                const baseComments = slugHash % 8 // 0-7 base comments

                // Apply all bonuses
                const totalComments = Math.floor(
                    baseComments + ageBonus + titleBonus + categoryBonus + readTimeBonus
                )

                counts[post.slug] = Math.max(0, totalComments) // Ensure non-negative
            })

            setCommentCounts(counts)
        }

        fetchCommentCounts()
        setLoading(false)
    }, [posts])

    useEffect(() => {
        if (Object.keys(commentCounts).length > 0) {
            // Sort posts by comment count (descending)
            const sorted = [...posts].sort((a, b) => {
                const aComments = commentCounts[a.slug] || 0
                const bComments = commentCounts[b.slug] || 0
                return bComments - aComments
            })

            setSortedByComments(sorted)
        }
    }, [posts, commentCounts])

    const getCommentCount = (postSlug) => {
        return commentCounts[postSlug] || 0
    }

    return {
        commentCounts,
        sortedByComments,
        loading,
        getCommentCount
    }
}
