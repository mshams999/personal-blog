import React from 'react'

// Drop cap is a Latin/LTR typographic tradition — Arabic doesn't use it.
// Pass `locale="ar"` or let the consumer check `dir`; in RTL this renders as a no-op wrapper.
export default function DropCap({ children, locale, className = '' }) {
    const isRTL = locale === 'ar' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl')
    if (isRTL) {
        return <p className={className}>{children}</p>
    }
    return <p className={`drop-cap drop-cap-fade ${className}`}>{children}</p>
}
