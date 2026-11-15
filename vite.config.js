import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginSitemap from 'vite-plugin-sitemap'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const certPath = resolve(process.cwd(), 'localhost.pem')
    const keyPath = resolve(process.cwd(), 'localhost-key.pem')
    const httpsConfig = existsSync(certPath) && existsSync(keyPath)
        ? { cert: readFileSync(certPath), key: readFileSync(keyPath) }
        : false

    return {
        server: {
            https: httpsConfig,
            host: 'localhost',
            port: 5173,
        },
        plugins: [
            react(),
            {
                name: 'gallery-dev-functions',
                configureServer(server) {
                    const serverKeys = [
                        'CLOUDINARY_CLOUD_NAME',
                        'CLOUDINARY_API_KEY',
                        'CLOUDINARY_API_SECRET',
                        'CLOUDINARY_FOLDER_MODE',
                        'GALLERY_OWNER_EMAIL',
                        'FIREBASE_SERVICE_ACCOUNT_JSON',
                        'GOOGLE_APPLICATION_CREDENTIALS',
                    ]
                    serverKeys.forEach((key) => {
                        if (!process.env[key] && env[key]) process.env[key] = env[key]
                    })
                    server.middlewares.use(async (request, response, next) => {
                        const path = (request.url || '').split('?')[0]
                        if (!path.startsWith('/.netlify/functions/gallery-')) {
                            next()
                            return
                        }
                        const { galleryDevMiddleware } = await import('./netlify/functions/devMiddleware.js')
                        return galleryDevMiddleware()(request, response, next)
                    })
                },
            },
            {
                name: 'dev-admin-token',
                configureServer(server) {
                    server.middlewares.use('/api/dev-admin-token', async (request, response) => {
                        if (request.method !== 'POST' && request.method !== 'GET') {
                            response.statusCode = 405
                            response.end('Method not allowed')
                            return
                        }
                        try {
                            process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
                            const { getApps, initializeApp } = await import('firebase-admin/app')
                            const { getAuth } = await import('firebase-admin/auth')
                            const app = getApps().find((item) => item.name === 'library-dev-auth')
                                || initializeApp({ projectId: 'demo-reading-library' }, 'library-dev-auth')
                            const token = await getAuth(app).createCustomToken('local-dev', { admin: true })
                            response.setHeader('Content-Type', 'application/json')
                            response.end(JSON.stringify({ token }))
                        } catch {
                            response.statusCode = 503
                            response.setHeader('Content-Type', 'application/json')
                            response.end(JSON.stringify({ error: 'The local Auth emulator is not available.' }))
                        }
                    })
                },
            },
            VitePluginSitemap({
                hostname: 'https://mohamedshams.com',
                dynamicRoutes: [
                    '/',
                    '/blog',
                    '/about',
                    '/library',
                    '/gallery',
                    '/reading'
                ],
                exclude: ['/404'],
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            }),
            {
                name: 'html-transform',
                transformIndexHtml: {
                    order: 'pre',
                    handler(html) {
                        return html
                            .replace(/%VITE_GA_MEASUREMENT_ID%/g, env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX')
                    }
                }
            }
        ],
        resolve: {
            alias: {
                '@': '/src',
            },
        },
    }
})
