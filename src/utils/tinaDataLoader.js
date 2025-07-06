/**
 * TinaCMS Data Integration with graceful fallback
 * This module provides utilities to fetch TinaCMS data and integrate it with the existing blog
 * If TinaCMS is not available, it falls back to static content only
 */

// Check if we're in development mode and TinaCMS is available
const isTinaCMSAvailable = () => {
    try {
        // For client-side, check if we're in development and have access to the browser environment
        return process.env.NODE_ENV === 'development'
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
        console.log('TinaCMS not available (not in development mode), returning empty array for posts')
        return []
    }

    console.log('🔄 Fetching posts from TinaCMS GraphQL API...')

    try {
        // Create timeout promise (5 seconds)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TinaCMS GraphQL timeout')), 5000)
        )

        // Try to fetch from TinaCMS GraphQL API directly
        const fetchPromise = fetch('http://localhost:4001/graphql', {
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
                                        metaDescription
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

        const response = await Promise.race([fetchPromise, timeoutPromise])

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data?.data?.postConnection?.edges) {
            const posts = data.data.postConnection.edges.map(edge => {
                const post = edge.node
                // Generate slug from filename (remove .mdx extension)
                const slug = post._sys.filename.replace('.mdx', '')

                return {
                    id: post.id,
                    slug: slug,
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

            console.log(`✅ Successfully fetched ${posts.length} posts from TinaCMS`)
            return posts
        }
        console.log('⚠️ No posts found in TinaCMS response')
        return []
    } catch (error) {
        console.error('❌ Failed to fetch TinaCMS posts:', error.message)
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
                                metaDescription
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
    console.log('🔄 Converting TinaCMS post to blog format:', tinaPost.title)
    console.log('📝 Original body content:', tinaPost.body)
    console.log('📝 Body type:', typeof tinaPost.body)

    const converted = {
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
        body: tinaPost.body, // ✅ Explicitly include the body content!
        _source: 'tinacms'
    }

    console.log('✅ Converted body content:', converted.body)
    return converted
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
