import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, isGTMConfigured } from '../config/gtm'

/**
 * Custom hook for GTM page tracking
 * 
 * This hook automatically tracks page views when the route changes
 * and provides utilities for tracking custom events.
 * 
 * Usage:
 * ```jsx
 * import { useGTM } from '../hooks/useGTM'
 * 
 * function MyComponent() {
 *   const { trackEvent, trackBlogPost } = useGTM()
 *   
 *   const handleClick = () => {
 *     trackEvent('button_click', { button_name: 'subscribe' })
 *   }
 *   
 *   return <button onClick={handleClick}>Subscribe</button>
 * }
 * ```
 */
export const useGTM = () => {
    const location = useLocation()

    // Track page views automatically on route changes
    useEffect(() => {
        if (isGTMConfigured() && typeof window !== 'undefined') {
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
        isConfigured: isGTMConfigured(),
        // Re-export tracking functions for convenience
        trackPageView,
        trackEvent: (event_name, parameters) => {
            const { trackEvent } = require('../config/gtm')
            trackEvent(event_name, parameters)
        },
        trackBlogPost: (action, post) => {
            const { trackBlogPost } = require('../config/gtm')
            trackBlogPost(action, post)
        },
        trackNewsletter: (action, data) => {
            const { trackNewsletter } = require('../config/gtm')
            trackNewsletter(action, data)
        },
        trackCV: (action, data) => {
            const { trackCV } = require('../config/gtm')
            trackCV(action, data)
        },
        trackSearch: (query, results_count) => {
            const { trackSearch } = require('../config/gtm')
            trackSearch(query, results_count)
        }
    }
}
