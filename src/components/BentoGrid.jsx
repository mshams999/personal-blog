import React from 'react'
import PostCard from './PostCard'
import { useBulkArticleViews } from '../hooks/useFirebaseViews'

/**
 * BentoGrid — asymmetric 3-column magazine grid.
 *   Cell 0: large feature (col-span-2, row-span-2, image)
 *   Cell 1: standard (col-span-1, row-span-1, note)
 *   Cell 2: standard (col-span-1, row-span-1, note)
 *   Cell 3: note (col-span-1)
 *   Cell 4: note (col-span-1)
 *   Cell 5: note (col-span-1)
 *   Hairline dividers separate text-only notes visually.
 */
const BentoGrid = ({ posts = [] }) => {
    const cells = posts.slice(0, 6)
    const { getViewCount } = useBulkArticleViews(cells)

    if (cells.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-14">
            {cells.map((post, i) => {
                const isFeature = i === 0
                const isNote = i >= 3
                const variant = isFeature ? 'feature' : isNote ? 'note' : 'note'
                const spanClass = isFeature
                    ? 'md:col-span-2 md:row-span-2'
                    : 'md:col-span-1'

                return (
                    <article
                        key={post.id || post.slug}
                        className={`${spanClass} ${isNote ? 'md:border-t md:border-rule md:pt-8' : ''}`}
                    >
                        <PostCard
                            post={post}
                            variant={variant}
                            showImage={isFeature}
                            viewCount={getViewCount(post.slug)}
                        />
                    </article>
                )
            })}
        </div>
    )
}

export default BentoGrid
