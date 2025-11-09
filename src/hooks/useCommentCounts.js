/**
 * Firebase Comment Counter Hook
 */

import { useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

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
                    setError(err)
                    setCount(0)
                    setLoading(false)
                }
            )

            return () => unsubscribe()
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }, [postSlug])

    return { count, loading, error }
}

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
            setError(err.message)
            setLoading(false)
        }

        return () => {
            unsubscribers.forEach((unsubscribe) => unsubscribe())
        }
    }, [posts.map(p => p.slug).join(',')])

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
