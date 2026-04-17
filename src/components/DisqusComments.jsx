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

    if (!isDisqusConfigured()) {
        return (
            <section className="mt-16 pt-8 border-t border-rule">
                <p className="kicker mb-2">تعليقات</p>
                <p className="font-serif text-ink-muted">
                    نظام التعليقات غير مُعد حالياً.
                </p>
            </section>
        )
    }

    const disqusProps = {
        shortname: disqusConfig.shortname,
        config: getDisqusConfig(post, currentUrl)
    }

    return (
        <section className="mt-16 pt-8 border-t border-rule" aria-label="التعليقات">
            <div className="mb-6">
                <p className="kicker mb-2">حوار</p>
                <h3 className="font-display text-display-lg text-ink leading-tight">التعليقات</h3>
            </div>
            <DiscussionEmbed {...disqusProps} />
        </section>
    )
}

export default DisqusComments
