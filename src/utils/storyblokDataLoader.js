import { getStoryblokApi, storyblokVersion } from '../lib/storyblok'

const api = () => getStoryblokApi()

const resolveAssetUrl = (asset) => {
    if (!asset) return null
    if (typeof asset === 'string') return asset
    return asset.filename || asset.url || null
}

export const mapPost = (story) => {
    const c = story.content || {}
    const authorRef = c.author
    const categoryRef = c.category
    const authorId =
        (typeof authorRef === 'object' && (authorRef?.slug || authorRef?.uuid)) ||
        (typeof authorRef === 'string' ? authorRef : null) ||
        c.authorId ||
        null
    const categoryId =
        (typeof categoryRef === 'object' && (categoryRef?.slug || categoryRef?.uuid)) ||
        (typeof categoryRef === 'string' ? categoryRef : null) ||
        c.categoryId ||
        null

    const tags = Array.isArray(c.tags)
        ? c.tags
        : typeof c.tags === 'string' && c.tags.length > 0
            ? c.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []

    const slug =
        c.slug ||
        story.slug ||
        (story.full_slug ? story.full_slug.replace(/^posts\//, '') : '')

    return {
        id: story.uuid || String(story.id),
        slug,
        title: c.title || story.name,
        excerpt: c.excerpt || '',
        date: c.date || story.first_published_at || story.created_at,
        readTime: Number(c.read_time) || Number(c.readTime) || 5,
        featuredImage: resolveAssetUrl(c.featured_image || c.featuredImage),
        authorId,
        categoryId,
        tags,
        body: c.body || null,
        seo: {
            metaTitle: c.seo_meta_title || c.seo?.metaTitle || '',
            metaDescription: c.seo_meta_description || c.seo?.metaDescription || '',
        },
        _source: 'storyblok',
    }
}

const mapAuthor = (story) => {
    const c = story.content || {}
    return {
        id: story.slug,
        name: c.name || story.name,
        avatar: resolveAssetUrl(c.avatar) || '/pictures/about-me.jpg',
        bio: c.bio || '',
        social: {
            github: c.social_github || '',
            linkedin: c.social_linkedin || '',
            twitter: c.social_twitter || '',
            facebook: c.social_facebook || '',
            email: c.email || '',
        },
    }
}

const mapCategory = (story) => {
    const c = story.content || {}
    return {
        id: story.slug,
        name: c.name || story.name,
        slug: c.slug || story.slug,
        description: c.description || '',
    }
}

const mapSiteConfig = (story) => {
    const c = story.content || {}
    const navigation = Array.isArray(c.navigation)
        ? c.navigation.map((n) => ({ name: n.name, href: n.href }))
        : []
    return {
        siteMetadata: {
            title: c.site_title || '',
            description: c.site_description || '',
            author: {
                name: c.author_name || '',
                summary: c.author_summary || '',
            },
            social: {
                twitter: c.social_twitter || '',
                facebook: c.social_facebook || '',
                github: c.social_github || '',
            },
        },
        navigation,
    }
}

export const fetchPosts = async () => {
    const { data } = await api().get('cdn/stories', {
        starts_with: 'posts/',
        version: storyblokVersion,
        per_page: 100,
        sort_by: 'content.date:desc',
        resolve_relations: 'post.author,post.category',
    })
    return (data?.stories || []).map(mapPost)
}

export const fetchPostBySlug = async (slug) => {
    const { data } = await api().get(`cdn/stories/posts/${slug}`, {
        version: storyblokVersion,
        resolve_relations: 'post.author,post.category',
    })
    return data?.story ? mapPost(data.story) : null
}

export const fetchAuthors = async () => {
    const { data } = await api().get('cdn/stories', {
        starts_with: 'authors/',
        version: storyblokVersion,
        per_page: 100,
    })
    return (data?.stories || []).map(mapAuthor)
}

export const fetchCategories = async () => {
    const { data } = await api().get('cdn/stories', {
        starts_with: 'categories/',
        version: storyblokVersion,
        per_page: 100,
    })
    return (data?.stories || []).map(mapCategory)
}

export const fetchSiteConfig = async () => {
    const { data } = await api().get('cdn/stories/site-config', {
        version: storyblokVersion,
    })
    return data?.story ? mapSiteConfig(data.story) : null
}

export const fetchPage = async (slug) => {
    const { data } = await api().get(`cdn/stories/pages/${slug}`, {
        version: storyblokVersion,
    })
    if (!data?.story) return null
    const c = data.story.content || {}
    return {
        id: data.story.uuid,
        slug: data.story.slug,
        title: c.title || data.story.name,
        body: c.body || null,
        blocks: Array.isArray(c.blocks) ? c.blocks : [],
        raw: data.story,
    }
}
