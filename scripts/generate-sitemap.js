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
        console.log('📝 Generating comprehensive sitemap...');
        
        // Fetch all posts from TinaCMS
        let posts = [];
        try {
            const postsResponse = await client.queries.postConnection();
            posts = postsResponse.data.postConnection.edges || [];
            console.log(`✅ Found ${posts.length} posts from TinaCMS`);
        } catch (err) {
            console.warn('⚠️  Could not fetch TinaCMS posts, using static posts');
        }

        const now = new Date().toISOString();

        // Static core routes
        const staticRoutes = [
            { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: now },
            { url: '/blog', priority: '0.95', changefreq: 'daily', lastmod: now },
            { url: '/categories', priority: '0.9', changefreq: 'monthly', lastmod: now },
            { url: '/cv', priority: '0.8', changefreq: 'monthly', lastmod: now },
            { url: '/reading', priority: '0.7', changefreq: 'monthly', lastmod: now },
        ];

        // Category routes - Updated with new slugs
        const categoryRoutes = [
            { url: '/category/medical', priority: '0.85', changefreq: 'weekly', lastmod: now },
            { url: '/category/social-articles', priority: '0.85', changefreq: 'weekly', lastmod: now },
        ];

        // Post routes
        const postRoutes = posts.map(post => {
            const lastModified = post.node.date || post.node._sys.updatedAt || now;
            return {
                url: `/post/${post.node.slug || post.node._sys.filename}`,
                priority: '0.7',
                changefreq: 'never',
                lastmod: new Date(lastModified).toISOString()
            };
        });

        // Certificate routes
        const certRoutes = [
            { url: '/certificates/atls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/acls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/bls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/maaden', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/usmle-step1', priority: '0.6', changefreq: 'monthly', lastmod: now },
        ];

        // Combine all routes
        const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes, ...certRoutes];

        // Deduplicate routes by URL
        const uniqueRoutes = Array.from(
            new Map(allRoutes.map(r => [r.url, r])).values()
        );

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${uniqueRoutes.map(route => `  <url>
    <loc>https://mohamedshams.com${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        // Write sitemap to public directory
        writeFileSync('./public/sitemap.xml', sitemap);
        console.log(`✅ Sitemap generated successfully with ${uniqueRoutes.length} URLs`);
        console.log(`📍 File: ./public/sitemap.xml`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
