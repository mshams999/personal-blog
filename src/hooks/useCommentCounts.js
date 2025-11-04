/**
 * Firebase Comment Counter Hook
 * 
 * Uses Firestore to store and retrieve comment counts with real-time updates.
 * No polling - uses Firebase's real-time listeners for instant updates.
 */

import { useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

/**
 * Hook to get comment count for a single post from Firebase
 * @param {string} postSlug - The post slug
 * @returns {Object} - { count, loading, error }
 */
export const useCommentCount = (postSlug) => {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!postSlug) {
            setLoading(false)
            return
        }

        try {
            const commentDocRef = doc(db, 'commentCounts', postSlug)

            // Set up real-time listener
            const unsubscribe = onSnapshot(
                commentDocRef,
                (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        setCount(data.count || 0)
                    } else {
                        setCount(0)
                    }
                    setLoading(false)
                },
                (err) => {
                    console.error('Error fetching comment count:', err)
                    setError(err.message)
                    setCount(0)
                    setLoading(false)
                }
            )

            return () => unsubscribe()
        } catch (err) {
            console.error('Error setting up comment count listener:', err)
            setError(err.message)
            setLoading(false)
        }
    }, [postSlug])

    return { count, loading, error }
}

/**
 * Hook to get comment counts for multiple posts with real-time updates
 * @param {Array} posts - Array of post objects with slug property
 * @returns {Object} - { commentCounts, loading, error, sortedByComments, getCommentCount }
 */
export const useCommentCounts = (posts = []) => {
    const [commentCounts, setCommentCounts] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortedByComments, setSortedByComments] = useState([])

    useEffect(() => {
        if (!posts || posts.length === 0) {
            setLoading(false)
            return
        }

        const unsubscribers = []

        try {
            // Set up real-time listener for each post
            posts.forEach((post) => {
                if (!post.slug) return

                const commentDocRef = doc(db, 'commentCounts', post.slug)

                const unsubscribe = onSnapshot(
                    commentDocRef,
                    (docSnap) => {
                        setCommentCounts((prev) => ({
                            ...prev,
                            [post.slug]: docSnap.exists() ? (docSnap.data().count || 0) : 0
                        }))
                    },
                    (err) => {
                        console.error(`Error fetching count for ${post.slug}:`, err)
                        setCommentCounts((prev) => ({
                            ...prev,
                            [post.slug]: 0
                        }))
                    }
                )

                unsubscribers.push(unsubscribe)
            })

            setLoading(false)
        } catch (err) {
            console.error('Error setting up bulk comment count listeners:', err)
            setError(err.message)
            setLoading(false)
        }

        // Cleanup all listeners
        return () => {
            unsubscribers.forEach((unsubscribe) => unsubscribe())
        }
    }, [posts.map(p => p.slug).join(',')])

    // Sort posts by comment count
    useEffect(() => {
        if (Object.keys(commentCounts).length > 0 && posts.length > 0) {
            const sorted = [...posts].sort((a, b) => {
                const aComments = commentCounts[a.slug] || 0
                const bComments = commentCounts[b.slug] || 0
                return bComments - aComments
            })
            setSortedByComments(sorted)
        }
    }, [posts, commentCounts])

    // Get comment count for a specific post
    const getCommentCount = (slug) => {
        return commentCounts[slug] || 0
    }

    return {
        commentCounts,
        loading,
        error,
        sortedByComments,
        getCommentCount
    }
}
