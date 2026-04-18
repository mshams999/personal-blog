import React from 'react'
import { Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import { formatDateArabicShort } from '../utils/dateFormat'
import { formatViewCount } from '../hooks/useFirebaseViews'
import Kicker from './editorial/Kicker'

/**
 * Editorial PostCard
 *   variant: 'feature'  — large hero card, full-bleed image + kicker + display headline + standfirst
 *   variant: 'standard' — image-left / text-right row, hairline separator above
 *   variant: 'note'     — text-only card (kicker + headline + meta), for bento small cells / related
 */
const PostCard = ({ post, variant = 'standard', showImage = true, viewCount = 0, className = '' }) => {
    const { getCategoryById } = useHybridData()
    const category = getCategoryById(post.categoryId)
    const formattedDate = formatDateArabicShort(post.date)

    const isNew = post.date && new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const Meta = () => (
        <p className="small-caps text-ink-muted">
            {formattedDate}
            {post.readTime ? <span className="mx-1.5">·</span> : null}
            {post.readTime ? <>{post.readTime} دقيقة قراءة</> : null}
            {viewCount > 0 ? <><span className="mx-1.5">·</span>{formatViewCount(viewCount)} قراءة</> : null}
        </p>
    )

    if (variant === 'feature') {
        return (
            <Link
                to={`/post/${post.slug}`}
                className={`group block smooth-card smooth-card-interactive p-4 md:p-5 ${className}`}
                aria-label={post.title}
            >
                {showImage && post.featuredImage && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-rule/40 mb-6 rounded-xl border border-rule">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            onError={(e) => { e.target.style.opacity = '0' }}
                        />
                    </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                    {category && <Kicker>{category.name}</Kicker>}
                    {isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" aria-label="جديد" />}
                </div>
                <h2 className="font-display text-display-lg md:text-display-xl leading-tight text-ink group-hover:text-accent transition-colors mb-4">
                    {post.title}
                </h2>
                <p className="font-serif text-lg text-ink-muted leading-relaxed max-w-prose-editorial mb-5 line-clamp-3">
                    {post.excerpt}
                </p>
                <Meta />
            </Link>
        )
    }

    if (variant === 'note') {
        return (
            <Link
                to={`/post/${post.slug}`}
                className={`group block smooth-card smooth-card-interactive p-4 md:p-5 ${className}`}
                aria-label={post.title}
            >
                <div className="flex items-center gap-3 mb-2">
                    {category && <Kicker>{category.name}</Kicker>}
                    {isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <h3 className="font-display text-xl md:text-2xl leading-snug text-ink group-hover:text-accent transition-colors mb-2 line-clamp-3">
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className="font-serif text-ink-muted leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                    </p>
                )}
                <Meta />
            </Link>
        )
    }

    // standard: row with image-left on md:, text-right
    return (
        <Link
            to={`/post/${post.slug}`}
            className={`group grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-8 items-start smooth-card smooth-card-interactive p-4 md:p-5 ${className}`}
            aria-label={post.title}
        >
            {showImage && post.featuredImage && (
                <div className="relative aspect-[4/3] overflow-hidden bg-rule/40 rounded-xl border border-rule">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        onError={(e) => { e.target.style.opacity = '0' }}
                    />
                </div>
            )}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    {category && <Kicker>{category.name}</Kicker>}
                    {isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight text-ink group-hover:text-accent transition-colors mb-3">
                    {post.title}
                </h3>
                <p className="font-serif text-ink-muted leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                </p>
                <Meta />
            </div>
        </Link>
    )
}

export default PostCard
