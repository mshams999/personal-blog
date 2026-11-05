import React, { useState } from 'react'
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react'

/**
 * ShareRail — sticky vertical stack of plain share icons with a hairline
 * connector. Replaces the old SocialShareButton modal. Intended to be
 * placed as a fixed-position sibling of the article on lg+ screens.
 *   - LTR: hugs the left edge
 *   - RTL: auto-mirrors (uses logical `start-*` offsets from parent)
 *   - Mobile: falls back to an inline horizontal row (via `inline` prop).
 */
const ShareRail = ({ url, title, inline = false }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* ignore */
        }
    }

    const encoded = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title || '')

    const items = [
        {
            key: 'twitter',
            Icon: Twitter,
            label: 'مشاركة عبر تويتر',
            href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
        },
        {
            key: 'linkedin',
            Icon: Linkedin,
            label: 'مشاركة عبر لينكدإن',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
        },
        {
            key: 'facebook',
            Icon: Facebook,
            label: 'مشاركة عبر فيسبوك',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
        },
    ]

    if (inline) {
        return (
            <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-display text-xl text-ink">شارك المقال</p>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 border border-rule px-3 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                        {copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}
                    </button>
                    {items.map(({ key, Icon, label, href }) => (
                        <a
                            key={key}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="inline-flex h-10 w-10 items-center justify-center border border-rule text-ink-muted transition-colors hover:border-accent hover:text-accent"
                        >
                            <Icon className="h-4 w-4" />
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div
            className="relative flex flex-col items-center gap-5 py-4"
            role="complementary"
            aria-label="مشاركة المقال"
        >
            <span className="absolute top-0 bottom-0 start-1/2 -translate-x-px w-px bg-rule" aria-hidden="true" />
            {items.map(({ key, Icon, label, href }) => (
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="relative z-10 bg-paper p-2 text-ink-muted hover:text-accent transition-colors"
                >
                    <Icon className="w-4 h-4" />
                </a>
            ))}
            <button
                type="button"
                onClick={handleCopy}
                aria-label="نسخ الرابط"
                className="relative z-10 bg-paper p-2 text-ink-muted hover:text-accent transition-colors"
            >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>
        </div>
    )
}

export default ShareRail
