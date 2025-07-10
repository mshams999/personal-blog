import { useEffect } from 'react'

/**
 * MetaTags component for dynamic social sharing meta tags
 */
const MetaTags = ({ 
    title, 
    description, 
    image, 
    url, 
    type = 'article',
    siteName = 'Mohamed Shams Blog',
    author = '',
    publishedTime = ''
}) => {
    useEffect(() => {
        // Ensure image URL is absolute for social sharing
        const getAbsoluteImageUrl = (imageUrl) => {
            if (!imageUrl) return null
            if (imageUrl.startsWith('http')) return imageUrl
            if (imageUrl.startsWith('/')) {
                return `${window.location.origin}${imageUrl}`
            }
            return `${window.location.origin}/${imageUrl}`
        }

        const absoluteImageUrl = getAbsoluteImageUrl(image)

        // Function to update or create meta tags
        const updateMetaTag = (property, content, isProperty = true) => {
            if (!content) return
            
            const attribute = isProperty ? 'property' : 'name'
            let element = document.querySelector(`meta[${attribute}="${property}"]`)
            
            if (element) {
                element.setAttribute('content', content)
            } else {
                element = document.createElement('meta')
                element.setAttribute(attribute, property)
                element.setAttribute('content', content)
                document.head.appendChild(element)
            }
        }

        // Update document title
        if (title) {
            document.title = `${title} | ${siteName}`
        }

        // Basic meta tags
        updateMetaTag('description', description, false)
        
        // Open Graph meta tags
        updateMetaTag('og:title', title)
        updateMetaTag('og:description', description)
        updateMetaTag('og:image', absoluteImageUrl)
        updateMetaTag('og:url', url)
        updateMetaTag('og:type', type)
        updateMetaTag('og:site_name', siteName)
        
        // Twitter Card meta tags
        updateMetaTag('twitter:card', 'summary_large_image', false)
        updateMetaTag('twitter:title', title, false)
        updateMetaTag('twitter:description', description, false)
        updateMetaTag('twitter:image', absoluteImageUrl, false)

    }, [title, description, image, url, type, siteName, author, publishedTime])

    // This component doesn't render anything
    return null
}

export default MetaTags
