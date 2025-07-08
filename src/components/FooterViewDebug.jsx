import React from 'react';
import { useBulkArticleViews, formatViewCount } from '../hooks/useFirebaseViews';
import { useHybridData } from '../contexts/HybridDataContext';

/**
 * Debug component to check view counts in Footer
 */
const FooterViewDebug = () => {
    const { posts, getRecentPosts } = useHybridData();

    // Use the same recent posts as Footer now does
    const recentPosts = React.useMemo(() => {
        try {
            return getRecentPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (err) {
            console.error('Error getting recent posts in Footer:', err);
            return posts || [];
        }
    }, [getRecentPosts, posts]);

    const { viewCounts, getViewCount, loading } = useBulkArticleViews(recentPosts);

    // Create sorted posts like Footer does
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
                right: '10px',
                background: '#fff',
                border: '2px solid #f00',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '300px'
            }}>
                <strong>🐛 Footer Debug: NO POSTS</strong>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#fff',
            border: '2px solid #00f',
            padding: '10px',
            fontSize: '11px',
            zIndex: 9999,
            maxWidth: '350px',
            maxHeight: '400px',
            overflow: 'auto'
        }}        >
            <strong>🐛 Footer Popular Debug</strong>
            <div>Recent Posts count: {recentPosts.length}</div>
            <div>Loading: {loading ? 'YES' : 'NO'}</div>
            <div>ViewCounts keys: {Object.keys(viewCounts).length}</div>

            <hr />
            <strong>Top 3 Popular (Footer logic):</strong>
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

export default FooterViewDebug;
