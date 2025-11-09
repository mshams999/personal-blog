/**
 * Disqus to Firebase Sync Utility
 * 
 * Syncs comment counts from Disqus to Firebase Firestore.
 * Can be run manually, scheduled, or triggered by webhooks.
 */

import { db } from '../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { disqusConfig } from '../config/disqus'

/**
 * Fetch comment count for a single thread from Disqus API
 * Note: This uses the Disqus Public API which requires the count.js script
 * For server-side sync, you'd use the Disqus REST API with an API key
 * 
 * @param {string} identifier - Thread identifier (post slug)
 * @returns {Promise<number>} - Comment count
 */
export const fetchDisqusCount = async (identifier) => {
    return new Promise((resolve) => {
        // Check if Disqus widget is available
        if (!window.DISQUSWIDGETS) {
            resolve(0)
            return
        }

        // Find the element with the identifier
        const element = document.querySelector(`[data-disqus-identifier="${identifier}"]`)

        if (!element) {
            resolve(0)
            return
        }

        // Wait a bit for Disqus to populate the count
        setTimeout(() => {
            const text = element.textContent || element.innerText
            const match = text.match(/(\d+)/)
            const count = match ? parseInt(match[1], 10) : 0
            resolve(count)
        }, 1000)
    })
}

/**
 * Sync a single post's comment count to Firebase
 * @param {string} postSlug - Post slug/identifier
 * @param {number} count - Comment count
 * @returns {Promise<void>}
 */
export const syncCommentCountToFirebase = async (postSlug, count) => {
    try {
        const commentDocRef = doc(db, 'commentCounts', postSlug)

        await setDoc(commentDocRef, {
            count: count || 0,
            lastUpdated: serverTimestamp(),
            postSlug: postSlug
        }, { merge: true })
    } catch (error) {
        // Silent fail - error logged to error tracking service if configured
        throw error
    }
}

/**
 * Sync multiple posts' comment counts to Firebase
 * @param {Array} posts - Array of post objects with slug property
 * @returns {Promise<void>}
 */
export const syncAllCommentCounts = async (posts) => {
    if (!posts || posts.length === 0) {
        return
    }

    const promises = posts.map(async (post) => {
        try {
            const count = await fetchDisqusCount(post.slug)
            await syncCommentCountToFirebase(post.slug, count)
        } catch (error) {
            // Silent fail
        }
    })

    await Promise.all(promises)
}

/**
 * Initialize comment counts for new posts with 0
 * @param {string} postSlug - Post slug
 * @returns {Promise<void>}
 */
export const initializeCommentCount = async (postSlug) => {
    try {
        const commentDocRef = doc(db, 'commentCounts', postSlug)

        await setDoc(commentDocRef, {
            count: 0,
            lastUpdated: serverTimestamp(),
            postSlug: postSlug,
            initialized: true
        }, { merge: true })
    } catch (error) {
        // Silent fail
    }
}

/**
 * Manual sync function that can be called from browser console or admin interface
 * Usage: syncCommentsNow(posts)
 */
export const syncCommentsNow = async (posts) => {
    // Ensure Disqus script is loaded
    if (!document.getElementById('dsq-count-scr')) {
        const script = document.createElement('script')
        script.src = `https://${disqusConfig.shortname}.disqus.com/count.js`
        script.async = true
        script.id = 'dsq-count-scr'
        document.head.appendChild(script)

        // Wait for script to load
        await new Promise(resolve => {
            script.onload = resolve
            setTimeout(resolve, 3000) // Fallback timeout
        })
    }

    // Wait for DISQUSWIDGETS to be available
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Trigger Disqus count update
    if (window.DISQUSWIDGETS) {
        window.DISQUSWIDGETS.getCount({ reset: true })
        await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Sync to Firebase
    await syncAllCommentCounts(posts)
}

/**
 * Expose sync function to window for console access
 */
if (typeof window !== 'undefined') {
    window.syncCommentsToFirebase = syncCommentsNow
}
