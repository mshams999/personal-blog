export default function BookProgress({ progress }) {
    if (!progress || typeof progress.percent !== 'number') return null
    const percent = Math.max(0, Math.min(100, Math.round(progress.percent)))
    const pages = typeof progress.currentPage === 'number' && typeof progress.pageCount === 'number' && progress.pageCount > 0
        ? `${progress.currentPage} / ${progress.pageCount}`
        : null

    return (
        <div>
            <div className="h-1 w-full bg-rule" aria-hidden="true">
                <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
            </div>
            <p className="small-caps mt-2 text-ink-muted">
                {percent}%
                {pages ? ` · ${pages}` : ''}
            </p>
        </div>
    )
}
