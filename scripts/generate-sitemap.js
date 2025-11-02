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
