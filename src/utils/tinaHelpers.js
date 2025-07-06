import { client } from "../../tina/__generated__/client"

/**
 * TinaCMS Data Integration
 * This utility connects TinaCMS with your existing blog data structure
 */

// Convert TinaCMS post data to your blog's format
export const convertTinaPostToBlogFormat = (tinaPost) => {
    return {
        id: tinaPost._sys.filename,
        slug: tinaPost.slug || tinaPost._sys.filename,
        title: tinaPost.title,
        excerpt: tinaPost.excerpt,
        date: tinaPost.date,
        readTime: tinaPost.readTime,
        featuredImage: tinaPost.featuredImage,
        authorId: tinaPost.authorId,
        categoryId: tinaPost.categoryId,
        tags: tinaPost.tags || [],
        mdxContentPath: `/content/posts/${tinaPost._sys.filename}.mdx`,
        // SEO fields
        seo: {
            metaTitle: tinaPost.seo?.metaTitle || tinaPost.title,
            metaDescription: tinaPost.seo?.metaDescription || tinaPost.excerpt,
            keywords: tinaPost.seo?.keywords || tinaPost.tags || []
        }
    }
}

// Fetch all posts from TinaCMS
export const getTinaPosts = async () => {
    try {
        const response = await client.queries.postConnection()
        return response.data.postConnection.edges.map(edge =>
            convertTinaPostToBlogFormat(edge.node)
        )
    } catch (error) {
        console.error('Error fetching TinaCMS posts:', error)
        return []
    }
}

// Fetch a single post from TinaCMS
export const getTinaPost = async (slug) => {
    try {
        const response = await client.queries.post({ relativePath: `${slug}.mdx` })
        return convertTinaPostToBlogFormat(response.data.post)
    } catch (error) {
        console.error(`Error fetching TinaCMS post ${slug}:`, error)
        return null
    }
}

// Generate static paths for TinaCMS posts
export const getTinaPostPaths = async () => {
    try {
        const response = await client.queries.postConnection()
        return response.data.postConnection.edges.map(edge => ({
            params: { slug: edge.node._sys.filename }
        }))
    } catch (error) {
        console.error('Error generating TinaCMS post paths:', error)
        return []
    }
}

// Hybrid data fetching - combines static data with TinaCMS data
export const getHybridPosts = async (staticPosts = []) => {
    try {
        const tinaPosts = await getTinaPosts()

        // Merge TinaCMS posts with static posts, preferring TinaCMS data
        const allPosts = [...tinaPosts]

        // Add static posts that don't exist in TinaCMS
        staticPosts.forEach(staticPost => {
            const exists = tinaPosts.find(tinaPost => tinaPost.slug === staticPost.slug)
            if (!exists) {
                allPosts.push(staticPost)
            }
        })

        // Sort by date (newest first)
        return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
        console.error('Error fetching hybrid posts:', error)
        return staticPosts // Fallback to static posts
    }
}

export default {
    convertTinaPostToBlogFormat,
    getTinaPosts,
    getTinaPost,
    getTinaPostPaths,
    getHybridPosts
}
