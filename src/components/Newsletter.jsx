import React, { useState } from 'react'
import { Check, AlertCircle, Mail, Loader2, Sparkles, Heart, Bell } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'
import newsletterService from '../services/newsletterService'

/**
 * Newsletter Component - Modern Email-Only Design
 * Stores subscribers in Firestore database
 */
const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')

    const { trackNewsletter } = useAnalytics()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('Please enter your email address')
            if (trackNewsletter) trackNewsletter('error', { error_type: 'missing_email' })
            return
        }

        if (!newsletterService.isValidEmail(email)) {
            setError('Please enter a valid email address')
            if (trackNewsletter) trackNewsletter('error', { error_type: 'invalid_email' })
            return
        }

        setError('')
        setIsLoading(true)

        try {
            // Subscribe using Firestore service (no firstName needed)
            const result = await newsletterService.subscribe(email, '')

            if (result.success) {
                // Track successful subscription
                if (trackNewsletter) {
                    trackNewsletter('subscribe_success', {
                        email,
                        method: 'firestore',
                        subscriber_id: result.subscriberId
                    })
                }

                // Show success state
                setIsLoading(false)
                setIsSubscribed(true)
                setEmail('')

            } else {
                // Handle subscription errors
                setError(result.error || 'Subscription failed. Please try again.')
                setIsLoading(false)

                if (trackNewsletter) {
                    trackNewsletter('error', {
                        error_type: 'subscription_failed',
                        error_code: result.code,
                        error: result.error
                    })
                }
            }

        } catch (error) {
            console.error('Newsletter subscription error:', error)
            setError('Unable to subscribe. Please check your connection and try again.')
            setIsLoading(false)

            if (trackNewsletter) {
                trackNewsletter('error', {
                    error_type: 'network_error',
                    error: error.message
                })
            }
        }
    }

    if (isSubscribed) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 py-20">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-10 animate-ping"></div>
                </div>

                <div className="relative max-w-lg mx-auto text-center px-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Welcome Aboard!
                        </h2>
                        <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                        🎉 You're now part of an amazing community! Get ready for inspiring content,
                        exclusive insights, and valuable resources delivered straight to your inbox.
                    </p>
                    <button
                        onClick={() => setIsSubscribed(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Mail className="w-4 h-4" />
                        Subscribe Another Email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 py-24">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200 dark:bg-violet-800 rounded-full opacity-20 "></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-15 animate-ping"></div>
                <div className="absolute bottom-32 right-10 w-20 h-20 bg-pink-200 dark:bg-pink-800 rounded-full opacity-25  delay-500"></div>

                {/* Floating sparkles */}
                <div className="absolute top-1/4 left-1/3 text-yellow-400 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute top-3/4 right-1/3 text-pink-400 animate-pulse delay-700">
                    <Sparkles className="w-4 h-4" />
                </div>
                <div className="absolute top-1/2 left-1/6 text-purple-400 animate-pulse delay-300">
                    <Sparkles className="w-5 h-5" />
                </div>
            </div>

            <div className="relative max-w-2xl mx-auto text-center px-6">
                {/* Icon with glow effect */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                        <Bell className="w-12 h-12 text-white animate-pulse" />
                    </div>
                </div>

                {/* Heading with gradient text */}
                <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            Join the Adventure!
                        </span>
                    </h2>
                    <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        <span>Get exclusive insights & updates</span>
                        <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                    </div>
                </div>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-xl mx-auto">
                    🚀 Be the first to discover new content, get behind-the-scenes insights,
                    and join a community of passionate learners and creators.
                </p>

                {/* Newsletter form */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div className="relative flex bg-white dark:bg-gray-800 rounded-full p-2 shadow-2xl">
                            <input
                                type="email"
                                placeholder="Enter your email address ✨"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError('')
                                }}
                                required
                                className="flex-1 px-6 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="hidden sm:inline">Joining...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        <span className="hidden sm:inline">Join Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Error message */}
                {error && (
                    <div className="mt-6 max-w-md mx-auto">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust indicators */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>🔒 100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                        <span>📬 No Spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
                        <span>❌ Unsubscribe Anytime</span>
                    </div>
                </div>

                {/* Subtle call to action */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    By subscribing, you agree to receive occasional emails. You can unsubscribe at any time.
                </p>

                {/* Email service status (dev mode only) */}
                {import.meta.env.DEV && (
                    <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                        📧 Welcome emails ({newsletterService.getEmailServiceStatus().service}): {newsletterService.getEmailServiceStatus().configured ?
                            <span className="text-green-600 dark:text-green-400">✅ Configured</span> :
                            <span className="text-yellow-600 dark:text-yellow-400">⚠️ Not configured</span>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Newsletter