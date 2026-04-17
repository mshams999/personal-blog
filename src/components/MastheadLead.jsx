import React from 'react'
import { Link } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'
import { formatDateArabicShort } from '../utils/dateFormat'
import Kicker from './editorial/Kicker'

/**
 * MastheadLead — the top-of-page editorial "above-the-fold" block.
 *   Asymmetric bento: 3/5 text column, 2/5 tall image column.
 *   The single most recent (or explicitly passed) post gets full dramatic
 *   display-2xl treatment with kicker, headline, standfirst, byline.
 */
const MastheadLead = ({ post }) => {
    const { getCategoryById, getAuthorById } = useHybridData()
    if (!post) return null

    const category = getCategoryById(post.categoryId)
    const author = getAuthorById(post.authorId)
    const formattedDate = formatDateArabicShort(post.date)

    return (
        <section className="reveal-up">
            <Link to={`/post/${post.slug}`} className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
                    {/* Text column */}
                    <div className="lg:col-span-3 flex flex-col justify-center order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-5">
                            {category && <Kicker>{category.name}</Kicker>}
                            <span className="small-caps text-ink-muted">قصة الغلاف</span>
                        </div>
                        <h1 className="font-display text-display-xl md:text-display-2xl leading-[1.05] text-ink group-hover:text-accent transition-colors mb-6">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="font-serif text-lg md:text-xl text-ink-muted leading-relaxed max-w-prose-editorial mb-6 line-clamp-4">
                                {post.excerpt}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            {author?.avatar && (
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="w-10 h-10 rounded-full object-cover border border-rule"
                                    loading="lazy"
                                />
                            )}
                            <div>
                                <p className="font-display text-ink">{author?.name || 'د. محمد شمس'}</p>
                                <p className="small-caps text-ink-muted">
                                    {formattedDate}
                                    {post.readTime ? <><span className="mx-1.5">·</span>{post.readTime} دقيقة</> : null}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image column */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        {post.featuredImage ? (
                            <div className="relative aspect-[4/5] overflow-hidden bg-rule/40 h-full">
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    loading="eager"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[4/5] bg-rule/30 border border-rule" />
                        )}
                    </div>
                </div>
            </Link>
        </section>
    )
}

export default MastheadLead
