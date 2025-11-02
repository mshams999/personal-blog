import { client } from '../../tina/__generated__/client'

export async function getAllPostPaths() {
    try {
        const postsResponse = await client.queries.postConnection()

        // Extract paths from the posts
        const paths = postsResponse.data.postConnection.edges.map(edge => {
            return `/blog/${edge.node._sys.filename}`
        })

        // Add your static routes
        const staticRoutes = [
            '/',
            '/blog',
            '/about',
            // Add other static routes here
        ]

        return [...staticRoutes, ...paths]
    } catch (error) {
        console.error('Error fetching post paths:', error)
        return []
    }
}