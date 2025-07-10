/**
 * Static Meta Tags Generator
 * 
 * This utility helps generate static meta tags for social sharing
 * that can be injected at build time or server-side for better
 * social media crawler support.
 */

/**
 * Generate meta tags HTML string for a blog post
 * @param {Object} post - Blog post object
 * @param {string} baseUrl - Base URL of the site
 * @returns {string} HTML meta tags string
 */
export const generatePostMetaTags = (post, baseUrl = 'https://your-domain.com') => {
    const title = post.title || 'Mohamed Shams Blog'
    const description = post.excerpt || 'The official blog for Dr. Mohamed Shams'
    const image = post.featuredImage?.startsWith('http') 
        ? post.featuredImage 
        : `${baseUrl}${post.featuredImage || '/og-image.jpg'}`
    const url = `${baseUrl}/post/${post.slug}`
    const publishedTime = new Date(post.date).toISOString()

    return `
    <!-- Dynamic Meta Tags for ${post.slug} -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="Mohamed Shams Blog" />
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:author" content="Mohamed Shams Abdelaziz" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:creator" content="@MohamedShams936" />
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${title}",
        "description": "${description}",
        "image": "${image}",
        "url": "${url}",
        "author": {
            "@type": "Person",
            "name": "Mohamed Shams Abdelaziz"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mohamed Shams Blog"
        },
        "datePublished": "${publishedTime}"
    }
    </script>
    `
}

/**
 * Update document head with social meta tags client-side
 * This is a fallback for when server-side generation isn't available
 */
export const updateDocumentMetaTags = (post, baseUrl = window.location.origin) => {
    const title = post.title || 'Mohamed Shams Blog'
    const description = post.excerpt || 'The official blog for Dr. Mohamed Shams'
    const image = post.featuredImage?.startsWith('http') 
        ? post.featuredImage 
        : `${baseUrl}${post.featuredImage || '/og-image.jpg'}`
    const url = `${baseUrl}/post/${post.slug}`

    // Update document title
    document.title = `${title} | Mohamed Shams Blog`

    // Update or create meta tags
    const metaTags = [
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        { name: 'description', content: description }
    ]

    metaTags.forEach(({ property, name, content }) => {
        const attribute = property ? 'property' : 'name'
        const attributeValue = property || name
        
        let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`)
        
        if (element) {
            element.setAttribute('content', content)
        } else {
            element = document.createElement('meta')
            element.setAttribute(attribute, attributeValue)
            element.setAttribute('content', content)
            document.head.appendChild(element)
        }
    })
}

export default {
    generatePostMetaTags,
    updateDocumentMetaTags
}
