import React, { useState } from 'react'
import { Check, AlertCircle, Mail, Loader2, ExternalLink } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'

/**
 * Newsletter Component with Real MailChimp Integration
 * Production-ready newsletter subscription with direct MailChimp submission
 */
const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const { trackNewsletter } = useAnalytics()

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('Please enter your email address')
            trackNewsletter('error', { error_type: 'missing_email' })
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            trackNewsletter('error', { error_type: 'invalid_email' })
            return
        }

        if (!agreeToTerms) {
            setError('Please agree to the terms and conditions')
            trackNewsletter('error', { error_type: 'missing_consent' })
            return
        }

        setError('')
        setIsLoading(true)

        try {
            // Submit directly to MailChimp with real integration
            const form = document.createElement('form')
            form.action = 'https://us10.list-manage.com/subscribe/post'
            form.method = 'POST'
            form.target = '_blank'
            form.style.display = 'none'

            // Add MailChimp required fields
            const fields = {
                'u': 'e1421120f3708e63ce15176f6',
                'id': 'da708c640f0c56b078e7c1d2f',
                'EMAIL': email,
                'FNAME': firstName.trim() || '',
                'b_e1421120f3708e63ce15176f6_da708c640f0c56b078e7c1d2f': '', // Bot protection
                'subscribe': 'Subscribe'
            }

            // Create form fields
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = name
                input.value = value
                form.appendChild(input)
            })

            // Submit to MailChimp
            document.body.appendChild(form)
            form.submit()
            document.body.removeChild(form)

            // Track successful subscription
            trackNewsletter('subscribe_success', {
                email,
                has_first_name: Boolean(firstName.trim()),
                method: 'mailchimp_production'
            })

            // Show success state
            setTimeout(() => {
                setIsLoading(false)
                setIsSubscribed(true)
                setEmail('')
                setFirstName('')
                setAgreeToTerms(false)
            }, 1000)

        } catch (error) {
            console.error('Newsletter subscription error:', error)
            setError('Unable to subscribe. Please try again.')
            setIsLoading(false)
            trackNewsletter('error', { error_type: 'submission_failed', error: error.message })
        }
    }

    if (isSubscribed) {
        return (
            <div className="bg-white dark:bg-dark-700 border-t border-gray-100 dark:border-dark-600 py-16">
                <div className="max-w-md mx-auto text-center px-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Thank You for Subscribing!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        You'll receive our latest updates and insights directly in your inbox.
                        Check your email for a confirmation message to complete your subscription.
                    </p>
                    <button
                        onClick={() => setIsSubscribed(false)}
                        className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                        Subscribe another email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-dark-700 border-t border-gray-100 dark:border-dark-600 py-16">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Stay in the Loop
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Subscribe to my newsletter for the latest insights, tutorials, and updates.
                    No spam, just valuable content delivered to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="First name (optional)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />

                    <input
                        type="email"
                        placeholder="Your email address *"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                        required
                        className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 dark:disabled:bg-primary-700 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            'Subscribe to Newsletter'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-6">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => {
                            setAgreeToTerms(e.target.checked)
                            setError('')
                        }}
                        className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                        required
                    />
                    <label htmlFor="terms" className="text-left">
                        I agree to receive newsletter emails and accept the{' '}
                        <a href="#" className="text-primary-500 hover:text-primary-600 underline">
                            terms & conditions
                        </a>
                    </label>
                </div>

                {/* Newsletter Benefits */}
                <div className="mt-8 text-left bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">What you'll get:</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            Weekly insights and tutorials
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            Early access to new content
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            Exclusive tips and resources
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            No spam, unsubscribe anytime
                        </li>
                    </ul>
                </div>

                {/* MailChimp Integration Status */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-green-900 dark:text-green-100">
                                Newsletter Status: ✅ MailChimp Connected
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Newsletter subscriptions are sent directly to MailChimp.
                                Subscribers will receive confirmation emails automatically.
                            </p>
                        </div>
                        <a
                            href="https://us10.list-manage.com/subscribe?u=e1421120f3708e63ce15176f6&id=da708c640f0c56b078e7c1d2f"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded font-medium transition-colors"
                            onClick={() => trackNewsletter('direct_signup_opened')}
                        >
                            Direct Signup
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Newsletter