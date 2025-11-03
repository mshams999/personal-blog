import { writeFileSync } from 'fs';
import { createClient } from 'tinacms/dist/client';
import { queries } from '../tina/__generated__/types.js';

const resolveBranch = () =>
    process.env.GITHUB_BRANCH ||
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    'main';

const buildTinaClient = () => {
    const branch = resolveBranch();
    const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
    const token = process.env.TINA_TOKEN;
    const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
    const explicitUrl = process.env.TINA_API_URL;

    const defaultUrl = isLocal
        ? 'http://localhost:4001/graphql'
        : clientId
            ? `https://content.tinajs.io/1.5/content/${clientId}/github/${branch}`
            : undefined;

    const url = explicitUrl || defaultUrl;

    if (!url) {
        throw new Error(
            'Unable to determine Tina GraphQL URL. Set TINA_API_URL or provide NEXT_PUBLIC_TINA_CLIENT_ID.'
        );
    }

    const clientConfig = { url, queries };

    if (token) {
        clientConfig.token = token;
    }

    return createClient(clientConfig);
};

const client = buildTinaClient();

async function generateSitemap() {
    try {
        // Fetch all posts
        const postsResponse = await client.queries.postConnection();
        const posts = postsResponse.data.postConnection.edges || [];

        // Static routes with different priorities and change frequencies
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
            }
        ];

        // Generate post routes with proper metadata
        const postRoutes = posts.map(post => {
            // Get the last modified date from the post data if available
            const lastModified = post.node.date || post.node._sys.createdAt || new Date().toISOString();

            return {
                url: `/blog/${post.node._sys.filename}`,
                priority: '0.7',
                changefreq: 'weekly',
                lastmod: new Date(lastModified).toISOString()
            };
        });

        // Combine all routes
        const allRoutes = [...staticRoutes, ...postRoutes];

        // Generate sitemap XML with proper formatting and metadata
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allRoutes.map(route => `  <url>
    <loc>https://mohamedshams.com${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
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
