/**
 * Google Analytics Configuration
 * 
 * Simple Google Analytics 4 (GA4) integration for tracking page views
 * and custom events without the complexity of Google Tag Manager.
 * 
 * Setup Instructions:
 * 1. Create a Google Analytics account at https://analytics.google.com/
 * 2. Create a new GA4 property for your website
 * 3. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 4. Add VITE_GA_MEASUREMENT_ID to your .env file
 */

/**
 * Google Analytics Configuration
 */
export const gaConfig = {
    // GA4 Measurement ID from environment variables
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || null,

    // Enable debug mode in development
    debug: import.meta.env.DEV,

    // Default tracking settings
    config: {
        send_page_view: true,
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: false
    }
}

/**
 * Check if Google Analytics is properly configured
 */
export const isGAConfigured = () => {
    return gaConfig.measurementId &&
        gaConfig.measurementId !== 'G-XXXXXXXXXX' &&
        typeof window !== 'undefined' &&
        typeof window.gtag === 'function'
}

/**
 * Track page views
 * @param {string} page_title - The page title
 * @param {string} page_location - The page URL
 * @param {string} page_path - The page path
 */
export const trackPageView = (page_title, page_location, page_path) => {
    if (!isGAConfigured()) {
        if (gaConfig.debug) {
            console.log('GA: Page view would be tracked:', { page_title, page_location, page_path })
        }
        return
    }

    window.gtag('config', gaConfig.measurementId, {
        page_title,
        page_location,
        page_path,
        ...gaConfig.config
    })

    if (gaConfig.debug) {
        console.log('GA: Page view tracked:', { page_title, page_location, page_path })
    }
}

/**
 * Track custom events
 * @param {string} action - The event action
 * @param {Object} parameters - Additional event parameters
 */
export const trackEvent = (action, parameters = {}) => {
    if (!isGAConfigured()) {
        if (gaConfig.debug) {
            console.log('GA: Event would be tracked:', { action, parameters })
        }
        return
    }

    window.gtag('event', action, {
        ...parameters,
        timestamp: new Date().toISOString()
    })

    if (gaConfig.debug) {
        console.log('GA: Event tracked:', { action, parameters })
    }
}

/**
 * Track blog post interactions
 * @param {string} action - The action (view, click, share, etc.)
 * @param {Object} post - The post object
 */
export const trackBlogPost = (action, post) => {
    trackEvent('blog_post_interaction', {
        event_category: 'blog',
        event_label: post.title,
        post_id: post.id,
        post_category: post.categoryId,
        post_author: post.authorId,
        value: post.readTime || 0
    })
}

/**
 * Track newsletter interactions
 * @param {string} action - The action (subscribe, error, etc.)
 * @param {Object} data - Additional data
 */
export const trackNewsletter = (action, data = {}) => {
    trackEvent('newsletter_' + action, {
        event_category: 'newsletter',
        event_label: action,
        ...data
    })
}

/**
 * Track CV page interactions
 * @param {string} action - The action (view, download, etc.)
 * @param {Object} data - Additional data
 */
export const trackCV = (action, data = {}) => {
    trackEvent('cv_' + action, {
        event_category: 'cv',
        event_label: action,
        ...data
    })
}

/**
 * Track search interactions
 * @param {string} query - The search query
 * @param {number} results_count - Number of results
 */
export const trackSearch = (query, results_count = 0) => {
    trackEvent('search', {
        event_category: 'search',
        event_label: query,
        search_term: query,
        results_count,
        value: results_count
    })
}

/**
 * Track external link clicks
 * @param {string} url - The external URL
 * @param {string} text - The link text
 */
export const trackExternalLink = (url, text = '') => {
    trackEvent('click', {
        event_category: 'external_link',
        event_label: url,
        link_url: url,
        link_text: text
    })
}

/**
 * Track file downloads
 * @param {string} filename - The downloaded file name
 * @param {string} url - The file URL
 */
export const trackDownload = (filename, url) => {
    trackEvent('file_download', {
        event_category: 'download',
        event_label: filename,
        file_name: filename,
        file_url: url
    })
}
