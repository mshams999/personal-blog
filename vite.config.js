import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            react(),
            mdx({
                // Configure MDX options here
                remarkPlugins: [],
                rehypePlugins: [],
            }),
            // Custom plugin to replace Google Analytics environment variables in HTML
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
        assetsInclude: ['**/*.mdx'],
    }
})
