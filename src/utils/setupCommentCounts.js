/**
 * Firebase Comment Counter - Quick Setup Script
 * 
 * Run this once to initialize comment counts in Firebase
 * Usage: Run in browser console after importing your posts
 */

import { db } from '../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

/**
 * Initialize Firebase comment counts for all posts
 * @param {Array} posts - Array of post objects with slug property
 */
export const setupCommentCounts = async (posts) => {
    if (!posts || posts.length === 0) {
        console.error('❌ No posts provided')
        return
    }

    console.log(`🚀 Setting up comment counts for ${posts.length} posts...`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    let successCount = 0
    let errorCount = 0

    for (const post of posts) {
        if (!post.slug) {
            console.warn(`⚠️  Skipping post without slug: ${post.title}`)
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

            successCount++
            console.log(`✅ ${successCount}. Initialized: ${post.slug}`)
        } catch (error) {
            errorCount++
            console.error(`❌ Error initializing ${post.slug}:`, error.message)
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🎉 Setup complete!`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📊 Total: ${posts.length}`)
    console.log('')
    console.log('💡 Next steps:')
    console.log('   1. Deploy Firestore rules: firebase deploy --only firestore:rules')
    console.log('   2. Update components to use FirebaseCommentCount')
    console.log('   3. Run initial sync: window.syncCommentsToFirebase(posts)')
    console.log('')
}

/**
 * Verify Firebase setup
 */
export const verifySetup = async () => {
    console.log('🔍 Verifying Firebase setup...')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    try {
        // Check if Firebase is initialized
        if (!db) {
            console.error('❌ Firebase is not initialized')
            return false
        }
        console.log('✅ Firebase initialized')

        // Try to read from commentCounts collection
        const { collection, getDocs } = await import('firebase/firestore')
        const querySnapshot = await getDocs(collection(db, 'commentCounts'))

        console.log(`✅ Can read commentCounts collection (${querySnapshot.size} documents)`)

        if (querySnapshot.size > 0) {
            console.log('\n📊 Sample documents:')
            querySnapshot.docs.slice(0, 3).forEach((doc, index) => {
                const data = doc.data()
                console.log(`   ${index + 1}. ${doc.id}: ${data.count} comments`)
            })
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('✅ Setup verified successfully!')
        return true
    } catch (error) {
        console.error('❌ Setup verification failed:', error.message)
        console.log('\n💡 Troubleshooting:')
        console.log('   1. Check Firebase config in src/config/firebase.js')
        console.log('   2. Deploy Firestore rules: firebase deploy --only firestore:rules')
        console.log('   3. Check Firebase console for errors')
        return false
    }
}

/**
 * Expose to window for easy console access
 */
if (typeof window !== 'undefined') {
    window.setupCommentCounts = setupCommentCounts
    window.verifyCommentCountsSetup = verifySetup
}

export default setupCommentCounts
