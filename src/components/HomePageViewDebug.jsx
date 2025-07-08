import React from 'react';
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews';
import { useHybridData } from '../contexts/HybridDataContext';

/**
 * Debug component to check view counts in HomePage
 */
const HomePageViewDebug = () => {
    const { getRecentPosts } = useHybridData();

    // Get recent posts like HomePage does
    const recentPosts = React.useMemo(() => {
        try {
            return getRecentPosts(20) || [];
        } catch (error) {
            console.error('Error fetching recent posts:', error);
            return [];
        }
    }, [getRecentPosts]);

    const { viewCounts, getViewCount, loading } = useBulkArticleViews(recentPosts);

    // Create sorted posts like HomePage does
    const sortedPosts = React.useMemo(() => {
        if (!recentPosts || recentPosts.length === 0) return [];

        return recentPosts
            .map(post => ({
                ...post,
                viewCount: getViewCount(post.slug)
            }))
            .sort((a, b) => b.viewCount - a.viewCount);
    }, [recentPosts, viewCounts, getViewCount]);

    if (!recentPosts || recentPosts.length === 0) {
        return (
            <div style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                background: '#fff',
                border: '2px solid #f00',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '300px'
            }}>
                <strong>🐛 HomePage Debug: NO POSTS</strong>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            background: '#fff',
            border: '2px solid #0a0',
            padding: '10px',
            fontSize: '11px',
            zIndex: 9999,
            maxWidth: '350px',
            maxHeight: '400px',
            overflow: 'auto'
        }}>
            <strong>🐛 HomePage Popular Debug</strong>
            <div>RecentPosts count: {recentPosts.length}</div>
            <div>Loading: {loading ? 'YES' : 'NO'}</div>
            <div>ViewCounts keys: {Object.keys(viewCounts).length}</div>

            <hr />
            <strong>Top 3 Popular (HomePage logic):</strong>
            {sortedPosts.slice(0, 3).map((post, index) => (
                <div key={post.slug} style={{
                    borderBottom: '1px solid #eee',
                    padding: '4px 0',
                    fontSize: '10px'
                }}>
                    <strong>#{index + 1}</strong> {post.title.substring(0, 30)}...
                    <br />
                    <span style={{ color: '#666' }}>
                        Slug: {post.slug}
                        <br />
                        Views: {formatViewCount(getViewCount(post.slug))}
                        <br />
                        Raw count: {getViewCount(post.slug)}
                    </span>
                </div>
            ))}

            <hr />
            <strong>Raw viewCounts object:</strong>
            <pre style={{ fontSize: '9px', overflow: 'auto', maxHeight: '100px' }}>
                {JSON.stringify(viewCounts, null, 1)}
            </pre>
        </div>
    );
};

export default HomePageViewDebug;
