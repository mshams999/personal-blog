import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MetaTags from '../components/MetaTags'
import AlbumMasonry from '../components/gallery/AlbumMasonry'
import Lightbox from '../components/gallery/Lightbox'
import { buildDeliveryUrl, galleryCloudName } from '../services/cloudinaryDelivery'
import { getPublishedAlbum, getPublishedPhoto, listAlbumPhotos, listPublishedAlbums } from '../services/galleryService'

const PAGE_SIZES = [12, 24, 36]

function photoCountLabel(count) {
    if (count === 0) return 'لا صور'
    if (count === 1) return 'صورة واحدة'
    if (count === 2) return 'صورتان'
    if (count <= 10) return `${count} صور`
    return `${count} صورة`
}

async function loadAlbumPhotos(albumId) {
    const photos = []
    let cursor = null
    do {
        const page = await listAlbumPhotos(albumId, cursor)
        photos.push(...page.photos)
        cursor = page.hasMore ? page.cursor : null
    } while (cursor)
    return photos
}

export default function GalleryAlbumPage() {
    const { albumSlug } = useParams()
    const cloudName = galleryCloudName()
    const [params, setParams] = useSearchParams()
    const [album, setAlbum] = useState(null)
    const [photos, setPhotos] = useState([])
    const [neighbors, setNeighbors] = useState({ previous: null, next: null })
    const [covers, setCovers] = useState({})
    const [status, setStatus] = useState('loading')
    const [columns, setColumns] = useState(3)
    const [pageSize, setPageSize] = useState(12)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let active = true
        setStatus('loading')
        setPage(1)
        getPublishedAlbum(albumSlug)
            .then(async (found) => {
                if (!active) return
                if (!found) {
                    setStatus('missing')
                    return
                }
                const [photoList, albumList] = await Promise.all([
                    loadAlbumPhotos(found.id),
                    listPublishedAlbums(),
                ])
                if (!active) return
                const index = albumList.findIndex((item) => item.id === found.id)
                const previous = index > 0 ? albumList[index - 1] : null
                const next = index >= 0 && index < albumList.length - 1 ? albumList[index + 1] : null
                const coverEntries = await Promise.all([previous, next].filter(Boolean).map(async (item) => {
                    if (!item.coverPhotoId) return null
                    const cover = await getPublishedPhoto(item.coverPhotoId)
                    return cover ? [item.id, cover] : null
                }))
                if (!active) return
                setAlbum(found)
                setPhotos(photoList)
                setNeighbors({ previous, next })
                setCovers(Object.fromEntries(coverEntries.filter(Boolean)))
                setStatus('ready')
            })
            .catch(() => {
                if (active) setStatus('error')
            })
        return () => {
            active = false
        }
    }, [albumSlug])

    const pageCount = Math.max(1, Math.ceil(photos.length / pageSize))
    const currentPage = Math.min(page, pageCount)
    const start = (currentPage - 1) * pageSize
    const visiblePhotos = photos.slice(start, start + pageSize)
    const from = photos.length ? start + 1 : 0
    const to = start + visiblePhotos.length

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
    const goTo = (nextPage) => setPage(Math.min(pageCount, Math.max(1, nextPage)))

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
                    <header className="mt-6 flex flex-wrap items-start justify-between gap-8 border-b border-rule pb-8">
                        <div className="min-w-0">
                            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">{album.title}</h1>
                            <p className="mt-3 font-serif text-ink-muted">{photoCountLabel(photos.length)}</p>
                            <p className="mt-2 font-serif text-sm text-ink">د. محمد شمس</p>
                        </div>
                        {album.description && (
                            <p className="max-w-md font-serif text-base leading-relaxed text-ink-muted">{album.description}</p>
                        )}
                        <div className="flex gap-4">
                            <NeighborLink album={neighbors.previous} cover={covers[neighbors.previous?.id]} cloudName={cloudName} label="السابق" />
                            <NeighborLink album={neighbors.next} cover={covers[neighbors.next?.id]} cloudName={cloudName} label="التالي" />
                        </div>
                    </header>

                    <div className="my-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2" role="group" aria-label="عدد الأعمدة">
                            <ColumnButton columns={2} current={columns} onClick={setColumns} />
                            <ColumnButton columns={3} current={columns} onClick={setColumns} />
                        </div>
                        <label className="small-caps flex items-center gap-2 text-ink-muted">
                            عرض
                            <select
                                className="border border-rule bg-paper px-2 py-1 text-ink"
                                value={pageSize}
                                aria-label="عدد الصور في الصفحة"
                                onChange={(event) => {
                                    setPageSize(Number(event.target.value))
                                    setPage(1)
                                }}
                            >
                                {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                            </select>
                        </label>
                    </div>

                    {photos.length === 0 && <p className="font-serif text-ink-muted">لا توجد صور منشورة في هذا الألبوم.</p>}
                    <AlbumMasonry
                        photos={visiblePhotos}
                        cloudName={cloudName}
                        columns={columns}
                        onOpen={(index) => openAt(start + index)}
                    />

                    {photos.length > 0 && (
                        <>
                            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="صفحات الصور">
                                <PageButton label="الأولى" disabled={currentPage === 1} onClick={() => goTo(1)} />
                                <PageButton label="السابقة" disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} />
                                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
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
                            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-rule pt-6">
                                <div className="flex gap-6">
                                    {neighbors.previous && (
                                        <Link to={`/gallery/${neighbors.previous.slug}`} className="small-caps text-ink">الألبوم السابق</Link>
                                    )}
                                    {neighbors.next && (
                                        <Link to={`/gallery/${neighbors.next.slug}`} className="small-caps text-ink">الألبوم التالي</Link>
                                    )}
                                </div>
                                <p className="font-serif text-sm text-ink-muted">
                                    الصفحة {currentPage} من {pageCount}
                                    <span className="mx-2">·</span>
                                    الصور {from}–{to} من {photos.length}
                                </p>
                            </div>
                        </>
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

function NeighborLink({ album, cover, cloudName, label }) {
    if (!album) return null
    const src = cover ? buildDeliveryUrl(cloudName, cover.publicId, 200) : ''
    return (
        <Link to={`/gallery/${album.slug}`} className="block text-center">
            <span className="mx-auto block h-14 w-14 overflow-hidden rounded-full border border-rule bg-rule/40">
                {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : null}
            </span>
            <span className="mt-2 block small-caps text-ink-muted">{label}</span>
        </Link>
    )
}

function ColumnButton({ columns, current, onClick }) {
    const active = columns === current
    return (
        <button
            type="button"
            aria-label={columns === 2 ? 'عمودان' : 'ثلاثة أعمدة'}
            aria-pressed={active}
            className={`border px-2 py-2 ${active ? 'border-ink text-ink' : 'border-rule text-ink-muted'}`}
            onClick={() => onClick(columns)}
        >
            <span className={`grid gap-0.5 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} aria-hidden="true">
                {Array.from({ length: columns }, (_, index) => (
                    <span key={index} className="block h-2.5 w-2 bg-current" />
                ))}
            </span>
        </button>
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
