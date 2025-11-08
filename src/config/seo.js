// SEO Configuration for Mohamed Shams Blog
export const seoConfig = {
    // Site information
    siteUrl: 'https://mohamedshams.com',
    siteName: 'مدونة محمد شمس',
    siteDescription: 'مدونة شخصية تضم مقالات وتجارب ورؤى متقدمة في الطب والتكنولوجيا والمقالات الاجتماعية',

    // Author info (single author - personal blog)
    author: {
        name: 'محمد شمس',
        bio: 'طبيب طوارئ متخصص يجمع بين المعرفة الطبية والتكنولوجيا',
        social: {
            twitter: 'https://x.com/MohamedShams936',
            linkedin: 'https://www.linkedin.com/in/mohamedshamsms/',
            github: 'https://github.com/mshams999',
            facebook: 'https://www.facebook.com/mosh936',
            email: 'shamsmohamed155@gmail.com'
        }
    },

    // Default meta tags
    defaultMeta: {
        type: 'website',
        locale: 'ar_SA',
        keywords: 'طب, تكنولوجيا, برمجة, مقالات, طبيب, صحة',
        robots: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
        googlebot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1'
    },

    // Sitemap configuration
    sitemap: {
        changefreq: {
            homepage: 'weekly',
            blog: 'daily',
            posts: 'never',
            categories: 'monthly',
            static: 'monthly'
        },
        priority: {
            homepage: '1.0',
            blog: '0.95',
            categories: '0.9',
            posts: '0.7',
            cv: '0.8',
            certificates: '0.6',
            static: '0.6'
        }
    },

    // Robots.txt directives
    robotsConfig: {
        userAgent: '*',
        allow: [
            '/',
            '/post/',
            '/category/',
            '/blog',
            '/certificates/',
            '/cv',
            '/reading',
            '/categories',
            '/content/',
            '/public/'
        ],
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
            '/node_modules/',
            '/.git/',
            '/.env*'
        ],
        crawlDelay: 0.5,
        requestRate: '30/1m',
        sitemap: [
            'https://mohamedshams.com/sitemap.xml',
            'https://mohamedshams.com/sitemap-index.xml'
        ]
    },

    // Structured data defaults
    organizationSchema: {
        name: 'محمد شمس',
        description: 'طبيب طوارئ ومطور برمجيات',
        url: 'https://mohamedshams.com',
        sameAs: [
            'https://x.com/MohamedShams936',
            'https://www.linkedin.com/in/mohamedshamsms/',
            'https://github.com/mshams999',
            'https://www.facebook.com/mosh936'
        ]
    },

    // Open Graph defaults
    openGraph: {
        type: 'website',
        locale: 'ar_SA',
        siteName: 'مدونة محمد شمس'
    }
}

export default seoConfig