/**
 * ViewCounter Component
 * 
 * A reusable component for displaying article view counts with optional
 * Firebase integration and fallback to static counts.
 */

import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { useArticleViews, useFormatViewCount } from '../hooks/useFirebaseViews';

/**
 * ViewCounter - Displays view count with icon
 * @param {Object} props
 * @param {string} props.articleSlug - Article slug for Firebase tracking
 * @param {number} props.fallbackCount - Fallback count if Firebase not available
 * @param {boolean} props.shouldIncrement - Whether to increment on mount (default: false for lists)
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {string} props.variant - Style variant: 'default', 'badge', 'minimal'
 * @param {string} props.className - Additional CSS classes
 */
const ViewCounter = ({
    articleSlug,
    fallbackCount = 0,
    shouldIncrement = false,
    size = 'sm',
    variant = 'default',
    className = ''
}) => {
    const { viewCount, loading, error } = useArticleViews(articleSlug, shouldIncrement);

    // Use Firebase count if available, otherwise fallback
    const displayCount = !loading && !error && viewCount > 0 ? viewCount : fallbackCount;
    const formattedCount = useFormatViewCount(displayCount);

    // Size classes
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    // Icon size classes
    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    // Variant styles
    const getVariantClasses = () => {
        switch (variant) {
            case 'badge':
                return 'inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
            case 'minimal':
                return 'inline-flex items-center text-gray-500 dark:text-gray-400';
            default:
                return 'inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400';
        }
    };

    if (loading && shouldIncrement) {
        return (
            <div className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}>
                <Eye className={`${iconSizes[size]} animate-pulse`} />
                <span className="animate-pulse">...</span>
            </div>
        );
    }

    return (
        <div className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}>
            <Eye className={iconSizes[size]} />
            <span>{formattedCount}</span>
            {error && (
                <span className="text-red-500 ml-1" title={`Error: ${error}`}>
                    !
                </span>
            )}
        </div>
    );
};

/**
 * TrendingViewBadge - Shows trending indicator for high-traffic articles
 */
export const TrendingViewBadge = ({ viewCount, threshold = 100, className = '' }) => {
    if (viewCount < threshold) return null;

    const formattedCount = useFormatViewCount(viewCount);

    return (
        <div className={`inline-flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium ${className}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{formattedCount}</span>
        </div>
    );
};

/**
 * ViewStats - Comprehensive view statistics component
 */
export const ViewStats = ({ articles, className = '' }) => {
    if (!articles || articles.length === 0) return null;

    const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
    const avgViews = Math.round(totalViews / articles.length);
    const formattedTotal = useFormatViewCount(totalViews);
    const formattedAvg = useFormatViewCount(avgViews);

    return (
        <div className={`grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formattedTotal}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Views
                </div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formattedAvg}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Avg per Article
                </div>
            </div>
        </div>
    );
};

export default ViewCounter;
