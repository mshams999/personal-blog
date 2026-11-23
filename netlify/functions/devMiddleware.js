import gallerySign from './gallery-sign.js'
import galleryDestroy from './gallery-destroy.js'

const ROUTES = {
    '/.netlify/functions/gallery-sign': gallerySign,
    '/.netlify/functions/gallery-destroy': galleryDestroy,
}

function pathname(url = '') {
    return url.split('?')[0]
}

function copyHeaders(nodeReq) {
    const headers = new Headers()
    Object.entries(nodeReq.headers).forEach(([key, value]) => {
        // HTTP/2 pseudo-headers (:path, :method, :authority, :scheme) are not
        // legal Fetch header names. Copying them throws and fails every sign.
        if (!key || key.startsWith(':') || value == null) return
        const text = Array.isArray(value) ? value.join(', ') : String(value)
        try {
            headers.set(key, text)
        } catch {
            // Drop any other name Fetch refuses.
        }
    })
    return headers
}

async function toWebRequest(nodeReq) {
    const chunks = []
    for await (const chunk of nodeReq) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const method = nodeReq.method || nodeReq.headers[':method'] || 'GET'
    const path = nodeReq.url || nodeReq.headers[':path'] || '/'
    return new Request(`http://127.0.0.1${path}`, {
        method,
        headers: copyHeaders(nodeReq),
        body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
    })
}

export function galleryDevMiddleware() {
    return async function galleryDev(nodeReq, nodeRes, next) {
        const handler = ROUTES[pathname(nodeReq.url)]
        if (!handler) {
            next()
            return
        }

        try {
            const response = await handler(await toWebRequest(nodeReq))
            nodeRes.statusCode = response.status
            response.headers.forEach((value, key) => nodeRes.setHeader(key, value))
            nodeRes.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
            console.error('gallery dev function failed:', error?.message || error)
            nodeRes.statusCode = 500
            nodeRes.setHeader('content-type', 'application/json; charset=utf-8')
            nodeRes.end(JSON.stringify({ error: 'gallery-dev-function-failed' }))
        }
    }
}
