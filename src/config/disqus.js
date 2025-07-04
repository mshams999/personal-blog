/**
 * Disqus Configuration
 * 
 * To set up Disqus for your blog:
 * 1. Create a Disqus account at https://disqus.com/
 * 2. Register a new site and get your shortname
 * 3. Replace 'your-disqus-shortname' below with your actual shortname
 * 4. Update the siteUrl to match your production domain
 */

export const disqusConfig = {
    // Replace with your Disqus shortname
    shortname: 'mohamedshams-1',

    // Your site's URL (for production)
    siteUrl: 'https://your-website.com',

    // Development URL (for testing)
    devUrl: 'http://localhost:5173'
}

/**
 * Generate Disqus configuration for a specific post
 * @param {Object} post - The post object
 * @param {string} currentUrl - Current page URL
 * @returns {Object} Disqus configuration object
 */
export const getDisqusConfig = (post, currentUrl) => {
    return {
        url: currentUrl,
        identifier: post.slug,
        title: post.title,
        language: 'en'
    }
}

/**
 * Check if Disqus is properly configured
 * @returns {boolean} True if shortname is set
 */
export const isDisqusConfigured = () => {
    return disqusConfig.shortname !== 'your-disqus-shortname'
}
