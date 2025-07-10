/**
 * Social Sharing Test Utility
 * 
 * This utility helps test and debug social sharing functionality
 * by providing tools to validate meta tags and sharing URLs.
 */

/**
 * Test social media sharing URLs and meta tags
 * @param {string} postUrl - The URL of the post to test
 * @param {Object} postData - Post data including title, excerpt, image
 */
export const testSocialSharing = (postUrl, postData) => {
    const { title, excerpt, featuredImage } = postData
    
    console.group('🔗 Social Sharing Test Results')
    
    // Test URLs for different platforms
    const sharingUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`${title}\n\n${excerpt}`)}&hashtags=blog,article&via=MohamedShams936`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${excerpt}\n\n${postUrl}`)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`${title}\n\n${excerpt}`)}`
    }
    
    console.log('📱 Platform Sharing URLs:')
    Object.entries(sharingUrls).forEach(([platform, url]) => {
        console.log(`${platform}:`, url)
    })
    
    // Test meta tags
    console.log('\n🏷️ Current Meta Tags:')
    const metaTags = [
        'og:title',
        'og:description', 
        'og:image',
        'og:url',
        'twitter:title',
        'twitter:description',
        'twitter:image',
        'twitter:card'
    ]
    
    metaTags.forEach(tag => {
        const element = document.querySelector(`meta[property="${tag}"], meta[name="${tag}"]`)
        if (element) {
            console.log(`✅ ${tag}:`, element.getAttribute('content'))
        } else {
            console.log(`❌ ${tag}:`, 'Missing')
        }
    })
    
    // Image URL validation
    console.log('\n🖼️ Image URL Analysis:')
    console.log('Original image:', featuredImage)
    
    const absoluteImageUrl = featuredImage?.startsWith('http') 
        ? featuredImage 
        : `${window.location.origin}${featuredImage}`
    console.log('Absolute image URL:', absoluteImageUrl)
    
    // Test image accessibility
    if (absoluteImageUrl) {
        const img = new Image()
        img.onload = () => console.log('✅ Image loads successfully')
        img.onerror = () => console.log('❌ Image failed to load')
        img.src = absoluteImageUrl
    }
    
    console.groupEnd()
    
    return {
        urls: sharingUrls,
        metaTags: getCurrentMetaTags(),
        imageUrl: absoluteImageUrl
    }
}

/**
 * Get current meta tags from the document
 */
export const getCurrentMetaTags = () => {
    const metaTags = {}
    const tags = document.querySelectorAll('meta[property^="og:"], meta[property^="twitter:"], meta[name^="twitter:"]')
    
    tags.forEach(tag => {
        const property = tag.getAttribute('property') || tag.getAttribute('name')
        const content = tag.getAttribute('content')
        metaTags[property] = content
    })
    
    return metaTags
}

/**
 * Validate social sharing setup for a post
 */
export const validateSocialSharing = (postData) => {
    const issues = []
    const { title, excerpt, featuredImage, slug } = postData
    
    if (!title) issues.push('Missing post title')
    if (!excerpt) issues.push('Missing post excerpt')
    if (!featuredImage) issues.push('Missing featured image')
    if (!slug) issues.push('Missing post slug')
    
    // Check image URL format
    if (featuredImage && !featuredImage.startsWith('http') && !featuredImage.startsWith('/')) {
        issues.push('Featured image should be absolute URL or start with /')
    }
    
    // Check meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')
    
    if (!ogTitle) issues.push('Missing og:title meta tag')
    if (!ogDescription) issues.push('Missing og:description meta tag')
    if (!ogImage) issues.push('Missing og:image meta tag')
    
    return {
        isValid: issues.length === 0,
        issues,
        recommendations: [
            'Ensure all meta tags are set before the page loads',
            'Use absolute URLs for images',
            'Test sharing URLs in Facebook Debugger and Twitter Card Validator',
            'Consider server-side rendering for better crawler support'
        ]
    }
}

/**
 * Open social sharing debuggers in new tabs
 */
export const openSharingDebuggers = (url) => {
    const debuggers = [
        {
            name: 'Facebook Sharing Debugger',
            url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`
        },
        {
            name: 'Twitter Card Validator',
            url: `https://cards-dev.twitter.com/validator`
        },
        {
            name: 'LinkedIn Post Inspector',
            url: `https://www.linkedin.com/post-inspector/`
        }
    ]
    
    console.log('🛠️ Opening social sharing debuggers...')
    debuggers.forEach(debugger => {
        window.open(debugger.url, '_blank')
        console.log(`Opened: ${debugger.name}`)
    })
}

export default {
    testSocialSharing,
    getCurrentMetaTags,
    validateSocialSharing,
    openSharingDebuggers
}
