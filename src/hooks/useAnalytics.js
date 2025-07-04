import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
    trackPageView,
    isGAConfigured,
    trackEvent,
    trackBlogPost,
    trackNewsletter,
    trackCV,
    trackSearch,
    trackExternalLink,
    trackDownload
} from '../config/analytics'

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
        console.log('useAnalytics: Route changed to', location.pathname)
        console.log('useAnalytics: GA configured?', isGAConfigured())

        if (isGAConfigured() && typeof window !== 'undefined') {
            const page_title = document.title
            const page_location = window.location.href
            const page_path = location.pathname + location.search

            console.log('useAnalytics: Tracking page view', { page_title, page_location, page_path })

            // Small delay to ensure the page has loaded
            const timer = setTimeout(() => {
                trackPageView(page_title, page_location, page_path)
            }, 100)

            return () => clearTimeout(timer)
        } else {
            console.log('useAnalytics: GA not configured, skipping page view tracking')
        }
    }, [location])

    return {
        isConfigured: isGAConfigured(),
        // Re-export tracking functions for convenience
        trackPageView,
        trackEvent,
        trackBlogPost,
        trackNewsletter,
        trackCV,
        trackSearch,
        trackExternalLink,
        trackDownload
    }
}
