import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../hooks/useFirebaseAnalytics'

/**
 * Analytics Provider component that automatically tracks page views
 * Add this component to your App.jsx or main router to track all page views
 */
const AnalyticsProvider = ({ children }) => {
    const location = useLocation()

    useEffect(() => {
        // Track page view whenever route changes
        trackPageView(location.pathname, document.title)
    }, [location])

    return children
}

export default AnalyticsProvider
