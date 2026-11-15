import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import { galleryCloudName } from '../../services/cloudinaryDelivery'
import {
    listAdminAlbums,
    listAdminPhotos,
    listCleanup,
    retryCleanup,
    setPhotoStatus,
    tagsFromInput,
    updatePhotoDetails,
} from '../../services/galleryService'
import { destroyArchivedPhoto, destroyOrphan, previewUrl } from '../../services/galleryUpload'

const fieldClass = 'w-full border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent'
const labels = { draft: 'مسودة', published: 'منشورة', archived: 'مؤرشفة' }

function dateInput(value) {
    const date = value?.toDate?.()
    if (!date) return ''
    const pad = (part) => String(part).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export default function GalleryAdminPage() {
    const cloudName = galleryCloudName()
    const [photos, setPhotos] = useState([])
    const [albums, setAlbums] = useState([])
    const [cleanup, setCleanup] = useState([])
    const [filter, setFilter] = useState('all')
    const [selectedId, setSelectedId] = useState('')
    const [form, setForm] = useState(null)
    const [confirmText, setConfirmText] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const load = () => {
        Promise.all([listAdminPhotos(), listAdminAlbums(), listCleanup()])
            .then(([photoList, albumList, cleanupList]) => {
                setPhotos(photoList)
                setAlbums(albumList)
                setCleanup(cleanupList)
            })
            .catch((loadError) => setError(loadError.message || 'تعذّر تحميل الصور.'))
    }

    useEffect(() => { load() }, [])

    const visible = useMemo(
        () => photos.filter((photo) => filter === 'all' || photo.status === filter),
        [photos, filter],
    )
    const selected = photos.find((photo) => photo.id === selectedId) || null

    const edit = (photo) => {
        setSelectedId(photo.id)
        setConfirmText('')
        setForm({
            caption: photo.caption || '',
            description: photo.description || '',
            location: photo.location || '',
            albumId: photo.albumId || '',
            tags: (photo.tags || []).join(', '),
            takenAt: dateInput(photo.takenAt),
        })
    }

    const save = async () => {
        setError('')
        try {
            await updatePhotoDetails(selected.id, form)
            setMessage('حُفظت البيانات.')
            load()
        } catch (saveError) {
            setError(saveError.message || 'تعذّر الحفظ.')
        }
    }

    const changeStatus = async (status) => {
        setError('')
        try {
            await setPhotoStatus(selected.id, status)
            load()
        } catch (statusError) {
            setError(statusError.message || 'تعذّر تغيير الحالة.')
        }
    }

    const remove = async () => {
        if (confirmText !== 'حذف') return
        setError('')
        try {
            await destroyArchivedPhoto(selected.id)
            setSelectedId('')
            setForm(null)
            setMessage('حُذفت الصورة من Cloudinary وFirestore، وأُبطل تخزين النسخ المؤقت.')
            load()
        } catch (removeError) {
            setError(removeError.message || 'تعذّر الحذف.')
            load()
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags title="إدارة المعرض" description="إدارة صور المعرض." url="https://mohamedshams.com/admin/gallery" type="website" />
            <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeader as="h1" kicker="المعرض" title="الصور" className="mb-0" />
                <div className="flex gap-2">
                    <Link to="/admin/gallery/upload" className="small-caps border border-ink px-4 py-2 text-ink">رفع</Link>
                    <Link to="/admin/gallery/albums" className="small-caps border border-rule px-4 py-2 text-ink">الألبومات</Link>
                </div>
            </div>
            {message && <p className="mt-6 font-serif text-ink">{message}</p>}
            {error && <p className="mt-6 font-serif text-ink">{error}</p>}

            <div className="mt-8 flex flex-wrap gap-2">
                {['all', 'draft', 'published', 'archived'].map((item) => (
                    <button key={item} type="button" className={`small-caps border px-3 py-1 ${filter === item ? 'border-ink text-ink' : 'border-rule text-ink-muted'}`} onClick={() => setFilter(item)}>
                        {item === 'all' ? 'الكل' : labels[item]}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <ul className="grid grid-cols-3 gap-1">
                    {visible.map((photo) => (
                        <li key={photo.id}>
                            <button type="button" className={`block w-full ${selectedId === photo.id ? 'ring-2 ring-accent' : ''}`} onClick={() => edit(photo)}>
                                <span className="block aspect-square bg-rule/30">
                                    {previewUrl(cloudName, photo.publicId) && (
                                        <img src={previewUrl(cloudName, photo.publicId)} alt="" className="h-full w-full object-cover" />
                                    )}
                                </span>
                                <span className="mt-1 block text-start font-serif text-xs text-ink-muted">{labels[photo.status]}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {selected && form && (
                    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); save() }}>
                        <p className="small-caps text-accent">{labels[selected.status]}</p>
                        <label className="block font-serif text-ink">التعليق
                            <input className={`${fieldClass} mt-1`} value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} />
                        </label>
                        <label className="block font-serif text-ink">الوصف
                            <textarea className={`${fieldClass} mt-1`} rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                        </label>
                        <label className="block font-serif text-ink">المكان
                            <input className={`${fieldClass} mt-1`} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
                        </label>
                        <label className="block font-serif text-ink">تاريخ التصوير
                            <input type="date" className={`${fieldClass} mt-1`} value={form.takenAt} onChange={(event) => setForm({ ...form, takenAt: event.target.value })} />
                        </label>
                        <label className="block font-serif text-ink">الوسوم
                            <input className={`${fieldClass} mt-1`} value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="قاهرة, مساء" />
                        </label>
                        <p className="font-serif text-sm text-ink-muted">{tagsFromInput(form.tags).length} / 10</p>
                        <label className="block font-serif text-ink">الألبوم
                            <select className={`${fieldClass} mt-1`} value={form.albumId} onChange={(event) => setForm({ ...form, albumId: event.target.value })}>
                                <option value="">بدون ألبوم</option>
                                {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
                            </select>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button type="submit" className="small-caps border border-ink px-4 py-2">حفظ</button>
                            {selected.status !== 'published' && selected.status !== 'archived' && (
                                <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => changeStatus('published')}>نشر</button>
                            )}
                            {selected.status === 'published' && (
                                <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => changeStatus('draft')}>إلغاء النشر</button>
                            )}
                            {selected.status !== 'archived' && (
                                <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => changeStatus('archived')}>أرشفة</button>
                            )}
                            {selected.status === 'archived' && (
                                <button type="button" className="small-caps border border-rule px-4 py-2" onClick={() => changeStatus('draft')}>استعادة كمسودة</button>
                            )}
                        </div>
                        {selected.status === 'archived' && (
                            <div className="border border-rule p-4">
                                <p className="font-serif text-ink">الحذف يزيل الأصل من Cloudinary ويبطل نسخه المخزنة. اكتب «حذف» للتأكيد.</p>
                                <input className={`${fieldClass} mt-3`} value={confirmText} onChange={(event) => setConfirmText(event.target.value)} aria-label="تأكيد الحذف" />
                                <button type="button" className="small-caps mt-3 border border-ink px-4 py-2 disabled:opacity-40" disabled={confirmText !== 'حذف'} onClick={remove}>حذف نهائي</button>
                            </div>
                        )}
                    </form>
                )}
            </div>

            {cleanup.length > 0 && (
                <section className="mt-16">
                    <h2 className="font-display text-3xl text-ink">استعادة الأصول</h2>
                    <p className="mt-2 max-w-2xl font-serif text-ink-muted">هذه صور وصلَت إلى Cloudinary ولم تُحفظ بياناتها، أو بقي بيانها بعد حذف الأصل. لا يُحذف شيء منها تلقائياً.</p>
                    <ul className="mt-6 space-y-4">
                        {cleanup.map((item) => (
                            <li key={item.id} className="border border-rule p-4">
                                <p className="font-serif text-ink">{item.publicId}</p>
                                <p className="mt-1 font-serif text-sm text-ink-muted">{item.reason}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button type="button" className="small-caps border border-rule px-3 py-1" onClick={() => retryCleanup(item).then(load).catch((retryError) => setError(retryError.message))}>حفظ كمسودة</button>
                                    <button type="button" className="small-caps border border-ink px-3 py-1" onClick={() => {
                                        if (!window.confirm('حذف هذا الأصل من Cloudinary؟ لا يمكن التراجع.')) return
                                        destroyOrphan(item.id).then(load).catch((destroyError) => setError(destroyError.message))
                                    }}>حذف الأصل</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}
