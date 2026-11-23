import { useEffect, useMemo, useState } from 'react'
import MetaTags from '../components/MetaTags'
import AlbumGrid from '../components/gallery/AlbumGrid'
import { galleryCloudName } from '../services/cloudinaryDelivery'
import { listPublishedAlbums, listPublishedPhotos } from '../services/galleryService'

const PAGE_SIZES = [9, 15, 30]

async function loadPublishedPhotos() {
    const photos = []
    let cursor = null
    do {
        const page = await listPublishedPhotos(cursor)
        photos.push(...page.photos)
        cursor = page.hasMore ? page.cursor : null
    } while (cursor)
    return photos
}

export default function GalleryPage() {
    const cloudName = galleryCloudName()
    const [albums, setAlbums] = useState([])
    const [photos, setPhotos] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState('')
    const [pageSize, setPageSize] = useState(15)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let active = true
        setStatus('loading')
        Promise.all([listPublishedAlbums(), loadPublishedPhotos()])
            .then(([albumList, photoList]) => {
                if (!active) return
                setAlbums(albumList)
                setPhotos(photoList)
                setStatus(albumList.length ? 'ready' : 'empty')
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

    const counts = useMemo(() => {
        const next = {}
        photos.forEach((photo) => {
            if (!photo.albumId) return
            next[photo.albumId] = (next[photo.albumId] || 0) + 1
        })
        return next
    }, [photos])

    const covers = useMemo(() => {
        const byId = Object.fromEntries(photos.map((photo) => [photo.id, photo]))
        const byAlbum = {}
        photos.forEach((photo) => {
            if (photo.albumId && !byAlbum[photo.albumId]) byAlbum[photo.albumId] = photo
        })
        return Object.fromEntries(albums.map((album) => [
            album.id,
            byId[album.coverPhotoId] || byAlbum[album.id] || null,
        ]))
    }, [albums, photos])

    const pageCount = Math.max(1, Math.ceil(albums.length / pageSize))
    const currentPage = Math.min(page, pageCount)
    const visibleAlbums = albums.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

    const goTo = (next) => setPage(Math.min(pageCount, Math.max(1, next)))

    return (
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags
                title="الألبومات"
                description="ألبومات صور محمد شمس."
                url="https://mohamedshams.com/gallery"
                type="website"
            />
            <header className="mb-8 text-center">
                <p className="small-caps text-accent">المعرض</p>
                <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">الألبومات</h1>
            </header>

            {status === 'loading' && <p className="text-center font-serif text-ink-muted">جارٍ التحميل…</p>}
            {status === 'error' && <p className="text-center font-serif text-ink">{error}</p>}
            {status === 'empty' && <p className="text-center font-serif text-ink-muted">لا توجد ألبومات منشورة بعد.</p>}

            {status === 'ready' && (
                <>
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-3">
                        <p className="small-caps border-b border-ink pb-1 text-ink">الكل</p>
                        <label className="small-caps flex items-center gap-2 text-ink-muted">
                            عرض
                            <select
                                className="border border-rule bg-paper px-2 py-1 text-ink"
                                value={pageSize}
                                aria-label="عدد الألبومات في الصفحة"
                                onChange={(event) => {
                                    setPageSize(Number(event.target.value))
                                    setPage(1)
                                }}
                            >
                                {PAGE_SIZES.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <AlbumGrid albums={visibleAlbums} covers={covers} counts={counts} cloudName={cloudName} />

                    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="صفحات الألبومات">
                        <PageButton label="الأولى" disabled={currentPage === 1} onClick={() => goTo(1)} />
                        <PageButton label="السابقة" disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} />
                        {pages.map((number) => (
                            <button
                                key={number}
                                type="button"
                                aria-current={number === currentPage ? 'page' : undefined}
                                className={`min-w-9 border px-2 py-1 font-serif ${number === currentPage ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'}`}
                                onClick={() => goTo(number)}
                            >
                                {number}
                            </button>
                        ))}
                        <PageButton label="التالية" disabled={currentPage === pageCount} onClick={() => goTo(currentPage + 1)} />
                        <PageButton label="الأخيرة" disabled={currentPage === pageCount} onClick={() => goTo(pageCount)} />
                    </nav>
                </>
            )}
        </div>
    )
}

function PageButton({ label, disabled, onClick }) {
    return (
        <button
            type="button"
            className="small-caps border border-rule px-3 py-1 text-ink disabled:opacity-40"
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    )
}
