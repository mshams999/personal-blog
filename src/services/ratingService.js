/**
 * Firestore Service for Article Rating System
 * 
 * This service handles all Firestore operations for article ratings,
 * including saving user ratings and calculating aggregated ratings.
 * 
 * Collection Structure:
 * - Collection: "ratings"
 * - Document ID: article slug
 * - Fields: {
 *     ratings: { userId: rating },
 *     totalRatings: number,
 *     averageRating: number,
 *     lastUpdated: timestamp
 *   }
 */

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection name for ratings
const RATINGS_COLLECTION = 'ratings';

/**
 * Generate a unique user ID (stored in localStorage)
 * This allows tracking user ratings without authentication
 */
const getUserId = () => {
    const USER_ID_KEY = 'blog_user_id';
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        // Generate a unique ID
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
};

/**
 * Save or update a user's rating for an article
 * @param {string} articleSlug - The unique slug identifier for the article
 * @param {number} rating - The rating value (1-5)
 * @returns {Promise<Object>} - { success, averageRating, totalRatings }
 */
export const saveRating = async (articleSlug, rating) => {
    if (!articleSlug || !db) {
        console.warn('Article slug or Firebase not configured');
        return { success: false, averageRating: 0, totalRatings: 0 };
    }

    if (rating < 1 || rating > 5) {
        console.error('Invalid rating value. Must be between 1 and 5');
        return { success: false, averageRating: 0, totalRatings: 0 };
    }

    try {
        const userId = getUserId();
        const ratingRef = doc(db, RATINGS_COLLECTION, articleSlug);
        const ratingSnap = await getDoc(ratingRef);

        if (ratingSnap.exists()) {
            // Document exists, update the rating
            const data = ratingSnap.data();
            const ratings = data.ratings || {};

            // Update or add user's rating
            ratings[userId] = rating;

            // Recalculate average
            const ratingsArray = Object.values(ratings);
            const totalRatings = ratingsArray.length;
            const sum = ratingsArray.reduce((acc, val) => acc + val, 0);
            const averageRating = sum / totalRatings;

            await updateDoc(ratingRef, {
                ratings: ratings,
                totalRatings: totalRatings,
                averageRating: averageRating,
                lastUpdated: serverTimestamp(),
                slug: articleSlug
            });

            console.log(`✅ Updated rating for ${articleSlug}: ${averageRating.toFixed(2)} (${totalRatings} ratings)`);

            return {
                success: true,
                averageRating: averageRating,
                totalRatings: totalRatings
            };
        } else {
            // Document doesn't exist, create it
            const ratings = { [userId]: rating };

            await setDoc(ratingRef, {
                ratings: ratings,
                totalRatings: 1,
                averageRating: rating,
                lastUpdated: serverTimestamp(),
                slug: articleSlug,
                firstRatedAt: serverTimestamp()
            });

            console.log(`✅ Created new rating for ${articleSlug}: ${rating} (1 rating)`);

            return {
                success: true,
                averageRating: rating,
                totalRatings: 1
            };
        }
    } catch (error) {
        console.error('Error saving rating:', error);
        return { success: false, averageRating: 0, totalRatings: 0 };
    }
};

/**
 * Get the rating data for an article
 * @param {string} articleSlug - The unique slug identifier for the article
 * @returns {Promise<Object>} - { averageRating, totalRatings, userRating }
 */
export const getRating = async (articleSlug) => {
    if (!articleSlug || !db) {
        console.warn('Article slug or Firebase not configured');
        return { averageRating: 0, totalRatings: 0, userRating: 0 };
    }

    try {
        const userId = getUserId();
        const ratingRef = doc(db, RATINGS_COLLECTION, articleSlug);
        const ratingSnap = await getDoc(ratingRef);

        if (ratingSnap.exists()) {
            const data = ratingSnap.data();
            const ratings = data.ratings || {};
            const userRating = ratings[userId] || 0;

            return {
                averageRating: data.averageRating || 0,
                totalRatings: data.totalRatings || 0,
                userRating: userRating
            };
        } else {
            // No ratings yet for this article
            return {
                averageRating: 0,
                totalRatings: 0,
                userRating: 0
            };
        }
    } catch (error) {
        console.error('Error getting rating:', error);
        return { averageRating: 0, totalRatings: 0, userRating: 0 };
    }
};

/**
 * Get ratings for multiple articles (bulk fetch for performance)
 * @param {Array<string>} articleSlugs - Array of article slugs
 * @returns {Promise<Object>} - Object with slug as key and rating data as value
 */
export const getBulkRatings = async (articleSlugs) => {
    if (!articleSlugs || articleSlugs.length === 0 || !db) {
        return {};
    }

    try {
        const userId = getUserId();
        const ratingsData = {};

        // Fetch all ratings in parallel
        const promises = articleSlugs.map(async (slug) => {
            const ratingRef = doc(db, RATINGS_COLLECTION, slug);
            const ratingSnap = await getDoc(ratingRef);

            if (ratingSnap.exists()) {
                const data = ratingSnap.data();
                const ratings = data.ratings || {};
                const userRating = ratings[userId] || 0;

                ratingsData[slug] = {
                    averageRating: data.averageRating || 0,
                    totalRatings: data.totalRatings || 0,
                    userRating: userRating
                };
            } else {
                ratingsData[slug] = {
                    averageRating: 0,
                    totalRatings: 0,
                    userRating: 0
                };
            }
        });

        await Promise.all(promises);
        return ratingsData;
    } catch (error) {
        console.error('Error getting bulk ratings:', error);
        return {};
    }
};

/**
 * Get top-rated articles
 * @param {number} limitCount - Number of articles to return
 * @returns {Promise<Array>} - Array of top-rated articles
 */
export const getTopRatedArticles = async (limitCount = 10) => {
    if (!db) {
        return [];
    }

    try {
        const ratingsRef = collection(db, RATINGS_COLLECTION);
        const q = query(
            ratingsRef,
            orderBy('averageRating', 'desc'),
            orderBy('totalRatings', 'desc'),
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
        console.error('Error getting top rated articles:', error);
        return [];
    }
};

/**
 * Check if Firebase/Firestore is properly configured
 * @returns {boolean} - Configuration status
 */
export const isRatingsConfigured = () => {
    return !!(db && typeof db === 'object');
};

/**
 * Get the current user's ID
 * @returns {string} - User ID
 */
export const getCurrentUserId = () => {
    return getUserId();
};

export default {
    saveRating,
    getRating,
    getBulkRatings,
    getTopRatedArticles,
    isRatingsConfigured,
    getCurrentUserId
};
