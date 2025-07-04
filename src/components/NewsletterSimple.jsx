import React, { useState } from 'react'
import { Check, AlertCircle, Mail, Loader2 } from 'lucide-react'

/**
 * Newsletter Component - Simplified Version
 */
const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        if (!agreeToTerms) {
            setError('Please agree to the terms and conditions')
            return
        }

        setError('')
        setIsLoading(true)

        // Simulate subscription process
        setTimeout(() => {
            setIsLoading(false)
            setIsSubscribed(true)
            setEmail('')
            setFirstName('')
            setAgreeToTerms(false)
        }, 2000)
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
            </div>
        </div>
    )
}

export default Newsletter
