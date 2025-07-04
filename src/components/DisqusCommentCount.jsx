import React from 'react'
import { CommentCount } from 'disqus-react'
import { MessageCircle } from 'lucide-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'

/**
 * DisqusCommentCount Component
 * 
 * Displays the comment count for a post using Disqus
 * Shows fallback if Disqus is not configured
 * 
 * @param {Object} post - The post object containing title, slug, etc.
 * @param {string} currentUrl - Current page URL for Disqus identification
 * @param {string} className - Additional CSS classes
 */
const DisqusCommentCount = ({ post, currentUrl, className = "" }) => {
    // If Disqus is not configured, show placeholder
    if (!isDisqusConfigured()) {
        return (
            <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 ${className}`}>
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Comments</span>
            </div>
        )
    }

    // Generate Disqus configuration for this post
    const disqusProps = {
        shortname: disqusConfig.shortname,
        config: getDisqusConfig(post, currentUrl)
    }

    return (
        <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${className}`}>
            <MessageCircle className="w-4 h-4" />
            <CommentCount {...disqusProps} className="text-sm" />
        </div>
    )
}

export default DisqusCommentCount
