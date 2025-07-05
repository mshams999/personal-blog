/**
 * Firestore Service for Article View Tracking
 * 
 * This service handles all Firestore operations for tracking article views,
 * including incrementing view counts and fetching current view statistics.
 * 
 * Based on the firebase_view_tracker.json specification:
 * - Collection: "articles"
 * - Document ID: article slug
 * - Fields: { views: number }
 */

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection name for articles
const ARTICLES_COLLECTION = 'articles';

/**
 * Increment the view count for an article by 1
 * @param {string} articleSlug - The unique slug identifier for the article
 * @returns {Promise<boolean>} - Success status
 */
export const incrementArticleView = async (articleSlug) => {
    if (!articleSlug || !db) {
        console.warn('Article slug or Firebase not configured');
        return false;
    }

    try {
        const articleRef = doc(db, ARTICLES_COLLECTION, articleSlug);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
            // Document exists, increment the view count
            await updateDoc(articleRef, {
                views: increment(1),
                lastViewed: new Date().toISOString(),
                slug: articleSlug // Ensure slug is always present
            });
        } else {
            // Document doesn't exist, create it with initial view count
            await setDoc(articleRef, {
                views: 1,
                firstViewed: new Date().toISOString(),
                lastViewed: new Date().toISOString(),
                slug: articleSlug
            });
        }

        return true;
    } catch (error) {
        console.error('Error incrementing article view:', error);
        return false;
    }
};

/**
 * Get the current view count for an article
 * @param {string} articleSlug - The unique slug identifier for the article
 * @returns {Promise<number>} - The current view count (0 if not found)
 */
export const getViewCount = async (articleSlug) => {
    if (!articleSlug || !db) {
        return 0;
    }

    try {
        const articleRef = doc(db, ARTICLES_COLLECTION, articleSlug);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
            const data = articleSnap.data();
            return data.views || 0;
        }

        return 0;
    } catch (error) {
        console.error('Error getting view count:', error);
        return 0;
    }
};

/**
 * Get view counts for multiple articles at once
 * @param {string[]} articleSlugs - Array of article slugs
 * @returns {Promise<Object>} - Object with slug as key and view count as value
 */
export const getBulkViewCounts = async (articleSlugs) => {
    if (!articleSlugs || !Array.isArray(articleSlugs) || !db) {
        return {};
    }

    try {
        const viewCounts = {};

        // Fetch all documents in parallel
        const promises = articleSlugs.map(async (slug) => {
            const count = await getViewCount(slug);
            return { slug, count };
        });

        const results = await Promise.all(promises);

        // Convert to object
        results.forEach(({ slug, count }) => {
            viewCounts[slug] = count;
        });

        return viewCounts;
    } catch (error) {
        console.error('Error getting bulk view counts:', error);
        return {};
    }
};

/**
 * Get the most viewed articles
 * @param {number} limitCount - Number of top articles to return (default: 10)
 * @returns {Promise<Array>} - Array of articles sorted by view count
 */
export const getTopArticlesByViews = async (limitCount = 10) => {
    if (!db) {
        return [];
    }

    try {
        const articlesRef = collection(db, ARTICLES_COLLECTION);
        const q = query(
            articlesRef,
            orderBy('views', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const topArticles = [];

        querySnapshot.forEach((doc) => {
            topArticles.push({
                slug: doc.id,
                ...doc.data()
            });
        });

        return topArticles;
    } catch (error) {
        console.error('Error getting top articles:', error);
        return [];
    }
};

/**
 * Get total views across all articles
 * @returns {Promise<number>} - Total view count across all articles
 */
export const getTotalViews = async () => {
    if (!db) {
        return 0;
    }

    try {
        const articlesRef = collection(db, ARTICLES_COLLECTION);
        const querySnapshot = await getDocs(articlesRef);

        let totalViews = 0;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalViews += data.views || 0;
        });

        return totalViews;
    } catch (error) {
        console.error('Error getting total views:', error);
        return 0;
    }
};

/**
 * Check if Firebase/Firestore is properly configured
 * @returns {boolean} - Configuration status
 */
export const isFirestoreConfigured = () => {
    return !!(db &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID &&
        import.meta.env.VITE_FIREBASE_API_KEY);
};
