import { useEffect, useState } from 'react'
import { isStoryblokEditor } from '../lib/storyblok'
import { bookReviewSlug, mapBookReview } from '../utils/bookReview'
import { fetchBookReview } from '../utils/storyblokDataLoader'

export function useBookReview(slug) {
    const [review, setReview] = useState(null)

    useEffect(() => {
        let active = true
        setReview(null)
        fetchBookReview(slug).then((result) => {
            if (active) setReview(result)
        })
        return () => {
            active = false
        }
    }, [slug])

    useEffect(() => {
        if (!slug || !isStoryblokEditor() || typeof window === 'undefined') return undefined
        let bridge = null
        const attach = () => {
            const Bridge = window.StoryblokBridge
            if (!Bridge) return false
            bridge = new Bridge({
                accessToken: import.meta.env.VITE_STORYBLOK_TOKEN,
            })
            bridge.on('input', (event) => {
                const story = event?.story
                if (!story) return
                if (story.full_slug !== bookReviewSlug(slug) && story.slug !== slug) return
                setReview(mapBookReview(story))
            })
            return true
        }
        if (attach()) return () => {}
        const id = setInterval(() => {
            if (attach()) clearInterval(id)
        }, 300)
        return () => clearInterval(id)
    }, [slug])

    return review
}
