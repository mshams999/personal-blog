import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import { galleryCloudName } from '../../services/cloudinaryDelivery'
import {
    createAlbum,
    deleteArchivedAlbum,
    listAdminAlbums,
    listAdminPhotos,
    reorderPhotos,
    setAlbumStatus,
    updateAlbum,
} from '../../services/galleryService'
import { isAlbumSlug, slugifyAlbumTitle } from '../../services/galleryValidation'
import { previewUrl } from '../../services/galleryUpload'

const fieldClass = 'w-full border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent'

export default function GalleryAlbumsPage() {
    const cloudName = galleryCloudName()
    const [albums, setAlbums] = useState([])
    const [photos, setPhotos] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [order, setOrder] = useState([])
    const [dragging, setDragging] = useState('')
    const [form, setForm] = useState({ title: '', description: '', coverPhotoId: '' })
    const [draft, setDraft] = useState({ title: '', slug: '', description: '' })
    const [confirmText, setConfirmText] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const load = () => {
        Promise.all([listAdminAlbums(), listAdminPhotos()])
            .then(([albumList, photoList]) => {
                setAlbums(albumList)
                setPhotos(photoList)
            })
            .catch((loadError) => setError(loadError.message || 'تعذّر تحميل الألبومات.'))
    }

    useEffect(() => { load() }, [])

    useEffect(() => {
        if (!selectedId) return
        setOrder(
            photos
                .filter((photo) => photo.albumId === selectedId)
                .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
                .map((photo) => photo.id),
        )
    }, [photos, selectedId])

    const selected = albums.find((album) => album.id === selectedId) || null
    const albumPhotos = order
        .map((id) => photos.find((photo) => photo.id === id))
        .filter(Boolean)

    const choose = (album) => {
        setSelectedId(album.id)
        setConfirmText('')
        setForm({
            title: album.title || '',
            description: album.description || '',
            coverPhotoId: album.coverPhotoId || '',
        })
    }

    const create = async (event) => {
        event.preventDefault()
        setError('')
        const slug = slugifyAlbumTitle(draft.slug || draft.title)
        if (!isAlbumSlug(slug)) {
            setError('اكتب اسماً لاتينياً قصيراً للألبوم، مثل cairo-nights.')
            return
        }
        try {
            await createAlbum(slug, draft)
            setDraft({ title: '', slug: '', description: '' })
            setMessage('أُنشئ الألبوم كمسودة.')
            load()
        } catch (createError) {
            setError(createError.message || 'تعذّر إنشاء الألبوم.')
        }
    }

    const save = async () => {
        setError('')
        try {
            await updateAlbum(selected.id, { ...form, sortOrder: selected.sortOrder })
            if (order.length) await reorderPhotos(order)
            setMessage('حُفظ الألبوم.')
            load()
        } catch (saveError) {
            setError(saveError.message || 'تعذّر الحفظ.')
        }
    }

    const move = (id, direction) => {
        setOrder((current) => {
            const next = [...current]
            const index = next.indexOf(id)
            const target = index + direction
            if (index < 0 || target < 0 || target >= next.length) return current
            const [item] = next.splice(index, 1)
            next.splice(target, 0, item)
            return next
        })
    }

    const remove = async () => {
        if (confirmText !== 'حذف' || selected.status !== 'archived') return
        try {
            await deleteArchivedAlbum(selected.id)
            setSelectedId('')
            setMessage('حُذف الألبوم. الصور نفسها بقيت في المعرض.')
            load()
        } catch (removeError) {
            setError(removeError.message || 'تعذّر حذف الألبوم.')
        }
    }

    return (
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags title="ألبومات الصور" description="إدارة ألبومات المعرض." url="https://mohamedshams.com/admin/gallery/albums" type="website" />
            <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeader as="h1" kicker="المعرض" title="الألبومات" className="mb-0" />
                <Link to="/admin/gallery" className="small-caps text-accent">الصور</Link>
            </div>
            {message && <p className="mt-6 font-serif text-ink">{message}</p>}
            {error && <p className="mt-6 font-serif text-ink">{error}</p>}

            <form className="mt-8 grid gap-4 border border-rule p-4" onSubmit={create}>
                <h2 className="font-display text-2xl text-ink">ألبوم جديد</h2>
                <input className={fieldClass} placeholder="العنوان" aria-label="عنوان الألبوم" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
                <input className={fieldClass} placeholder="cairo-nights" aria-label="اسم الرابط" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
                <textarea className={fieldClass} rows="3" placeholder="وصف قصير" aria-label="وصف الألبوم" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
                <button type="submit" className="small-caps justify-self-start border border-ink px-4 py-2">إنشاء</button>
            </form>

            <ul className="mt-8 divide-y divide-rule border-y border-rule">
                {albums.map((album) => (
                    <li key={album.id}>
                        <button type="button" className="flex w-full items-center justify-between py-4 text-start" onClick={() => choose(album)}>
                            <span className="font-display text-2xl text-ink">{album.title}</span>
                            <span className="font-serif text-sm text-ink-muted">{album.status === 'published' ? 'منشور' : album.status === 'archived' ? 'مؤرشف' : 'مسودة'}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {selected && (
                <section className="mt-10 space-y-4">
                    <h2 className="font-display text-3xl text-ink">{selected.title}</h2>
                    <p className="font-serif text-ink-muted">الرابط ثابت: /gallery/{selected.slug}</p>
                    <input className={fieldClass} aria-label="تعديل العنوان" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                    <textarea className={fieldClass} rows="3" aria-label="تعديل الوصف" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                    <label className="block font-serif text-ink">الغلاف
                        <select className={`${fieldClass} mt-1`} value={form.coverPhotoId} onChange={(event) => setForm({ ...form, coverPhotoId: event.target.value })}>
                            <option value="">بدون غلاف</option>
                            {albumPhotos.map((photo) => (
                                <option key={photo.id} value={photo.id}>{photo.caption || photo.id}</option>
                            ))}
                        </select>
                    </label>
                    <ul className="space-y-2">
                        {albumPhotos.map((photo) => (
                            <li
                                key={photo.id}
                                draggable
                                onDragStart={() => setDragging(photo.id)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={() => {
                                    if (!dragging || dragging === photo.id) return
                                    setOrder((current) => {
                                        const next = current.filter((id) => id !== dragging)
                                        const index = next.indexOf(photo.id)
                                        next.splice(index, 0, dragging)
                                        return next
                                    })
                                    setDragging('')
                                }}
                                className="flex items-center gap-3 border border-rule p-2"
                            >
                                <span className="h-14 w-14 shrink-0 bg-rule/30">
                                    {previewUrl(cloudName, photo.publicId) && <img src={previewUrl(cloudName, photo.publicId)} alt="" className="h-full w-full object-cover" />}
                                </span>
                                <span className="min-w-0 flex-1 truncate font-serif text-ink">{photo.caption || 'بدون تعليق'}</span>
                                <button type="button" className="small-caps" onClick={() => move(photo.id, -1)} aria-label="تحريك لأعلى">أعلى</button>
                                <button type="button" className="small-caps" onClick={() => move(photo.id, 1)} aria-label="تحريك لأسفل">أسفل</button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className="small-caps border border-ink px-4 py-2" onClick={save}>حفظ الترتيب والبيانات</button>
                        {selected.status !== 'published' && (
                            <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => setAlbumStatus(selected.id, 'published').then(load)}>نشر</button>
                        )}
                        {selected.status === 'published' && (
                            <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => setAlbumStatus(selected.id, 'draft').then(load)}>إلغاء النشر</button>
                        )}
                        {selected.status !== 'archived' && (
                            <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => setAlbumStatus(selected.id, 'archived').then(load)}>أرشفة</button>
                        )}
                    </div>
                    {selected.status === 'archived' && (
                        <div className="border border-rule p-4">
                            <p className="font-serif text-ink">حذف الألبوم لا يحذف الصور. اكتب «حذف» للتأكيد.</p>
                            <input className={`${fieldClass} mt-3`} value={confirmText} onChange={(event) => setConfirmText(event.target.value)} aria-label="تأكيد حذف الألبوم" />
                            <button type="button" className="small-caps mt-3 border border-ink px-4 py-2 disabled:opacity-40" disabled={confirmText !== 'حذف'} onClick={remove}>حذف الألبوم</button>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}
