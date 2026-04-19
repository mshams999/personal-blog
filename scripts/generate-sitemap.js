import { writeFileSync } from 'fs';
import 'dotenv/config';

const SB_TOKEN =
    process.env.VITE_STORYBLOK_TOKEN ||
    process.env.STORYBLOK_TOKEN ||
    '';
const SB_REGION = process.env.VITE_STORYBLOK_REGION || process.env.STORYBLOK_REGION || 'eu';
const SB_VERSION = process.env.STORYBLOK_VERSION || 'published';

const regionHost = SB_REGION === 'us' ? 'api-us.storyblok.com' : 'api.storyblok.com';

async function fetchStoryblokPosts() {
    if (!SB_TOKEN) {
        console.warn('⚠️  No STORYBLOK_TOKEN set — skipping dynamic post routes in sitemap.');
        return [];
    }

    try {
        const url = `https://${regionHost}/v2/cdn/stories?starts_with=posts/&version=${SB_VERSION}&per_page=100&token=${SB_TOKEN}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`⚠️  Storyblok returned ${res.status} — skipping dynamic post routes.`);
            return [];
        }
        const data = await res.json();
        return data?.stories || [];
    } catch (err) {
        console.warn('⚠️  Could not fetch posts from Storyblok:', err.message);
        return [];
    }
}

async function generateSitemap() {
    try {
        console.log('📝 Generating sitemap...');

        const stories = await fetchStoryblokPosts();
        console.log(`✅ Found ${stories.length} posts from Storyblok`);

        const now = new Date().toISOString();

        const staticRoutes = [
            { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: now },
            { url: '/blog', priority: '0.95', changefreq: 'daily', lastmod: now },
            { url: '/categories', priority: '0.9', changefreq: 'monthly', lastmod: now },
            { url: '/cv', priority: '0.8', changefreq: 'monthly', lastmod: now },
            { url: '/reading', priority: '0.7', changefreq: 'monthly', lastmod: now },
        ];

        const categoryRoutes = [
            { url: '/category/medical', priority: '0.85', changefreq: 'weekly', lastmod: now },
            { url: '/category/social-articles', priority: '0.85', changefreq: 'weekly', lastmod: now },
        ];

        const postRoutes = stories.map((story) => {
            const slug = story.content?.slug || story.slug;
            const lastmod = story.content?.date || story.first_published_at || story.published_at || now;
            return {
                url: `/post/${slug}`,
                priority: '0.7',
                changefreq: 'never',
                lastmod: new Date(lastmod).toISOString(),
            };
        });

        const certRoutes = [
            { url: '/certificates/atls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/acls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/bls', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/maaden', priority: '0.6', changefreq: 'monthly', lastmod: now },
            { url: '/certificates/usmle-step1', priority: '0.6', changefreq: 'monthly', lastmod: now },
        ];

        const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes, ...certRoutes];
        const uniqueRoutes = Array.from(new Map(allRoutes.map((r) => [r.url, r])).values());

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${uniqueRoutes.map((route) => `  <url>
    <loc>https://mohamedshams.com${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        writeFileSync('./public/sitemap.xml', sitemap);
        console.log(`✅ Sitemap generated with ${uniqueRoutes.length} URLs`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
