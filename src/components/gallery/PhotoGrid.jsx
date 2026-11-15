import { buildDeliveryUrl, buildSrcSet } from '../../services/cloudinaryDelivery'

export default function PhotoGrid({ photos, cloudName, onOpen }) {
    if (!photos.length) return null

    return (
        <ul className="grid grid-cols-3 gap-1 sm:gap-1.5">
            {photos.map((photo, index) => {
                const alt = photo.caption || photo.location || 'صورة'
                const src = buildDeliveryUrl(cloudName, photo.publicId, 800)
                return (
                    <li key={photo.id}>
                        <button
                            type="button"
                            className="block aspect-square w-full overflow-hidden bg-rule/30"
                            onClick={() => onOpen(index)}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    srcSet={buildSrcSet(cloudName, photo.publicId, 'grid')}
                                    sizes="(min-width: 1024px) 33vw, 33vw"
                                    alt={alt}
                                    width={photo.width || 800}
                                    height={photo.height || 800}
                                    loading={index < 6 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="flex h-full items-center justify-center px-2 font-serif text-sm text-ink-muted">{alt}</span>
                            )}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
