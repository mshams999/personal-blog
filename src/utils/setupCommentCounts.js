/**
 * Firebase Comment Counter - Quick Setup Script
 */

import { db } from '../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export const setupCommentCounts = async (posts) => {
    if (!posts || posts.length === 0) {
        return
    }

    for (const post of posts) {
        if (!post.slug) {
            continue
        }

        try {
            const commentDocRef = doc(db, 'commentCounts', post.slug)
            await setDoc(commentDocRef, {
                count: 0,
                lastUpdated: serverTimestamp(),
                postSlug: post.slug,
                postTitle: post.title || '',
                initialized: true
            }, { merge: true })
        } catch (error) {
            // Silent fail
        }

        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

export const verifySetup = async () => {
    try {
        if (!db) {
            return false
        }
        const { collection, getDocs } = await import('firebase/firestore')
        await getDocs(collection(db, 'commentCounts'))
        return true
    } catch (error) {
        return false
    }
}

if (typeof window !== 'undefined') {
    window.setupCommentCounts = setupCommentCounts
    window.verifyCommentCountsSetup = verifySetup
}

export default setupCommentCounts
