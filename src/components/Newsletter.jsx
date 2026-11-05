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
                    وصلت. أول مقالة جديدة هتوصلك على بريدك.
                </p>
            </div>
        )
    }

    return (
        <div className={compact ? '' : 'max-w-xl'}>
            <Kicker className="mb-2">النشرة</Kicker>
            <h3 className="font-display text-2xl md:text-3xl leading-tight text-ink">
                مقالة جديدة، تصلك قبل ما تضيع.
            </h3>
            <form onSubmit={handleSubmit} className="mt-5">
                <label htmlFor="nl-email" className="mb-2 block text-sm text-ink-muted">
                    بريدك الإلكتروني
                </label>
                <div className="flex items-stretch border border-rule">
                    <input
                        id="nl-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        required
                        className="min-w-0 flex-1 bg-transparent px-4 py-3 font-serif text-ink outline-none placeholder:text-ink-muted/60"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex shrink-0 items-center gap-2 bg-ink px-5 text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'جارٍ الإرسال' : 'اشترك'}
                    </button>
                </div>
            </form>
            <p className="mt-3 text-sm text-ink-muted">
                رسالة واحدة في الأسبوع. ألغِ الاشتراك متى شئت.
            </p>
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
