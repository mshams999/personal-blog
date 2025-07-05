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

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    const hasInitializedRef = useRef(false);

    // Stable memoized slug to prevent unnecessary re-runs
    const stableSlug = useRef(articleSlug);

    // Update stable slug only when it actually changes
    useEffect(() => {
        if (stableSlug.current !== articleSlug) {
            stableSlug.current = articleSlug;
            hasIncrementedRef.current = false;
            hasInitializedRef.current = false;
        }
    }, [articleSlug]);

    // Effect to handle view tracking on mount - with stable dependencies
    useEffect(() => {
        if (!articleSlug || hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;

        const trackView = async () => {
            try {
                setLoading(true);
                setError(null);

                // First, fetch the current count
                const count = await getViewCount(articleSlug);
                setViewCount(count);

                // Then increment if requested and not already done
                if (shouldIncrement && isFirestoreConfigured() && !hasIncrementedRef.current) {
                    hasIncrementedRef.current = true;

                    // Small delay to ensure count is fetched first
                    setTimeout(async () => {
                        try {
                            const success = await incrementArticleView(articleSlug);
                            if (success) {
                                // Update local count optimistically
                                setViewCount(prev => prev + 1);
                            }
                        } catch (err) {
                            console.error('Error incrementing view:', err);
                            setError(err.message);
                            hasIncrementedRef.current = false; // Allow retry
                        }
                    }, 100);
                }
            } catch (err) {
                console.error('Error fetching view count:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (articleSlug) {
            trackView();
        } else {
            setLoading(false);
        }

    }, [articleSlug, shouldIncrement]); // Only depend on the actual parameters

    // Manual increment function
    const incrementView = useCallback(async () => {
        if (!articleSlug || !isFirestoreConfigured()) {
            return false;
        }

        try {
            const success = await incrementArticleView(articleSlug);
            if (success) {
                setViewCount(prev => prev + 1);
            }
            return success;
        } catch (err) {
            console.error('Error incrementing view:', err);
            setError(err.message);
            return false;
        }
    }, [articleSlug]);

    // Manual refresh function
    const refreshCount = useCallback(async () => {
        if (!articleSlug) {
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

    return {
        viewCount,
        loading,
        error,
        incrementView,
        refreshCount
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
    const processedSlugsRef = useRef('');

    // Create stable article slug list to prevent infinite re-renders
    const articleSlugs = useMemo(() => {
        if (!articles || !Array.isArray(articles)) return '';

        // Use a more stable approach for memoization
        const slugs = articles
            .map(article => article?.slug)
            .filter(Boolean)
            .sort()
            .join(',');

        return slugs;
    }, [
        articles?.length,
        articles?.map(a => a?.slug).join(',') || ''
    ]);

    useEffect(() => {
        // Only fetch if articles changed and Firestore is configured
        if (!articleSlugs || processedSlugsRef.current === articleSlugs) {
            if (!articleSlugs) setLoading(false);
            return;
        }

        const fetchBulkViews = async () => {
            try {
                setLoading(true);
                setError(null);

                const slugs = articleSlugs.split(',').filter(Boolean);

                if (slugs.length === 0) {
                    setViewCounts({});
                    setLoading(false);
                    processedSlugsRef.current = articleSlugs;
                    return;
                }

                const counts = await getBulkViewCounts(slugs);

                setViewCounts(counts);
                processedSlugsRef.current = articleSlugs;
            } catch (err) {
                console.error('Error fetching bulk view counts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isFirestoreConfigured()) {
            fetchBulkViews();
        } else {
            setLoading(false);
            processedSlugsRef.current = articleSlugs;
        }
    }, [articleSlugs]);

    const refreshCounts = useCallback(async () => {
        if (!articleSlugs) return;

        try {
            setLoading(true);
            setError(null);

            const slugs = articleSlugs.split(',').filter(Boolean);
            const counts = await getBulkViewCounts(slugs);

            setViewCounts(counts);
            processedSlugsRef.current = articleSlugs;
        } catch (err) {
            console.error('Error refreshing bulk view counts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [articleSlugs]);

    return {
        viewCounts,
        loading,
        error,
        refreshCounts,
        getViewCount: useCallback((slug) => viewCounts[slug] || 0, [viewCounts])
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
