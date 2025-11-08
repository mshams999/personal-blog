/**
 * Schema.org JSON-LD Schema Generators
 * 
 * Utilities for generating structured data markup for:
 * - BlogPosting (individual articles)
 * - BreadcrumbList (navigation paths)
 * - Organization (site information)
 */

import { seoConfig } from '../config/seo'

/**
 * Generate BlogPosting schema for individual blog posts
 * 
 * @param {Object} post - Post data
 * @param {Object} author - Author data
 * @param {Object} category - Category data
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org BlogPosting JSON-LD
 */
export const generateBlogPostingSchema = (post, author, category, siteUrl = 'https://mohamedshams.com') => {
    if (!post) return null

    // Ensure image URL is absolute
    const getAbsoluteUrl = (url) => {
        if (!url) return null
        if (url.startsWith('http')) return url
        return `${siteUrl}${url.startsWith('/') ? url : '/' + url}`
    }

    const postUrl = `${siteUrl}/post/${post.slug}`
    const featuredImage = getAbsoluteUrl(post.featuredImage)

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': postUrl,
        'headline': post.title,
        'description': post.excerpt,
        'image': {
            '@type': 'ImageObject',
            'url': featuredImage,
            'width': 1200,
            'height': 630
        },
        'datePublished': post.date,
        'dateModified': post.dateModified || post.date,
        'author': {
            '@type': 'Person',
            '@id': `${siteUrl}#author`,
            'name': author?.name || seoConfig.author.name,
            'url': siteUrl,
            'description': author?.bio || seoConfig.author.bio
        },
        'creator': {
            '@type': 'Person',
            'name': author?.name || seoConfig.author.name
        },
        'publisher': {
            '@type': 'Organization',
            '@id': `${siteUrl}#organization`,
            'name': seoConfig.author.name,
            'logo': {
                '@type': 'ImageObject',
                'url': `${siteUrl}/logo.png`
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': postUrl
        },
        'articleBody': post.content || post.excerpt,
        'articleSection': category?.name || 'Blog',
        'keywords': post.seo?.keywords?.join(', ') || '',
        'wordCount': post.wordCount || 0,
        'timeRequired': `PT${post.readTime || 5}M`,
        'url': postUrl,
        'inLanguage': 'ar'
    }

    // Add social media interaction if available
    if (post.commentCount !== undefined) {
        schema.commentCount = post.commentCount
    }

    return schema
}

/**
 * Generate BreadcrumbList schema for navigation paths
 * 
 * @param {Array} breadcrumbs - Array of {name, url} objects
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org BreadcrumbList JSON-LD
 */
export const generateBreadcrumbSchema = (breadcrumbs, siteUrl = 'https://mohamedshams.com') => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null

    const itemListElement = breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `${siteUrl}${crumb.url}`
    }))

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': itemListElement
    }
}

/**
 * Generate Organization schema for the site
 * 
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org Organization JSON-LD
 */
export const generateOrganizationSchema = (siteUrl = 'https://mohamedshams.com') => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        'name': seoConfig.author.name,
        'description': seoConfig.author.bio,
        'url': siteUrl,
        'sameAs': seoConfig.author.social ? Object.values(seoConfig.author.social) : [],
        'logo': {
            '@type': 'ImageObject',
            'url': `${siteUrl}/logo.png`,
            'width': 100,
            'height': 100
        },
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Service',
            'email': seoConfig.author.social?.email
        }
    }
}

/**
 * Generate Person schema for the author
 * 
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org Person JSON-LD
 */
export const generatePersonSchema = (siteUrl = 'https://mohamedshams.com') => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${siteUrl}#author`,
        'name': seoConfig.author.name,
        'description': seoConfig.author.bio,
        'url': siteUrl,
        'image': `${siteUrl}/author-image.jpg`,
        'sameAs': seoConfig.author.social ? Object.values(seoConfig.author.social) : [],
        'jobTitle': 'Emergency Medicine Doctor & Software Developer',
        'worksFor': {
            '@type': 'Organization',
            'name': seoConfig.author.name
        }
    }
}

/**
 * Generate WebSite schema with search action
 * 
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org WebSite JSON-LD
 */
export const generateWebsiteSchema = (siteUrl = 'https://mohamedshams.com') => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        'url': siteUrl,
        'name': seoConfig.siteName,
        'description': seoConfig.siteDescription,
        'inLanguage': 'ar',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${siteUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    }
}

/**
 * Generate CollectionPage schema for category pages
 * 
 * @param {Object} category - Category data
 * @param {Array} posts - Array of posts in category
 * @param {string} siteUrl - Base URL of site
 * @returns {Object} Schema.org CollectionPage JSON-LD
 */
export const generateCollectionPageSchema = (category, posts = [], siteUrl = 'https://mohamedshams.com') => {
    if (!category) return null

    const pageUrl = `${siteUrl}/category/${category.slug}`

    const hasPart = posts.slice(0, 10).map(post => ({
        '@type': 'BlogPosting',
        '@id': `${siteUrl}/post/${post.slug}`,
        'headline': post.title,
        'url': `${siteUrl}/post/${post.slug}`
    }))

    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': pageUrl,
        'url': pageUrl,
        'name': category.name,
        'description': category.description || `Collection of ${category.name} posts`,
        'hasPart': hasPart,
        'inLanguage': 'ar',
        'isPartOf': {
            '@type': 'WebSite',
            '@id': `${siteUrl}#website`
        }
    }
}

/**
 * Insert JSON-LD schema into document head
 * 
 * @param {Object} schema - Schema object to insert
 * @param {string} id - Unique identifier for the script tag
 */
export const insertSchema = (schema, id = 'main-schema') => {
    if (!schema) return

    // Remove existing schema with same id
    const existingScript = document.querySelector(`script[data-schema-id="${id}"]`)
    if (existingScript) {
        existingScript.remove()
    }

    // Create and insert new schema script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema-id', id)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
}

/**
 * Insert multiple schemas at once
 * 
 * @param {Array} schemas - Array of {schema, id} objects
 */
export const insertMultipleSchemas = (schemas) => {
    schemas.forEach(({ schema, id }) => {
        insertSchema(schema, id)
    })
}

/**
 * Combine multiple schemas into a graph
 * 
 * @param {Array} schemas - Array of schema objects
 * @returns {Object} Schema.org Graph JSON-LD
 */
export const generateSchemaGraph = (schemas) => {
    return {
        '@context': 'https://schema.org',
        '@graph': schemas
    }
}
