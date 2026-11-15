import { Link } from 'react-router-dom'
import { buildDeliveryUrl } from '../../services/cloudinaryDelivery'

export default function AlbumStrip({ albums, covers, cloudName }) {
    if (!albums.length) return null

    return (
        <ul className="mb-10 flex gap-4 overflow-x-auto pb-2">
            {albums.map((album) => {
                const cover = covers[album.coverPhotoId]
                const src = cover ? buildDeliveryUrl(cloudName, cover.publicId, 480) : ''
                return (
                    <li key={album.id} className="w-40 shrink-0">
                        <Link to={`/gallery/${album.slug}`} className="block">
                            <span className="block aspect-[4/5] overflow-hidden bg-rule/30">
                                {src ? (
                                    <img
                                        src={src}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </span>
                            <span className="mt-2 block font-display text-lg text-ink">{album.title}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
