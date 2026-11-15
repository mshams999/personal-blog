import gallerySign from './gallery-sign.js'
import galleryDestroy from './gallery-destroy.js'

const ROUTES = {
    '/.netlify/functions/gallery-sign': gallerySign,
    '/.netlify/functions/gallery-destroy': galleryDestroy,
}

function pathname(url = '') {
    return url.split('?')[0]
}

async function toWebRequest(nodeReq) {
    const chunks = []
    for await (const chunk of nodeReq) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const headers = new Headers()
    Object.entries(nodeReq.headers).forEach(([key, value]) => {
        if (value == null) return
        headers.set(key, Array.isArray(value) ? value.join(', ') : String(value))
    })
    const method = nodeReq.method || 'GET'
    return new Request(`http://127.0.0.1${nodeReq.url}`, {
        method,
        headers,
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
        } catch {
            nodeRes.statusCode = 500
            nodeRes.setHeader('content-type', 'application/json; charset=utf-8')
            nodeRes.end(JSON.stringify({ error: 'gallery-dev-function-failed' }))
        }
    }
}
