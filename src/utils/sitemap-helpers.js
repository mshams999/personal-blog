import { client } from '../../tina/__generated__/client'

export async function getAllPostPaths() {
    try {
        const postsResponse = await client.queries.postConnection()

        // Extract paths from the posts with metadata
        const postPaths = postsResponse.data.postConnection.edges.map(edge => {
            return {
                url: `/blog/${edge.node._sys.filename}`,
                priority: '0.7',
                changefreq: 'weekly',
                lastmod: edge.node.date || edge.node._sys.createdAt || new Date().toISOString()
            }
        })

        // Define static routes with appropriate SEO priorities
        const staticRoutes = [
            {
                url: '/',
                priority: '1.0',
                changefreq: 'weekly',
                lastmod: new Date().toISOString()
            },
            {
                url: '/blog',
                priority: '0.9',
                changefreq: 'daily',
                lastmod: new Date().toISOString()
            },
            {
                url: '/about',
                priority: '0.8',
                changefreq: 'monthly',
                lastmod: new Date().toISOString()
            },
            // Add other static routes here as needed
            // {
            //     url: '/contact',
            //     priority: '0.6',
            //     changefreq: 'monthly',
            //     lastmod: new Date().toISOString()
            // }
        ]

        return [...staticRoutes, ...postPaths]
    } catch (error) {
        console.error('Error fetching post paths:', error)
        return []
    }
}

export function generateSitemapXML(routes) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `  <url>
    <loc>https://mohamedshams.com${route.url}</loc>
    <lastmod>${new Date(route.lastmod).toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}