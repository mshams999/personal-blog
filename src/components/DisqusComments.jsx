import React, { useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'

/**
 * DisqusComments Component
 * 
 * Renders Disqus comments for a blog post with proper configuration
 * Shows setup guide if Disqus is not configured
 * Listens for comment events to update counts elsewhere in the app
 * 
 * @param {Object} post - The post object containing title, slug, etc.
 * @param {string} currentUrl - Current page URL for Disqus identification
 */
const DisqusComments = ({ post, currentUrl }) => {
    // Set up event listeners for Disqus comment events
    useEffect(() => {
        const handleCommentEvent = () => {
            // Dispatch custom event to notify other components about comment changes
            window.dispatchEvent(new CustomEvent('disqus-comment-update', {
                detail: { postSlug: post.slug }
            }))

            // Also trigger storage event for cross-tab updates
            window.dispatchEvent(new Event('storage'))
        }

        // Wait for Disqus to be available
        const checkDisqus = () => {
            if (window.DISQUS && window.DISQUS.events) {
                // Listen for various comment events
                const eventTypes = ['onNewComment', 'onCommentPosted', 'onCommentApproved']
                eventTypes.forEach(eventType => {
                    if (window.DISQUS.events.on) {
                        window.DISQUS.events.on(eventType, handleCommentEvent)
                    }
                })
                return true
            }
            return false
        }

        // Try to attach listeners immediately
        if (!checkDisqus()) {
            // If Disqus isn't ready, check periodically
            const interval = setInterval(() => {
                if (checkDisqus()) {
                    clearInterval(interval)
                }
            }, 1000)

            // Clean up interval after 30 seconds
            setTimeout(() => clearInterval(interval), 30000)
        }

        return () => {
            // Clean up event listeners
            if (window.DISQUS && window.DISQUS.events && window.DISQUS.events.off) {
                const eventTypes = ['onNewComment', 'onCommentPosted', 'onCommentApproved']
                eventTypes.forEach(eventType => {
                    window.DISQUS.events.off(eventType, handleCommentEvent)
                })
            }
        }
    }, [post.slug])

    // Check if Disqus is properly configured
    if (!isDisqusConfigured()) {
        return (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        💬 التعليقات غير مفعلة
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        نظام التعليقات Disqus غير مُعد حالياً. يرجى إضافة إعدادات Disqus في ملف .env
                    </p>
                </div>
            </div>
        )
    }

    // Generate Disqus configuration for this post
    const disqusProps = {
        shortname: disqusConfig.shortname,
        config: getDisqusConfig(post, currentUrl)
    }

    return (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    التعليقات
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    انضم إلى المحادثة وشارك أفكارك!
                </p>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <DiscussionEmbed {...disqusProps} />
            </div>
        </div>
    )
}

export default DisqusComments
