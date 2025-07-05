/**
 * React Hook for Firebase Article View Tracking
 * 
 * This hook provides a clean React interface for tracking and displaying
 * article view counts using Firebase Firestore.
 * 
 * Features:
 * - Automatic view increment on article page load
 * - Real-time view count fetching
 * - Bulk view counts for multiple articles
 * - Loading and error states
 * - Debouncing to prevent rapid increments
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    incrementArticleView,
    getViewCount,
    getBulkViewCounts,
    isFirestoreConfigured
} from '../services/firestoreService';

/**
 * Hook for tracking and displaying individual article views
 * @param {string} articleSlug - The article slug to track
 * @param {boolean} shouldIncrement - Whether to increment view on mount (default: true)
 * @returns {Object} - View count, loading state, and functions
 */
export const useArticleViews = (articleSlug, shouldIncrement = true) => {
    const [viewCount, setViewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasIncrementedRef = useRef(false);

    // Increment view count (called once per article visit)
    const incrementView = useCallback(async () => {
        if (!articleSlug || hasIncrementedRef.current || !isFirestoreConfigured()) {
            return false;
        }

        try {
            hasIncrementedRef.current = true;
            const success = await incrementArticleView(articleSlug);

            if (success) {
                // Optimistically update the local count
                setViewCount(prev => prev + 1);
            }

            return success;
        } catch (err) {
            console.error('Error incrementing view:', err);
            setError(err.message);
            hasIncrementedRef.current = false; // Allow retry
            return false;
        }
    }, [articleSlug]);

    // Fetch current view count
    const fetchViewCount = useCallback(async () => {
        if (!articleSlug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const count = await getViewCount(articleSlug);
            setViewCount(count);
        } catch (err) {
            console.error('Error fetching view count:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [articleSlug]);

    // Effect to handle view tracking on mount
    useEffect(() => {
        if (!articleSlug) {
            setLoading(false);
            return;
        }

        const trackView = async () => {
            // First, fetch the current count
            await fetchViewCount();

            // Then increment if requested (e.g., on article page load)
            if (shouldIncrement && isFirestoreConfigured()) {
                // Add a small delay to ensure the count is fetched first
                setTimeout(() => {
                    incrementView();
                }, 100);
            }
        };

        trackView();
    }, [articleSlug, shouldIncrement, fetchViewCount, incrementView]);

    return {
        viewCount,
        loading,
        error,
        incrementView,
        refreshCount: fetchViewCount
    };
};

/**
 * Hook for fetching view counts for multiple articles
 * @param {Array} articles - Array of article objects with slug property
 * @returns {Object} - View counts mapped by slug, loading state, and functions
 */
export const useBulkArticleViews = (articles) => {
    const [viewCounts, setViewCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBulkViews = useCallback(async () => {
        if (!articles || !Array.isArray(articles) || articles.length === 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const slugs = articles.map(article => article.slug).filter(Boolean);
            const counts = await getBulkViewCounts(slugs);

            setViewCounts(counts);
        } catch (err) {
            console.error('Error fetching bulk view counts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [articles]);

    useEffect(() => {
        if (isFirestoreConfigured()) {
            fetchBulkViews();
        } else {
            setLoading(false);
        }
    }, [fetchBulkViews]);

    return {
        viewCounts,
        loading,
        error,
        refreshCounts: fetchBulkViews,
        getViewCount: (slug) => viewCounts[slug] || 0
    };
};

/**
 * Hook for formatting view counts in a user-friendly way
 * @param {number} count - The view count number
 * @returns {string} - Formatted view count string
 */
export const useFormatViewCount = (count) => {
    return useCallback(() => {
        if (!count || count === 0) return '0 views';
        if (count === 1) return '1 view';
        if (count < 1000) return `${count} views`;
        if (count < 1000000) return `${(count / 1000).toFixed(1)}k views`;
        return `${(count / 1000000).toFixed(1)}m views`;
    }, [count])();
};
