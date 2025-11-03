import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { disqusConfig } from '../config/disqus'

/**
 * Hook to fetch real Disqus comment counts and sort posts by most commented
 * Uses the Disqus API to get actual comment counts for posts
 */
export const useDisqusCommentCounts = (posts) => {
    const [commentCounts, setCommentCounts] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const initializedRef = useRef(false)
    const processedSlugsRef = useRef('')

    // Memoize posts to prevent unnecessary re-renders
    const postsArray = useMemo(() => {
        return Array.isArray(posts) ? posts : []
    }, [posts])

    // Memoize the post slugs to detect real changes
    const postSlugs = useMemo(() => {
        return postsArray.map(post => post.slug).sort().join(',')
    }, [postsArray])

    useEffect(() => {
        // Only run if posts have changed and not already processed
        if (!postsArray.length || processedSlugsRef.current === postSlugs) {
            return
        }

        let isMounted = true
        setLoading(true)
        setError(null)

        const fetchCommentCounts = async () => {
            try {
                // Check if Disqus count script already exists
                let existingScript = document.getElementById('dsq-count-scr')

                if (!existingScript) {
                    const script = document.createElement('script')
                    script.src = `https://${disqusConfig.shortname}.disqus.com/count.js`
                    script.async = true
                    script.id = 'dsq-count-scr'
                    document.head.appendChild(script)
                }

                // Wait for script to potentially load and process
                await new Promise(resolve => setTimeout(resolve, 3000))

                if (!isMounted) return

                const counts = {}

                // Get real Disqus counts from the DOM elements
                postsArray.forEach(post => {
                    const element = document.querySelector(`[data-disqus-identifier="${post.slug}"]`)
                    if (element && element.textContent) {
                        const countText = element.textContent.trim()
                        const match = countText.match(/(\d+)/)
                        if (match) {
                            // Use actual Disqus count (including 0)
                            counts[post.slug] = parseInt(match[1])
                        } else {
                            // If no number found, set to 0
                            counts[post.slug] = 0
                        }
                    } else {
                        // If element doesn't exist yet, set to 0
                        counts[post.slug] = 0
                    }
                })

                if (isMounted) {
                    setCommentCounts(counts)
                    setLoading(false)
                    processedSlugsRef.current = postSlugs
                    initializedRef.current = true
                }

            } catch (err) {
                console.error('Error fetching Disqus comment counts:', err)
                if (isMounted) {
                    setError(err.message)
                    // Set all counts to 0 on error instead of using fake fallback
                    const zeroCounts = {}
                    postsArray.forEach(post => {
                        zeroCounts[post.slug] = 0
                    })
                    setCommentCounts(zeroCounts)
                    setLoading(false)
                    processedSlugsRef.current = postSlugs
                    initializedRef.current = true
                }
            }
        }

        fetchCommentCounts()

        return () => {
            isMounted = false
        }
    }, [postSlugs])

    // Memoize sorted posts to prevent unnecessary recalculations
    const sortedByComments = useMemo(() => {
        if (!postsArray.length || !Object.keys(commentCounts).length) {
            return postsArray
        }

        return [...postsArray].sort((a, b) => {
            const aComments = commentCounts[a.slug] || 0
            const bComments = commentCounts[b.slug] || 0
            return bComments - aComments
        })
    }, [postsArray, commentCounts])

    const getCommentCount = useCallback((postSlug) => {
        return commentCounts[postSlug] || 0
    }, [commentCounts])

    const refreshCounts = useCallback(() => {
        if (window.DISQUSWIDGETS) {
            window.DISQUSWIDGETS.getCount({ reset: true })
        }
        processedSlugsRef.current = '' // Reset to allow re-processing
        initializedRef.current = false
    }, [])

    return {
        commentCounts,
        sortedByComments,
        loading,
        error,
        getCommentCount,
        refreshCounts
    }
}
