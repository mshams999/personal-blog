#!/usr/bin/env node

/**
 * Initialize Comment Counts in Firestore
 * 
 * This script initializes comment count documents in Firestore for all your posts.
 * Run this once before deploying the sync function.
 * 
 * Usage:
 *   node scripts/init-comment-counts.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your post slugs - update this with your actual post slugs
const POST_SLUGS = [
    'about-sky-stars-orbits',
    // Add all your post slugs here
    // You can get them from your TinaCMS content or posts directory
];

async function initializeCommentCounts() {
    console.log('🚀 Initializing comment counts...');
    console.log('═══════════════════════════════════════\n');

    let successCount = 0;
    let errorCount = 0;

    for (const slug of POST_SLUGS) {
        try {
            await db.collection('commentCounts').doc(slug).set({
                count: 0,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                postSlug: slug,
                initialized: true
            }, { merge: true });

            successCount++;
            console.log(`✅ ${successCount}. Initialized: ${slug}`);
        } catch (error) {
            errorCount++;
            console.error(`❌ Error initializing ${slug}:`, error.message);
        }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`🎉 Initialization complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total: ${POST_SLUGS.length}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Deploy the sync function: firebase deploy --only functions');
    console.log('   2. Wait for first sync (5 minutes) or trigger manual sync');
    console.log('   3. Verify in Firebase Console > Firestore > commentCounts');
    console.log('');

    process.exit(0);
}

// Run initialization
initializeCommentCounts().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
