import { useEffect, useRef } from 'react'
import { buildDeliveryUrl, buildSrcSet } from '../../services/cloudinaryDelivery'

function formatTaken(value) {
    const date = value?.toDate?.() || (typeof value === 'string' ? new Date(value) : null)
    if (!date || Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('ar')
}

export default function Lightbox({ photos, index, cloudName, onClose, onIndex }) {
    const dialogRef = useRef(null)
    const startX = useRef(null)
    const photo = index == null || index < 0 ? null : photos[index]

    useEffect(() => {
        const node = dialogRef.current
        if (!node) return undefined
        if (photo && !node.open) node.showModal()
        if (!photo && node.open) node.close()
        return undefined
    }, [photo])

    useEffect(() => {
        if (!photo) return undefined
        const neighbor = photos[index + 1] || photos[index - 1]
        if (!neighbor) return undefined
        const image = new Image()
        image.src = buildDeliveryUrl(cloudName, neighbor.publicId, 1600)
        return undefined
    }, [cloudName, index, photo, photos])

    const src = photo ? buildDeliveryUrl(cloudName, photo.publicId, 1600) : ''
    const meta = [formatTaken(photo?.takenAt), photo?.location].filter(Boolean).join(' · ')

    const move = (direction) => {
        const next = index + direction
        if (next >= 0 && next < photos.length) onIndex(next)
    }

    return (
        <dialog
            ref={dialogRef}
            className="h-screen w-screen max-h-none max-w-none border-0 bg-transparent p-0 text-paper backdrop:bg-black/80"
            aria-label="عرض الصورة"
            onCancel={(event) => {
                event.preventDefault()
                onClose()
            }}
            onClick={(event) => {
                if (event.target === dialogRef.current) onClose()
            }}
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault()
                    move(-1)
                }
                if (event.key === 'ArrowRight') {
                    event.preventDefault()
                    move(1)
                }
            }}
        >
            {photo && (
                <div
                    className="flex h-full flex-col"
                    onPointerDown={(event) => {
                        startX.current = event.clientX
                    }}
                    onPointerUp={(event) => {
                        if (startX.current == null) return
                        const delta = event.clientX - startX.current
                        if (delta > 48) move(-1)
                        if (delta < -48) move(1)
                        startX.current = null
                    }}
                >
                    <div className="flex items-center justify-between px-4 py-3 text-paper">
                        <button type="button" className="small-caps" onClick={onClose}>إغلاق</button>
                        <span className="font-serif text-sm">{index + 1} / {photos.length}</span>
                    </div>
                    <div className="flex min-h-0 flex-1 items-center justify-center gap-3 px-3" dir="ltr">
                        <button type="button" className="hidden px-3 py-6 font-display text-2xl text-paper sm:block" onClick={() => move(-1)} disabled={index === 0} aria-label="السابق">‹</button>
                        <img
                            src={src}
                            srcSet={buildSrcSet(cloudName, photo.publicId, 'lightbox')}
                            sizes="100vw"
                            alt={photo.caption || 'صورة'}
                            className="max-h-full max-w-full object-contain"
                        />
                        <button type="button" className="hidden px-3 py-6 font-display text-2xl text-paper sm:block" onClick={() => move(1)} disabled={index === photos.length - 1} aria-label="التالي">›</button>
                    </div>
                    <div className="px-4 py-4 text-center">
                        {photo.caption && <p className="font-serif text-lg text-paper">{photo.caption}</p>}
                        {photo.description && <p className="mt-1 font-serif text-sm text-paper/80">{photo.description}</p>}
                        {meta && <p className="mt-2 small-caps text-paper/70">{meta}</p>}
                        <div className="mt-4 flex justify-center gap-6 sm:hidden" dir="ltr">
                            <button type="button" className="small-caps" onClick={() => move(-1)} disabled={index === 0}>السابق</button>
                            <button type="button" className="small-caps" onClick={() => move(1)} disabled={index === photos.length - 1}>التالي</button>
                        </div>
                    </div>
                </div>
            )}
        </dialog>
    )
}
