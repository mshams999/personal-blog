import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, isGAConfigured } from '../config/analytics'

/**
 * Custom hook for Google Analytics tracking
 * 
 * This hook automatically tracks page views when the route changes
 * and provides utilities for tracking custom events.
 * 
 * Usage:
 * ```jsx
 * import { useAnalytics } from '../hooks/useAnalytics'
 * 
 * function MyComponent() {
 *   const { trackEvent, trackBlogPost } = useAnalytics()
 *   
 *   const handleClick = () => {
 *     trackEvent('button_click', { button_name: 'subscribe' })
 *   }
 *   
 *   return <button onClick={handleClick}>Subscribe</button>
 * }
 * ```
 */
export const useAnalytics = () => {
    const location = useLocation()

    // Track page views automatically on route changes
    useEffect(() => {
        if (isGAConfigured() && typeof window !== 'undefined') {
            const page_title = document.title
            const page_location = window.location.href
            const page_path = location.pathname + location.search

            // Small delay to ensure the page has loaded
            const timer = setTimeout(() => {
                trackPageView(page_title, page_location, page_path)
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [location])

    return {
        isConfigured: isGAConfigured(),
        // Re-export tracking functions for convenience
        trackPageView,
        trackEvent: (action, parameters) => {
            const { trackEvent } = require('../config/analytics')
            trackEvent(action, parameters)
        },
        trackBlogPost: (action, post) => {
            const { trackBlogPost } = require('../config/analytics')
            trackBlogPost(action, post)
        },
        trackNewsletter: (action, data) => {
            const { trackNewsletter } = require('../config/analytics')
            trackNewsletter(action, data)
        },
        trackCV: (action, data) => {
            const { trackCV } = require('../config/analytics')
            trackCV(action, data)
        },
        trackSearch: (query, results_count) => {
            const { trackSearch } = require('../config/analytics')
            trackSearch(query, results_count)
        },
        trackExternalLink: (url, text) => {
            const { trackExternalLink } = require('../config/analytics')
            trackExternalLink(url, text)
        },
        trackDownload: (filename, url) => {
            const { trackDownload } = require('../config/analytics')
            trackDownload(filename, url)
        }
    }
}
