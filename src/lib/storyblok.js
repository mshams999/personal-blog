import { storyblokInit, apiPlugin, getStoryblokApi } from '@storyblok/react'

const accessToken = import.meta.env.VITE_STORYBLOK_TOKEN
const region = import.meta.env.VITE_STORYBLOK_REGION || 'eu'

if (!accessToken) {
    // eslint-disable-next-line no-console
    console.warn(
        '[storyblok] VITE_STORYBLOK_TOKEN is not set — content fetches will fail. Add it to .env.'
    )
}

storyblokInit({
    accessToken,
    use: [apiPlugin],
    apiOptions: { region },
})

export const storyblokVersion = import.meta.env.DEV ? 'draft' : 'published'

export const isStoryblokEditor = () => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).has('_storyblok')
}

export { getStoryblokApi }
