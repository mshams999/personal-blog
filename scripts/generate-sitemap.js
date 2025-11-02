import { writeFileSync } from 'fs';
import { client } from '../tina/__generated__/client.js';

async function generateSitemap() {
    try {
        // Fetch all posts
        const postsResponse = await client.queries.postConnection();
        const posts = postsResponse.data.postConnection.edges || [];

        // Static routes
        const staticRoutes = [
            '/',
            '/blog',
            '/about'
        ];

        // Generate post routes
        const postRoutes = posts.map(post => `/blog/${post.node._sys.filename}`);

        // Combine all routes
        const allRoutes = [...staticRoutes, ...postRoutes];

        // Generate sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>https://mohamedshams.com${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

        // Write sitemap to the dist directory
        writeFileSync('./dist/sitemap.xml', sitemap);
        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();