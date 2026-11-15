import { isLibraryBlockedError } from '../../services/libraryGuard'

export function libraryErrorMessage(error) {
    if (isLibraryBlockedError(error)) return error.message
    return 'تعذّر تحميل المكتبة. حاول مرة أخرى.'
}

export function LibraryLoading({ label = 'جارٍ التحميل…' }) {
    return <p className="small-caps text-ink-muted">{label}</p>
}

export function LibraryEmpty({ children }) {
    return <p className="font-serif text-lg text-ink-muted">{children}</p>
}

export function LibraryError({ error, onRetry }) {
    return (
        <div className="smooth-card p-6 md:p-8">
            <p className="font-serif text-lg leading-relaxed text-ink">{libraryErrorMessage(error)}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="small-caps mt-5 text-accent hover:text-ink"
                >
                    إعادة المحاولة
                </button>
            )}
        </div>
    )
}
