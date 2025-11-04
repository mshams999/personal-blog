import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useCommentCount } from '../hooks/useCommentCounts'

/**
 * Firebase Comment Counter Component
 * 
 * Displays comment count from Firebase with real-time updates.
 * No polling or hot reloading - uses Firebase real-time listeners.
 * 
 * @param {Object} post - Post object with slug property
 * @param {boolean} showIcon - Whether to show the comment icon (default: true)
 * @param {boolean} compact - Show just the number (default: false)
 * @param {string} className - Additional CSS classes
 */
const FirebaseCommentCount = ({ post, showIcon = true, compact = false, className = "" }) => {
    const { count, loading } = useCommentCount(post?.slug)

    if (!post) return null

    const displayText = compact
        ? count.toString()
        : `${count} Comment${count !== 1 ? 's' : ''}`

    return (
        <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 ${className}`}>
            {showIcon && <MessageCircle className="w-3 h-3" />}
            <span className="text-xs">
                {loading ? '...' : displayText}
            </span>
        </div>
    )
}

export default FirebaseCommentCount
