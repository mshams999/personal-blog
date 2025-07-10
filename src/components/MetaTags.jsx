import { useEffect } from 'react'

/**
 * MetaTags component for dynamic social sharing meta tags
 * 
 * Updates the document head with Open Graph and Twitter Card meta tags
 * for proper social media sharing with images and descriptions.
 * 
 * @param {string} title - Page/post title
 * @param {string} description - Page/post description
 * @param {string} image - Featured image URL
 * @param {string} url - Current page URL
 * @param {string} type - Open Graph type (article, website, etc.)
 * @param {string} siteName - Site name
 * @param {string} author - Author name
 * @param {string} publishedTime - Publication date (ISO string)
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

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            console.log('🏷️ MetaTags Component - Setting meta tags:', {
                title,
                description,
                image,
                absoluteImageUrl,
                url,
                type,
                author,
                publishedTime
            })
        }

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
        
        if (publishedTime) {
            updateMetaTag('article:published_time', publishedTime)
        }
        
        if (author) {
            updateMetaTag('article:author', author)
        }

        // Twitter Card meta tags
        updateMetaTag('twitter:card', 'summary_large_image', false)
        updateMetaTag('twitter:title', title, false)
        updateMetaTag('twitter:description', description, false)
        updateMetaTag('twitter:image', absoluteImageUrl, false)
        updateMetaTag('twitter:url', url, false)

        // Additional meta tags for better sharing
        updateMetaTag('twitter:creator', author ? `@${author.replace(/\s/g, '')}` : '', false)
        updateMetaTag('og:image:width', '1200')
        updateMetaTag('og:image:height', '630')
        updateMetaTag('og:image:type', 'image/jpeg')

        // Schema.org structured data for articles
        if (type === 'article') {
            const existingScript = document.querySelector('script[type="application/ld+json"]')
            if (existingScript) {
                existingScript.remove()
            }

            const structuredData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": description,
                "image": absoluteImageUrl,
                "url": url,
                "author": {
                    "@type": "Person",
                    "name": author
                },
                "publisher": {
                    "@type": "Organization",
                    "name": siteName
                },
                "datePublished": publishedTime
            }

            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }

        // Cleanup function
        return () => {
            // Don't remove meta tags on cleanup as they should persist
            // until the next page/component updates them
        }        }, [title, description, image, url, type, siteName, author, publishedTime])

    // This component doesn't render anything
    return null
}

export default MetaTags
