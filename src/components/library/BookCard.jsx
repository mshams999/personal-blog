import { Link } from 'react-router-dom'
import { formatAuthors } from '../../utils/libraryFormat'

export default function BookCard({ book }) {
    const authors = formatAuthors(book.authors)
    return (
        <Link
            to={`/library/${book.id}`}
            className="smooth-card group flex h-full flex-col overflow-hidden"
        >
            <div className="aspect-[3/4] bg-rule/30">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-end p-4">
                        <span className="font-display text-3xl text-ink/30">{book.title?.slice(0, 1)}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h2 className="font-display text-2xl leading-snug text-ink group-hover:text-accent">
                    {book.title}
                </h2>
                {authors && <p className="mt-2 font-serif text-ink-muted">{authors}</p>}
            </div>
        </Link>
    )
}
