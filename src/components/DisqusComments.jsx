import React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'

const DisqusComments = ({ post, currentUrl }) => {

    if (!isDisqusConfigured()) {
        return (
            <section className="mt-16 pt-8 border-t border-rule">
                <p className="kicker mb-2">تعليقات</p>
                <p className="font-serif text-ink-muted">
                    نظام التعليقات غير مُعد حالياً.
                </p>
            </section>
        )
    }

    const disqusProps = {
        shortname: disqusConfig.shortname,
        config: getDisqusConfig(post, currentUrl)
    }

    return (
        <section className="mt-16 pt-8 border-t border-rule" aria-label="التعليقات">
            <div className="mb-6">
                <p className="kicker mb-2">حوار</p>
                <h3 className="font-display text-display-lg text-ink leading-tight">التعليقات</h3>
            </div>
            <DiscussionEmbed {...disqusProps} />
        </section>
    )
}

export default DisqusComments
