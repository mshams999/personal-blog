import { Link } from 'react-router-dom'
import { buildDeliveryUrl } from '../../services/cloudinaryDelivery'

function photoCountLabel(count) {
    if (count === 0) return 'لا صور'
    if (count === 1) return 'صورة واحدة'
    if (count === 2) return 'صورتان'
    if (count <= 10) return `${count} صور`
    return `${count} صورة`
}

export default function AlbumGrid({ albums, covers, counts, cloudName }) {
    if (!albums.length) return null

    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => {
                const cover = covers[album.id]
                const src = cover ? buildDeliveryUrl(cloudName, cover.publicId, 800) : ''
                return (
                    <li key={album.id}>
                        <Link to={`/gallery/${album.slug}`} className="group relative block overflow-hidden bg-ink">
                            <span className="block aspect-[3/4] overflow-hidden">
                                {src ? (
                                    <img
                                        src={src}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="block h-full w-full bg-ink" />
                                )}
                            </span>
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-16 text-white">
                                <span className="block font-display text-2xl leading-tight">{album.title}</span>
                                <span className="mt-1 block font-serif text-sm text-white/75">{photoCountLabel(counts[album.id] || 0)}</span>
                            </span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
