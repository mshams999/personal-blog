import React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { disqusConfig, getDisqusConfig, isDisqusConfigured } from '../config/disqus'
import DisqusSetupGuide from './DisqusSetupGuide'

/**
 * DisqusComments Component
 * 
 * Renders Disqus comments for a blog post with proper configuration
 * Shows setup guide if Disqus is not configured
 * 
 * @param {Object} post - The post object containing title, slug, etc.
 * @param {string} currentUrl - Current page URL for Disqus identification
 */
const DisqusComments = ({ post, currentUrl }) => {
    // Check if Disqus is properly configured
    if (!isDisqusConfigured()) {
        return <DisqusSetupGuide />
    }

    // Generate Disqus configuration for this post
    const disqusProps = {
        shortname: disqusConfig.shortname,
        config: getDisqusConfig(post, currentUrl)
    }

    return (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Comments
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Join the conversation and share your thoughts!
                </p>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <DiscussionEmbed {...disqusProps} />
            </div>
        </div>
    )
}

export default DisqusComments
