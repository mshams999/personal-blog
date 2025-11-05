import React, { useState } from 'react'
import { Share2, X, Copy, Check } from 'lucide-react'
import {
    TwitterShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    TwitterIcon,
    FacebookIcon,
    LinkedinIcon,
    WhatsappIcon,
    TelegramIcon
} from 'react-share'
// import socialSharingUtils from '../utils/socialSharingTest'

/**
 * SocialShareButton component
 * 
 * A social share button that displays a modal with various social media sharing options
 * when clicked. Includes proper meta tag support for featured images and descriptions.
 * 
 * @param {string} url - The URL to share
 * @param {string} title - The title of the content
 * @param {string} text - Description text for sharing
 * @param {string} image - Featured image URL for social sharing
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size variant ('sm', 'md', 'lg')
 */
const SocialShareButton = ({
    url,
    title,
    text,
    image,
    className = '',
    size = 'md'
}) => {
    const [showModal, setShowModal] = useState(false)
    const [copied, setCopied] = useState(false)

    // Ensure image URL is absolute for social sharing
    const getAbsoluteImageUrl = (imageUrl) => {
        if (!imageUrl) return null
        if (imageUrl.startsWith('http')) return imageUrl
        if (imageUrl.startsWith('/')) {
            return `${window.location.origin}${imageUrl}`
        }
        return `${window.location.origin}/${imageUrl}`
    }

    const absoluteImageUrl = getAbsoluteImageUrl(image)

    // Size configurations
    const sizeConfig = {
        sm: { icon: 'h-5 w-5', button: 'p-2' },
        md: { icon: 'h-5 w-5', button: 'p-3' },
        lg: { icon: 'h-6 w-6', button: 'p-3' }
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = url
            document.body.appendChild(textArea)
            textArea.select()
            try {
                document.execCommand('copy')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err2) {
                console.error('Copy failed:', err2)
            }
            document.body.removeChild(textArea)
        }
    }

    const openModal = () => {
        setShowModal(true)
    }
    const closeModal = () => setShowModal(false)

    return (
        <>
            {/* Share Button */}
            <button
                onClick={openModal}
                className={`${sizeConfig[size].button} rounded-full bg-gray-100/90 text-gray-700 hover:bg-gray-200/90 transition-all backdrop-blur-sm dark:bg-dark-700 dark:text-white ${className}`}
                aria-label="Share post"
            >
                <Share2 className={sizeConfig[size].icon} />
            </button>

            {/* Share Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 mx-4 w-full max-w-md shadow-2xl animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Share this post
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Social Share Buttons Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Twitter */}
                            <TwitterShareButton
                                url={url}
                                title={`${title}\n\n${text}`}
                                hashtags={['blog', 'article']}
                                via="MohamedShams936"
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <TwitterIcon size={40} round />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-blue-400">
                                    Twitter
                                </span>
                            </TwitterShareButton>

                            {/* Facebook */}
                            <FacebookShareButton
                                url={url}
                                quote={`${title}\n\n${text}`}
                                hashtag="#blog"
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <FacebookIcon size={40} round />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-blue-600">
                                    Facebook
                                </span>
                            </FacebookShareButton>

                            {/* LinkedIn */}
                            <LinkedinShareButton
                                url={url}
                                title={title}
                                summary={text}
                                source="Mohamed Shams Blog"
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <LinkedinIcon size={40} round />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-blue-700">
                                    LinkedIn
                                </span>
                            </LinkedinShareButton>

                            {/* WhatsApp */}
                            <WhatsappShareButton
                                url={url}
                                title={`${title}\n\n${text}`}
                                separator=" - "
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <WhatsappIcon size={40} round />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-green-500">
                                    WhatsApp
                                </span>
                            </WhatsappShareButton>

                            {/* Telegram */}
                            <TelegramShareButton
                                url={url}
                                title={`${title}\n\n${text}`}
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <TelegramIcon size={40} round />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-blue-500">
                                    Telegram
                                </span>
                            </TelegramShareButton>

                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gray-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
                                    {copied ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Copy className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </div>
                                <span className={`text-sm font-medium mt-2 ${copied
                                        ? 'text-green-500'
                                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                                    }`}>
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </span>
                            </button>
                        </div>

                        {/* URL Preview */}
                        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Share URL:</p>
                            <p className="text-sm text-gray-900 dark:text-white font-mono truncate">
                                {url}
                            </p>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Debug Info:</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Image: {absoluteImageUrl ? '✅ Absolute URL' : '❌ No image'}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Title: {title ? '✅ Present' : '❌ Missing'}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Description: {text ? '✅ Present' : '❌ Missing'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SocialShareButton
