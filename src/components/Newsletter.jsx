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
      setError('الرجاء إدخال عنوان بريدك الإلكتروني')
      if (trackNewsletter) trackNewsletter('error', { error_type: 'missing_email' })
      return
    }

    if (!newsletterService.isValidEmail(email)) {
      setError('الرجاء إدخال عنوان بريد إلكتروني صالح')
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
        setError(result.error || 'فشل الاشتراك. الرجاء المحاولة مرة أخرى.')
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
      setError('تعذر الاشتراك. يرجى التحقق من اتصالك والمحاولة مرة أخرى.')
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
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 py-12">
        <div className="relative max-w-lg mx-auto text-center px-6">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
            مرحباً بك معنا!
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
            🎉 أنت الآن جزء من مجتمع رائع!
          </p>
          <button
            onClick={() => setIsSubscribed(false)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Mail className="w-4 h-4" />
            اشتراك آخر
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 py-16">
      <div className="relative max-w-xl mx-auto text-center px-6">
        {/* Icon with glow effect */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-md opacity-60"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading with gradient text */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              جاهز تنضم لعالم الأفكار؟
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            اشترك لتكون أول من يطّلع على المقالات الجديدة.
          </p>
        </div>

        {/* Newsletter form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative flex bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                required
                className="flex-1 px-5 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full font-semibold transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">جارٍ الانضمام...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span className="hidden sm:inline">انضم الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>بدون بريد مزعج</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>إلغاء الاشتراك في أي وقت</span>
          </div>
        </div>

        {/* Subtle call to action */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          لا سبام. لا إزعاج. فقط محتوى يستحق القراءة.
        </p>

        {/* Email service status (dev mode only) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
            📧 رسائل الترحيب ({newsletterService.getEmailServiceStatus().service}): {newsletterService.getEmailServiceStatus().configured ?
              <span className="text-green-600 dark:text-green-400">✅ مُهيأ</span> :
              <span className="text-yellow-600 dark:text-yellow-400">⚠️ غير مُهيأ</span>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter