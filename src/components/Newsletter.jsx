import React, { useState } from 'react'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'
import newsletterService from '../services/newsletterService'
import Kicker from './editorial/Kicker'

/**
 * Editorial Newsletter
 *   Hairline-bottom input + small submit link. No pills, no gradients.
 *   Designed to sit inside the AboutStrip or standalone after a <Rule />.
 */
const Newsletter = ({ compact = false }) => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')
    const { trackNewsletter } = useAnalytics()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) {
            setError('الرجاء إدخال عنوان بريدك الإلكتروني')
            return
        }
        if (!newsletterService.isValidEmail(email)) {
            setError('الرجاء إدخال عنوان بريد إلكتروني صالح')
            return
        }
        setError('')
        setIsLoading(true)
        try {
            const result = await newsletterService.subscribe(email, '')
            if (result.success) {
                if (trackNewsletter) trackNewsletter('subscribe_success', { email, method: 'firestore' })
                setIsSubscribed(true)
                setEmail('')
            } else {
                setError(result.error || 'فشل الاشتراك. الرجاء المحاولة مرة أخرى.')
            }
        } catch {
            setError('تعذر الاشتراك. يرجى التحقق من اتصالك والمحاولة مرة أخرى.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubscribed) {
        return (
            <div className={compact ? '' : 'max-w-xl'}>
                <Kicker className="mb-2">النشرة</Kicker>
                <p className="font-display text-xl text-ink flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    شكراً لاشتراكك — أراك في أول نشرة.
                </p>
                <button
                    onClick={() => setIsSubscribed(false)}
                    className="small-caps mt-3 border-b border-rule hover:border-accent hover:text-accent transition-colors pb-0.5"
                >
                    اشتراك آخر →
                </button>
            </div>
        )
    }

    return (
        <div className={compact ? '' : 'max-w-xl'}>
            <Kicker className="mb-2">النشرة</Kicker>
            <h3 className="font-display text-2xl md:text-3xl leading-tight text-ink mb-3">
                مقالة جديدة في بريدك، كل أسبوع.
            </h3>
            <p className="font-serif text-ink-muted mb-5 leading-relaxed">
                اشترك لتصلك المقالات الجديدة فور نشرها — بدون إزعاج، ويمكنك إلغاء الاشتراك في أي وقت.
            </p>
            <form onSubmit={handleSubmit} className="flex items-end gap-4">
                <div className="flex-1">
                    <label htmlFor="nl-email" className="sr-only">البريد الإلكتروني</label>
                    <input
                        id="nl-email"
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        required
                        className="w-full bg-transparent border-0 border-b border-rule focus:border-accent outline-none py-2 font-serif text-ink placeholder:text-ink-muted/70 transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="small-caps inline-flex items-center gap-2 border-b border-ink hover:border-accent hover:text-accent transition-colors pb-0.5 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isLoading ? 'جارٍ الاشتراك' : 'اشتراك →'}
                </button>
            </form>
            {error && (
                <p className="mt-3 flex items-center gap-2 text-sm text-accent">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    )
}

export default Newsletter
