import { buildDeliveryUrl, buildSrcSet } from '../../services/cloudinaryDelivery'

export default function AlbumMasonry({ photos, cloudName, columns, onOpen }) {
    if (!photos.length) return null
    const columnClass = columns === 2
        ? 'columns-1 gap-3 sm:columns-2'
        : 'columns-1 gap-3 sm:columns-2 lg:columns-3'

    return (
        <ul className={columnClass}>
            {photos.map((photo, index) => {
                const alt = photo.caption || photo.location || 'صورة'
                const src = buildDeliveryUrl(cloudName, photo.publicId, 800)
                const ratio = photo.width > 0 && photo.height > 0 ? `${photo.width} / ${photo.height}` : undefined
                return (
                    <li key={photo.id} className="mb-3 break-inside-avoid">
                        <button
                            type="button"
                            className="block w-full overflow-hidden bg-rule/30"
                            onClick={() => onOpen(index)}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    srcSet={buildSrcSet(cloudName, photo.publicId, 'grid')}
                                    sizes={columns === 2 ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                                    alt={alt}
                                    width={photo.width || undefined}
                                    height={photo.height || undefined}
                                    style={ratio ? { aspectRatio: ratio } : undefined}
                                    loading={index < 6 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="h-auto w-full object-cover transition duration-500 hover:brightness-110"
                                />
                            ) : (
                                <span className="flex aspect-[3/4] items-center justify-center px-3 font-serif text-sm text-ink-muted">{alt}</span>
                            )}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
