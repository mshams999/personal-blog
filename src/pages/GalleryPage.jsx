import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import SectionHeader from '../components/editorial/SectionHeader'
import AlbumStrip from '../components/gallery/AlbumStrip'
import Lightbox from '../components/gallery/Lightbox'
import PhotoGrid from '../components/gallery/PhotoGrid'
import { galleryCloudName } from '../services/cloudinaryDelivery'
import {
    getPublishedPhoto,
    listPublishedAlbums,
    listPublishedPhotos,
} from '../services/galleryService'

export default function GalleryPage() {
    const cloudName = galleryCloudName()
    const [params, setParams] = useSearchParams()
    const [albums, setAlbums] = useState([])
    const [covers, setCovers] = useState({})
    const [photos, setPhotos] = useState([])
    const [cursor, setCursor] = useState(null)
    const [hasMore, setHasMore] = useState(false)
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        setStatus('loading')
        Promise.all([listPublishedAlbums(), listPublishedPhotos(null)])
            .then(async ([albumList, page]) => {
                if (!active) return
                const coverEntries = await Promise.all(albumList.map(async (album) => {
                    if (!album.coverPhotoId) return null
                    const cover = await getPublishedPhoto(album.coverPhotoId)
                    return cover ? [album.coverPhotoId, cover] : null
                }))
                if (!active) return
                setAlbums(albumList)
                setCovers(Object.fromEntries(coverEntries.filter(Boolean)))
                setPhotos(page.photos)
                setCursor(page.cursor)
                setHasMore(page.hasMore)
                setStatus(page.photos.length || albumList.length ? 'ready' : 'empty')
            })
            .catch(() => {
                if (!active) return
                setError('تعذّر تحميل المعرض.')
                setStatus('error')
            })
        return () => {
            active = false
        }
    }, [])

    const loadMore = () => {
        listPublishedPhotos(cursor).then((page) => {
            setPhotos((current) => [...current, ...page.photos])
            setCursor(page.cursor)
            setHasMore(page.hasMore)
        }).catch(() => setError('تعذّر تحميل المزيد.'))
    }

    const openId = params.get('photo')
    const openIndex = photos.findIndex((photo) => photo.id === openId)

    const openAt = (index) => {
        const next = new URLSearchParams(params)
        next.set('photo', photos[index].id)
        setParams(next)
    }

    const close = () => {
        const next = new URLSearchParams(params)
        next.delete('photo')
        setParams(next, { replace: true })
    }

    return (
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags
                title="المعرض"
                description="صور محمد شمس."
                url="https://mohamedshams.com/gallery"
                type="website"
            />
            <SectionHeader as="h1" kicker="الصور" title="المعرض" />
            {status === 'loading' && <p className="font-serif text-ink-muted">جارٍ التحميل…</p>}
            {status === 'error' && <p className="font-serif text-ink">{error}</p>}
            {status === 'empty' && <p className="font-serif text-ink-muted">لا توجد صور منشورة بعد.</p>}
            {status === 'ready' && (
                <>
                    <AlbumStrip albums={albums} covers={covers} cloudName={cloudName} />
                    <PhotoGrid photos={photos} cloudName={cloudName} onOpen={openAt} />
                    {hasMore && (
                        <button type="button" className="small-caps mt-8 border border-rule px-4 py-2 text-ink" onClick={loadMore}>
                            المزيد
                        </button>
                    )}
                </>
            )}
            <Lightbox
                photos={photos}
                index={openIndex}
                cloudName={cloudName}
                onClose={close}
                onIndex={openAt}
            />
        </div>
    )
}
