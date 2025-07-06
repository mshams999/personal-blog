/**
 * TinaCMS Data Integration with graceful fallback
 * This module provides utilities to fetch TinaCMS data and integrate it with the existing blog
 * If TinaCMS is not available, it falls back to static content only
 */

// Check if we're in development mode and TinaCMS is available
const isTinaCMSAvailable = () => {
    try {
        // Check if TinaCMS GraphQL endpoint is running
        return process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
    } catch (error) {
        return false
    }
}

/**
 * Fetch all posts from TinaCMS or return empty array if unavailable
 * @returns {Promise<Array>} Array of blog posts
 */
export const fetchTinaPosts = async () => {
    if (!isTinaCMSAvailable()) {
        console.log('TinaCMS not available, returning empty array for posts')
        return []
    }

    try {
        // Try to fetch from TinaCMS GraphQL API directly
        const response = await fetch('http://localhost:4001/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        postConnection {
                            edges {
                                node {
                                    id
                                    title
                                    excerpt
                                    date
                                    readTime
                                    featuredImage
                                    authorId
                                    categoryId
                                    tags
                                    body
                                    seo {
                                        title
                                        description
                                    }
                                    _sys {
                                        filename
                                    }
                                }
                            }
                        }
                    }
                `
            })
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data?.data?.postConnection?.edges) {
            return data.data.postConnection.edges.map(edge => {
                const post = edge.node
                return {
                    id: post.id,
                    slug: post.slug || post._sys.filename.replace('.mdx', ''),
                    title: post.title,
                    excerpt: post.excerpt,
                    date: post.date,
                    readTime: post.readTime,
                    featuredImage: post.featuredImage,
                    authorId: post.authorId,
                    categoryId: post.categoryId,
                    tags: post.tags || [],
                    body: post.body,
                    seo: post.seo,
                    _source: 'tinacms'
                }
            })
        }

        return []
    } catch (error) {
        console.warn('Failed to fetch TinaCMS posts:', error.message)
        return []
    }
}

/**
 * Fetch a single post by filename from TinaCMS
 * @param {string} filename - The filename of the post (without .mdx)
 * @returns {Promise<Object|null>} The post object or null if not found
 */
export const fetchTinaPost = async (filename) => {
    if (!isTinaCMSAvailable()) {
        console.log('TinaCMS not available, returning null for single post')
        return null
    }

    try {
        const response = await fetch('http://localhost:4001/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query($relativePath: String!) {
                        post(relativePath: $relativePath) {
                            id
                            title
                            excerpt
                            date
                            readTime
                            featuredImage
                            authorId
                            categoryId
                            tags
                            body
                            seo {
                                title
                                description
                            }
                            _sys {
                                filename
                            }
                        }
                    }
                `,
                variables: {
                    relativePath: `${filename}.mdx`
                }
            })
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data?.data?.post) {
            const post = data.data.post
            return {
                id: post.id,
                slug: post.slug || filename,
                title: post.title,
                excerpt: post.excerpt,
                date: post.date,
                readTime: post.readTime,
                featuredImage: post.featuredImage,
                authorId: post.authorId,
                categoryId: post.categoryId,
                tags: post.tags || [],
                body: post.body,
                seo: post.seo,
                _source: 'tinacms'
            }
        }

        return null
    } catch (error) {
        console.warn('Failed to fetch TinaCMS post:', error.message)
        return null
    }
}

/**
 * Convert TinaCMS post to blog format
 * @param {Object} tinaPost - Post from TinaCMS
 * @returns {Object} Blog post format
 */
export const convertTinaPostToBlogFormat = (tinaPost) => {
    return {
        ...tinaPost,
        // Ensure required fields are present
        id: tinaPost.id || `tina-${Date.now()}`,
        slug: tinaPost.slug || tinaPost.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: tinaPost.excerpt || '',
        date: tinaPost.date || new Date().toISOString(),
        readTime: tinaPost.readTime || 5,
        featuredImage: tinaPost.featuredImage || '/images/default-featured.jpg',
        authorId: tinaPost.authorId || 'author-1',
        categoryId: tinaPost.categoryId || 'cat-1',
        tags: tinaPost.tags || [],
        _source: 'tinacms'
    }
}

/**
 * Check if TinaCMS is running and responsive
 * @returns {Promise<boolean>} True if TinaCMS is available
 */
export const checkTinaCMSHealth = async () => {
    if (!isTinaCMSAvailable()) {
        return false
    }

    try {
        const response = await fetch('http://localhost:4001/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query { __typename }`
            })
        })

        return response.ok
    } catch (error) {
        console.warn('TinaCMS health check failed:', error.message)
        return false
    }
}
