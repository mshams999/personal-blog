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
            VitePluginSitemap({
                hostname: 'https://mohamedshams.com',
                dynamicRoutes: [
                    '/',
                    '/blog',
                    '/about'
                ],
                exclude: ['/404'],
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            }),
            {
                name: 'html-transform',
                transformIndexHtml: {
                    enforce: 'pre',
                    transform(html) {
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
