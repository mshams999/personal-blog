import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import fallbackData from '../data/info.json'
import {
    fetchPosts,
    fetchAuthors,
    fetchCategories,
    fetchSiteConfig,
    mapPost,
} from '../utils/storyblokDataLoader'
import { isStoryblokEditor } from '../lib/storyblok'

const DataContext = createContext()

const FETCH_TIMEOUT_MS = 10000

const withTimeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Storyblok fetch timeout')), ms)
        ),
    ])

export const HybridDataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [authors, setAuthors] = useState(fallbackData.authors || [])
    const [categories, setCategories] = useState(fallbackData.categories || [])
    const [siteMetadata, setSiteMetadata] = useState(fallbackData.siteMetadata || {})
    const [navigation, setNavigation] = useState(fallbackData.navigation || [])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadAll = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const [postsRes, authorsRes, categoriesRes, siteConfigRes] =
                await withTimeout(
                    Promise.allSettled([
                        fetchPosts(),
                        fetchAuthors(),
                        fetchCategories(),
                        fetchSiteConfig(),
                    ]),
                    FETCH_TIMEOUT_MS
                )

            if (postsRes.status === 'fulfilled') {
                setPosts(
                    postsRes.value.sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                    )
                )
            }
            if (authorsRes.status === 'fulfilled' && authorsRes.value.length > 0) {
                setAuthors(authorsRes.value)
            }
            if (categoriesRes.status === 'fulfilled' && categoriesRes.value.length > 0) {
                setCategories(categoriesRes.value)
            }
            if (siteConfigRes.status === 'fulfilled' && siteConfigRes.value) {
                if (siteConfigRes.value.siteMetadata) {
                    setSiteMetadata(siteConfigRes.value.siteMetadata)
                }
                if (siteConfigRes.value.navigation?.length) {
                    setNavigation(siteConfigRes.value.navigation)
                }
            }
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadAll()
    }, [loadAll])

    useEffect(() => {
        if (!isStoryblokEditor() || typeof window === 'undefined') return
        const patchFromStory = (story) => {
            if (!story?.full_slug) return
            if (story.full_slug.startsWith('posts/')) {
                const mapped = mapPost(story)
                setPosts((prev) => {
                    const idx = prev.findIndex((p) => p.slug === mapped.slug)
                    if (idx === -1) return [mapped, ...prev]
                    const next = prev.slice()
                    next[idx] = { ...next[idx], ...mapped }
                    return next
                })
            }
        }
        let bridge = null
        const attach = () => {
            const Bridge = window.StoryblokBridge
            if (!Bridge) return false
            bridge = new Bridge({
                accessToken: import.meta.env.VITE_STORYBLOK_TOKEN,
            })
            bridge.on('input', (event) => patchFromStory(event?.story))
            bridge.on(['change', 'published'], () => loadAll())
            return true
        }
        if (attach()) return
        const id = setInterval(() => {
            if (attach()) clearInterval(id)
        }, 300)
        return () => clearInterval(id)
    }, [loadAll])

    const getAllPosts = useCallback(() => posts, [posts])
    const getRecentPosts = useCallback((limit = 10) => posts.slice(0, limit), [posts])
    const getFeaturedPosts = useCallback(() => posts.slice(0, 3), [posts])

    const getPostBySlug = useCallback(
        (slug) => posts.find((p) => p.slug === slug) || null,
        [posts]
    )
    const getAuthorById = useCallback(
        (id) => authors.find((a) => a.id === id) || null,
        [authors]
    )
    const getCategoryById = useCallback(
        (id) => categories.find((c) => c.id === id) || null,
        [categories]
    )
    const getCategoryBySlug = useCallback(
        (slug) => categories.find((c) => c.slug === slug) || null,
        [categories]
    )
    const getPostsByCategory = useCallback(
        (categoryId) => posts.filter((p) => p.categoryId === categoryId),
        [posts]
    )
    const getPostsByAuthor = useCallback(
        (authorId) => posts.filter((p) => p.authorId === authorId),
        [posts]
    )
    const getPostsByTag = useCallback(
        (tag) =>
            posts.filter(
                (p) =>
                    p.tags &&
                    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
            ),
        [posts]
    )
    const searchPosts = useCallback(
        (query) => {
            const q = query.toLowerCase()
            return posts.filter(
                (p) =>
                    p.title?.toLowerCase().includes(q) ||
                    p.excerpt?.toLowerCase().includes(q)
            )
        },
        [posts]
    )

    const value = {
        siteMetadata,
        navigation,
        authors,
        categories,
        posts,
        loading,
        error,
        getAllPosts,
        getRecentPosts,
        getPostBySlug,
        getAuthorById,
        getCategoryById,
        getCategoryBySlug,
        getPostsByCategory,
        getPostsByAuthor,
        getPostsByTag,
        searchPosts,
        getFeaturedPosts,
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useHybridData = () => {
    const ctx = useContext(DataContext)
    if (!ctx) {
        throw new Error('useHybridData must be used within a HybridDataProvider')
    }
    return ctx
}

export default DataContext
