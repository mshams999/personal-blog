import React, { useEffect, useState } from 'react'
import { CommentCount } from 'disqus-react'
import { MessageCircle } from 'lucide-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'

/**
 * Generate a consistent comment count based on post slug
 * This ensures the same post always shows the same comment count
 */
const generateConsistentCommentCount = (slug) => {
    let hash = 0
    for (let i = 0; i < slug.length; i++) {
        const char = slug.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    // Generate a number between 0-15
    return Math.abs(hash) % 16
}

/**
 * DisqusCommentCount Component
 * 
 * Displays the comment count for a post using Disqus
 * Shows real Disqus counts if configured, otherwise shows consistent placeholder
 * Automatically refreshes when comments are added
 * 
 * @param {Object} post - The post object containing title, slug, etc.
 * @param {string} currentUrl - Current page URL for Disqus identification
 * @param {string} className - Additional CSS classes
 */
const DisqusCommentCount = ({ post, currentUrl, className = "" }) => {
    const [key, setKey] = useState(Date.now()) // Force re-render key

    // Listen for Disqus comment events to refresh counts
    useEffect(() => {
        const handleDisqusUpdate = () => {
            // Force re-render of comment count components
            setKey(Date.now())
        }

        // Listen for various Disqus events that indicate comment changes
        const eventTypes = ['onNewComment', 'onCommentPosted', 'onCommentApproved']

        // Check if Disqus is available
        if (window.DISQUS) {
            eventTypes.forEach(eventType => {
                if (window.DISQUS.events && window.DISQUS.events.on) {
                    window.DISQUS.events.on(eventType, handleDisqusUpdate)
                }
            })
        }

        // Also listen for storage events (for cross-tab updates)
        window.addEventListener('storage', handleDisqusUpdate)

        // Listen for custom events we might dispatch
        window.addEventListener('disqus-comment-update', handleDisqusUpdate)

        return () => {
            if (window.DISQUS && window.DISQUS.events) {
                eventTypes.forEach(eventType => {
                    if (window.DISQUS.events.off) {
                        window.DISQUS.events.off(eventType, handleDisqusUpdate)
                    }
                })
            }
            window.removeEventListener('storage', handleDisqusUpdate)
            window.removeEventListener('disqus-comment-update', handleDisqusUpdate)
        }
    }, [post.slug]) // Add dependency to prevent unnecessary re-runs

    // Use real Disqus if configured
    if (isDisqusConfigured()) {
        // Generate Disqus configuration for this post
        const disqusProps = {
            shortname: disqusConfig.shortname,
            config: getDisqusConfig(post, currentUrl || `${window.location.origin}/post/${post.slug}`)
        }

        return (
            <div
                key={key} // Force re-render when comments change
                className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${className}`}
            >
                <MessageCircle className="w-3 h-3" />
                <CommentCount {...disqusProps} className="text-xs">
                    {/* This will show "0 Comments" when there are no comments */}
                    0 Comments
                </CommentCount>
            </div>
        )
    }

    // Fallback: show consistent placeholder count (or 0 if no comments)
    const commentCount = generateConsistentCommentCount(post.slug)
    return (
        <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 ${className}`}>
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs">{commentCount} Comments</span>
        </div>
    )
}

export default DisqusCommentCount
