// Mock search function for demo purposes
// TODO: Replace with actual Algolia implementation when ready
export const searchPosts = (query, posts) => {
    if (!query || query.trim() === '') {
        return []
    }

    const lowerQuery = query.toLowerCase()
    return posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).slice(0, 5) // Limit to 5 results
}

// Algolia configuration (commented out until needed)
/*
import { algoliasearch } from 'algoliasearch/lite'

const searchClient = algoliasearch(
    'YOUR_APP_ID', // Replace with your Algolia App ID
    'YOUR_SEARCH_API_KEY' // Replace with your Search-Only API Key
)

export { searchClient }

export const searchConfig = {
    indexName: 'blog_posts', // Replace with your index name
    searchClient,
}
*/
