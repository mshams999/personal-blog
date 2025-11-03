import { writeFileSync } from 'fs';
import path from 'path';

// Enhanced SEO setup script
async function setupSEO() {
    console.log('🔧 Setting up enhanced SEO configuration...');

    // Generate enhanced robots.txt
    const robotsContent = `User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /admin
Disallow: /_redirects
Disallow: /functions/
Disallow: /server/
Disallow: /scripts/
Disallow: /tina/

# Block development and config files
Disallow: /*.config.js
Disallow: /*.config.cjs
Disallow: /setup-*.js
Disallow: /dev.log

# Block test files
Disallow: /*test*.html
Disallow: /email-test-final.html
Disallow: /newsletter-test-live.html
Disallow: /welcome-email-test.html

# Allow specific important directories
Allow: /public/
Allow: /content/
Allow: /pictures/

# Crawl delay (optional - be respectful)
Crawl-delay: 1

# Sitemap location
Sitemap: https://mohamedshams.com/sitemap.xml
Sitemap: https://mohamedshams.com/sitemap-index.xml`;

    // Generate basic sitemap (will be enhanced by the main script)
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://mohamedshams.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mohamedshams.com/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mohamedshams.com/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://mohamedshams.com/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    try {
        // Write files
        writeFileSync('./public/robots.txt', robotsContent);
        writeFileSync('./public/sitemap.xml', basicSitemap);
        writeFileSync('./public/sitemap-index.xml', sitemapIndex);

        // Also create in dist if it exists
        try {
            writeFileSync('./dist/robots.txt', robotsContent);
            writeFileSync('./dist/sitemap.xml', basicSitemap);
            writeFileSync('./dist/sitemap-index.xml', sitemapIndex);
        } catch (e) {
            console.log('📝 Note: dist directory not found (normal for dev)');
        }

        console.log('✅ Enhanced SEO setup completed successfully!');
        console.log('📁 Files created/updated:');
        console.log('   - robots.txt (enhanced with proper blocking rules)');
        console.log('   - sitemap.xml (basic structure)');
        console.log('   - sitemap-index.xml (for future expansion)');
        console.log('');
        console.log('🔗 Next steps:');
        console.log('   1. Run your build process to generate full sitemap');
        console.log('   2. Submit sitemap to Google Search Console');
        console.log('   3. Monitor indexing status');

    } catch (error) {
        console.error('❌ Error setting up SEO files:', error);
        process.exit(1);
    }
}

setupSEO();