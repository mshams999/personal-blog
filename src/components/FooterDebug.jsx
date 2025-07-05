import React from 'react'
import { useData } from '../contexts/DataContext'
import { useFirebaseAnalytics, getArticleViewCount, formatViewCount } from '../hooks/useFirebaseAnalytics'

/**
 * Debug component to test Footer Firebase Analytics integration
 */
const FooterDebug = () => {
    const { posts } = useData()
    const { views, sortedPosts, loading } = useFirebaseAnalytics(posts)

    console.log('FooterDebug - Posts:', posts?.length || 0)
    console.log('FooterDebug - Views:', views)
    console.log('FooterDebug - Sorted Posts:', sortedPosts?.length || 0)
    console.log('FooterDebug - Loading:', loading)

    if (!posts || posts.length === 0) {
        return (
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
                <h3 className="font-bold">Debug: No posts available</h3>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-100 border border-gray-400 rounded mb-4">
            <h3 className="font-bold mb-2">Footer Debug - Firebase Analytics</h3>

            <div className="mb-4">
                <h4 className="font-semibold">Raw Views Object:</h4>
                <pre className="text-xs overflow-auto bg-gray-200 p-2 rounded">
                    {JSON.stringify(views, null, 2)}
                </pre>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold">Top 3 Posts by Views (sortedPosts):</h4>
                {sortedPosts?.slice(0, 3).map((post, index) => (
                    <div key={post.slug} className="text-sm border-b pb-1 mb-1">
                        <strong>#{index + 1}</strong> {post.title}
                        <br />
                        <span className="text-gray-600">
                            Slug: {post.slug} |
                            View Count (post.viewCount): {post.viewCount} |
                            View Count (Firebase): {formatViewCount(getArticleViewCount(post.slug, views))}
                        </span>
                    </div>
                ))}
            </div>

            <div>
                <h4 className="font-semibold">Individual View Counts:</h4>
                {posts.slice(0, 5).map(post => (
                    <div key={post.slug} className="text-xs">
                        {post.title}: {formatViewCount(getArticleViewCount(post.slug, views))} views
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FooterDebug
