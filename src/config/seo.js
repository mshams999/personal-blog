// SEO Configuration for Mohamed Shams Blog
export const seoConfig = {
    // Site information
    siteUrl: 'https://mohamedshams.com',
    siteName: 'Mohamed Shams Blog',
    siteDescription: 'Personal blog by Mohamed Shams - insights, tutorials, and thoughts on technology, development, and more.',

    // Social media and author info
    author: {
        name: 'Mohamed Shams',
        social: {
            twitter: '@mohamedshams999', // Update with actual handle
            linkedin: 'mohamed-shams', // Update with actual profile
            github: 'mshams999'
        }
    },

    // Default meta tags
    defaultMeta: {
        type: 'website',
        locale: 'en_US',
        keywords: 'blog, technology, development, programming, tutorials, insights',
        robots: 'index, follow',
        googlebot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1'
    },

    // Sitemap configuration
    sitemap: {
        changefreq: {
            homepage: 'weekly',
            blog: 'daily',
            posts: 'weekly',
            static: 'monthly'
        },
        priority: {
            homepage: '1.0',
            blog: '0.9',
            posts: '0.7',
            about: '0.8',
            static: '0.6'
        }
    },

    // Robots.txt directives
    robotsConfig: {
        userAgent: '*',
        allow: ['/', '/blog/', '/about/', '/public/', '/content/', '/pictures/'],
        disallow: [
            '/admin/',
            '/admin',
            '/_redirects',
            '/functions/',
            '/server/',
            '/scripts/',
            '/tina/',
            '/*.config.js',
            '/*.config.cjs',
            '/setup-*.js',
            '/dev.log',
            '/*test*.html',
            '/email-test-final.html',
            '/newsletter-test-live.html',
            '/welcome-email-test.html'
        ],
        sitemap: 'https://mohamedshams.com/sitemap.xml'
    }
}

export default seoConfig