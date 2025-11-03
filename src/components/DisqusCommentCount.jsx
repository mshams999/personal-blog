import React, { useEffect, useState, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'

/**
 * Simple Disqus Comment Counter that avoids DOM manipulation issues
 * Uses the Disqus count API directly instead of the problematic CommentCount component
 */
const SimpleDisqusCounter = ({ post, currentUrl }) => {
    const [count, setCount] = useState('0')
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!isDisqusConfigured()) {
            setLoading(false)
            return
        }

        const identifier = post.slug
        const url = currentUrl || `${window.location.origin}/post/${post.slug}`

        // Create a unique container ID to avoid conflicts
        const containerId = `disqus-count-${identifier}-${Date.now()}`

        if (containerRef.current) {
            containerRef.current.innerHTML = `<a href="${url}#disqus_thread" data-disqus-identifier="${identifier}">0 Comments</a>`

            // Add the unique ID to the link
            const link = containerRef.current.querySelector('a')
            if (link) {
                link.id = containerId
                link.style.color = 'inherit'
                link.style.textDecoration = 'none'
                link.style.fontSize = 'inherit'
            }
        }

        // Load Disqus count script if not already loaded
        if (!window.DISQUSWIDGETS) {
            const script = document.createElement('script')
            script.src = `https://${disqusConfig.shortname}.disqus.com/count.js`
            script.async = true
            script.id = 'dsq-count-scr'

            script.onload = () => {
                setLoading(false)
                // Reset counts to trigger update
                if (window.DISQUSWIDGETS) {
                    window.DISQUSWIDGETS.getCount({ reset: true })
                }
            }

            script.onerror = () => {
                setLoading(false)
                setCount('0')
            }

            // Only add if not already present
            if (!document.getElementById('dsq-count-scr')) {
                document.head.appendChild(script)
            }
        } else {
            setLoading(false)
            // Trigger count update
            window.DISQUSWIDGETS.getCount({ reset: true })
        }

        return () => {
            // Clean up safely
            if (containerRef.current) {
                try {
                    containerRef.current.innerHTML = ''
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        }
    }, [post.slug, currentUrl])

    if (!isDisqusConfigured()) {
        return (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">0 Comments</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-3 h-3" />
            <div ref={containerRef} className="text-xs">
                {loading ? '...' : '0 Comments'}
            </div>
        </div>
    )
}

/**
 * DisqusCommentCount Component
 * 
 * Displays the comment count for a post using Disqus
 * Shows real Disqus counts if configured, otherwise shows consistent placeholder
 * Uses a safer approach to avoid DOM manipulation conflicts
 * 
 * @param {Object} post - The post object containing title, slug, etc.
 * @param {string} currentUrl - Current page URL for Disqus identification
 * @param {string} className - Additional CSS classes
 */
const DisqusCommentCount = ({ post, currentUrl, className = "" }) => {
    return (
        <div className={className}>
            <SimpleDisqusCounter post={post} currentUrl={currentUrl} />
        </div>
    )
}

export default DisqusCommentCount
