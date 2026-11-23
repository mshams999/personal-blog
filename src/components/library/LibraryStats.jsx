const STATS = [
    { id: 'finished', hint: 'كتب اكتملت قراءتها' },
    { id: 'reading', hint: 'كتب بين يدي الآن' },
    { id: 'want', hint: 'كتب أنوي قراءتها' },
]

export default function LibraryStats({ books, active, onChange }) {
    const counts = { finished: 0, reading: 0, want: 0 }
    books.forEach((book) => {
        if (counts[book.readingStatus] != null) counts[book.readingStatus] += 1
    })

    return (
        <section className="mb-10" aria-label="حالة القراءة">
            <div className="grid grid-cols-1 border border-rule sm:grid-cols-3">
                {STATS.map((stat, index) => {
                    const selected = active === stat.id
                    return (
                        <button
                            key={stat.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onChange(selected ? '' : stat.id)}
                            className={`px-5 py-6 text-right transition-colors ${
                                index > 0 ? 'border-t border-rule sm:border-s sm:border-t-0' : ''
                            } ${selected ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-rule/20'}`}
                        >
                            <span className="block font-display text-4xl leading-none md:text-5xl">{counts[stat.id]}</span>
                            <span className={`mt-3 block font-serif text-sm ${selected ? 'text-paper/75' : 'text-ink-muted'}`}>{stat.hint}</span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
