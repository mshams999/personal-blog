const WIDTHS = Object.freeze({
    thumb: [400, 800],
    grid: [480, 800, 1200],
    lightbox: [1600, 2400],
})

export function buildDeliveryUrl(cloudName, publicId, width) {
    const cloud = String(cloudName || '').trim()
    const id = String(publicId || '').trim()
    const pixels = Number(width)
    if (!cloud || !id || !Number.isInteger(pixels) || pixels < 1) return ''
    return `https://res.cloudinary.com/${cloud}/image/upload/f_auto/q_auto/c_limit,w_${pixels}/${id}`
}

export function buildSrcSet(cloudName, publicId, preset) {
    const widths = WIDTHS[preset] || WIDTHS.grid
    return widths
        .map((width) => {
            const url = buildDeliveryUrl(cloudName, publicId, width)
            return url ? `${url} ${width}w` : ''
        })
        .filter(Boolean)
        .join(', ')
}

export function galleryCloudName() {
    return import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
}
