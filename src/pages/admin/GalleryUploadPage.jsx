import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import { listAdminAlbums } from '../../services/galleryService'
import { uploadPhotoFile } from '../../services/galleryUpload'
import { validateImageFile } from '../../services/galleryValidation'

const fieldClass = 'w-full border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent'

async function runQueue(ready, workers, task) {
    let index = 0
    async function worker() {
        while (index < ready.length) {
            const current = index
            index += 1
            await task(ready[current])
        }
    }
    await Promise.all(Array.from({ length: workers }, () => worker()))
}

export default function GalleryUploadPage() {
    const [items, setItems] = useState([])
    const [albums, setAlbums] = useState([])
    const [albumId, setAlbumId] = useState('')
    const [running, setRunning] = useState(false)
    const [summary, setSummary] = useState('')
    const itemsRef = useRef([])
    itemsRef.current = items

    useEffect(() => {
        listAdminAlbums().then(setAlbums).catch(() => setAlbums([]))
        return () => {
            itemsRef.current.forEach((item) => {
                if (item.preview) URL.revokeObjectURL(item.preview)
            })
        }
    }, [])

    const addFiles = (fileList) => {
        const next = Array.from(fileList || []).map((file) => {
            const check = validateImageFile(file)
            return {
                key: crypto.randomUUID(),
                file,
                name: file.name,
                preview: check.ok ? URL.createObjectURL(file) : '',
                progress: 0,
                status: check.ok ? 'ready' : 'invalid',
                error: check.ok ? '' : check.error,
                orphan: null,
            }
        })
        setItems((current) => [...current, ...next])
        setSummary('')
    }

    const updateItem = (key, patch) => {
        setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)))
    }

    const start = async () => {
        const ready = items.filter((item) => item.status === 'ready')
        if (!ready.length || running) return
        setRunning(true)
        setSummary('')
        let done = 0
        let failed = 0
        await runQueue(ready, 3, async (item) => {
            updateItem(item.key, { status: 'uploading', progress: 0, error: '' })
            try {
                await uploadPhotoFile(item.file, {
                    albumId: albumId || null,
                    onProgress: (progress) => updateItem(item.key, { progress }),
                })
                done += 1
                updateItem(item.key, { status: 'done', progress: 1 })
            } catch (error) {
                failed += 1
                updateItem(item.key, {
                    status: 'error',
                    error: error.message,
                    orphan: error.orphan || null,
                })
            }
        })
        setSummary(`تم رفع ${done}، وتعذّر ${failed}. الصور الناجحة بقيت محفوظة.`)
        setRunning(false)
    }

    return (
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags title="رفع الصور" description="رفع صور المعرض." url="https://mohamedshams.com/admin/gallery/upload" type="website" />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <SectionHeader as="h1" kicker="المعرض" title="رفع الصور" className="mb-0" />
                <Link to="/admin/gallery" className="small-caps text-accent">كل الصور</Link>
            </div>
            <p className="max-w-2xl font-serif text-ink-muted">الصور تُرفع كما هي، بحد 10 ميغابايت للصورة. فشل صورة واحدة لا يلغي الصور التي اكتملت.</p>

            <label className="mt-8 block font-serif text-ink">
                الألبوم
                <select className={`${fieldClass} mt-2 max-w-sm`} value={albumId} onChange={(event) => setAlbumId(event.target.value)}>
                    <option value="">بدون ألبوم</option>
                    {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
                </select>
            </label>

            <label
                className="mt-6 flex cursor-pointer flex-col items-center justify-center border border-dashed border-rule px-6 py-12 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault()
                    addFiles(event.dataTransfer.files)
                }}
            >
                <span className="font-display text-2xl text-ink">أفلت الصور هنا</span>
                <span className="mt-2 font-serif text-ink-muted">أو اختر ملفات من جهازك</span>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/tiff"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                        addFiles(event.target.files)
                        event.target.value = ''
                    }}
                />
            </label>

            <ul className="mt-8 space-y-4">
                {items.map((item) => (
                    <li key={item.key} className="grid gap-4 border border-rule p-3 sm:grid-cols-[5rem_1fr]">
                        <div className="aspect-square bg-rule/30">
                            {item.preview ? <img src={item.preview} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div>
                            <p className="font-serif text-ink">{item.name}</p>
                            <p className="mt-1 font-serif text-sm text-ink-muted">
                                {item.status === 'invalid' && item.error}
                                {item.status === 'ready' && 'جاهزة للرفع'}
                                {item.status === 'uploading' && `جارٍ الرفع ${Math.round(item.progress * 100)}٪`}
                                {item.status === 'done' && 'رُفعت كمسودة'}
                                {item.status === 'error' && item.error}
                            </p>
                            {item.status === 'uploading' && (
                                <div className="mt-3 h-1 bg-rule" aria-hidden="true">
                                    <div className="h-full bg-accent" style={{ width: `${Math.round(item.progress * 100)}%` }} />
                                </div>
                            )}
                            {item.orphan && (
                                <p className="mt-2 font-serif text-sm text-ink">
                                    {item.orphan.saved
                                        ? 'سُجّل الأصل في قائمة الاستعادة. لم يُحذف من Cloudinary.'
                                        : `احتفظ بهذا المعرّف إن أردت استعادته: ${item.orphan.publicId || item.orphan.photoId}`}
                                </p>
                            )}
                            {item.status === 'ready' && (
                                <button
                                    type="button"
                                    className="small-caps mt-3 text-ink-muted"
                                    onClick={() => setItems((current) => current.filter((entry) => entry.key !== item.key))}
                                >
                                    إزالة
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="small-caps mt-8 border border-ink px-4 py-2 text-ink disabled:opacity-40"
                disabled={running || !items.some((item) => item.status === 'ready')}
                onClick={start}
            >
                {running ? 'جارٍ الرفع…' : 'ابدأ الرفع'}
            </button>
            {summary && <p className="mt-4 font-serif text-ink">{summary}</p>}
        </div>
    )
}
