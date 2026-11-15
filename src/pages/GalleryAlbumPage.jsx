import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import SectionHeader from '../components/editorial/SectionHeader'
import Lightbox from '../components/gallery/Lightbox'
import PhotoGrid from '../components/gallery/PhotoGrid'
import { galleryCloudName } from '../services/cloudinaryDelivery'
import { getPublishedAlbum, listAlbumPhotos } from '../services/galleryService'

export default function GalleryAlbumPage() {
    const { albumSlug } = useParams()
    const cloudName = galleryCloudName()
    const [params, setParams] = useSearchParams()
    const [album, setAlbum] = useState(null)
    const [photos, setPhotos] = useState([])
    const [cursor, setCursor] = useState(null)
    const [hasMore, setHasMore] = useState(false)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        let active = true
        setStatus('loading')
        getPublishedAlbum(albumSlug)
            .then(async (found) => {
                if (!active) return
                if (!found) {
                    setStatus('missing')
                    return
                }
                const page = await listAlbumPhotos(found.id, null)
                if (!active) return
                setAlbum(found)
                setPhotos(page.photos)
                setCursor(page.cursor)
                setHasMore(page.hasMore)
                setStatus('ready')
            })
            .catch(() => {
                if (active) setStatus('error')
            })
        return () => {
            active = false
        }
    }, [albumSlug])

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
                title={album?.title || 'ألبوم'}
                description={album?.description || 'ألبوم صور.'}
                url={`https://mohamedshams.com/gallery/${albumSlug}`}
                type="website"
            />
            <Link to="/gallery" className="small-caps text-accent">المعرض</Link>
            {status === 'loading' && <p className="mt-8 font-serif text-ink-muted">جارٍ التحميل…</p>}
            {status === 'missing' && <p className="mt-8 font-serif text-ink">هذا الألبوم غير متاح.</p>}
            {status === 'error' && <p className="mt-8 font-serif text-ink">تعذّر تحميل الألبوم.</p>}
            {status === 'ready' && album && (
                <>
                    <SectionHeader as="h1" kicker="ألبوم" title={album.title} />
                    {album.description && <p className="mb-8 max-w-2xl font-serif text-lg text-ink-muted">{album.description}</p>}
                    {photos.length === 0 && <p className="font-serif text-ink-muted">لا توجد صور منشورة في هذا الألبوم.</p>}
                    <PhotoGrid photos={photos} cloudName={cloudName} onOpen={openAt} />
                    {hasMore && (
                        <button
                            type="button"
                            className="small-caps mt-8 border border-rule px-4 py-2 text-ink"
                            onClick={() => listAlbumPhotos(album.id, cursor).then((page) => {
                                setPhotos((current) => [...current, ...page.photos])
                                setCursor(page.cursor)
                                setHasMore(page.hasMore)
                            })}
                        >
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
