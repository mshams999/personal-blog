import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import { draftFromRecord, getEditableBook, saveBook } from '../../services/adminBookService'
import { suggestSlug } from '../../services/bookSavePlan'
import {
    FORMAT_OPTIONS,
    READING_STATUSES,
    readingProgress,
} from '../../services/readingPlan'
import { formatLabels, statusLabels } from '../../utils/libraryFormat'

const EMPTY = {
    title: '',
    authors: '',
    coverUrl: '',
    description: '',
    publisher: '',
    publishedYear: '',
    language: '',
    pageCount: '',
    categories: '',
    formats: [],
    isbn: '',
    originalIsbn13: null,
    originalIsbn10: null,
    visibility: 'unlisted',
    readingStatus: 'want',
    currentPage: '',
    startedOn: '',
    finishedOn: '',
    rating: '',
    notes: '',
    slug: '',
}

const inputClass = 'mt-2 w-full border border-rule bg-paper px-3 py-2 font-serif text-ink outline-none focus:border-accent'

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="small-caps">{label}</span>
            {children}
        </label>
    )
}

export default function AddBookPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const editing = Boolean(slug)
    const [draft, setDraft] = useState(EMPTY)
    const [status, setStatus] = useState(editing ? 'loading' : 'ready')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!slug) return undefined
        let active = true
        getEditableBook(slug).then((result) => {
            if (!active) return
            if (!result) {
                setError('هذا الكتاب غير موجود في المكتبة.')
                setStatus('ready')
                return
            }
            setDraft(draftFromRecord(result.book, result.notes))
            setStatus('ready')
        }).catch((loadError) => {
            if (!active) return
            setError(loadError.message || 'تعذّر تحميل الكتاب.')
            setStatus('ready')
        })
        return () => { active = false }
    }, [slug])

    const progress = useMemo(
        () => readingProgress(draft.currentPage, draft.pageCount),
        [draft.currentPage, draft.pageCount],
    )

    const update = (name, value) => {
        setDraft((current) => {
            const next = { ...current, [name]: value }
            if (name === 'title' && !editing) next.slug = suggestSlug(value)
            return next
        })
        setError('')
    }

    const toggleFormat = (format) => {
        setDraft((current) => {
            const formats = current.formats.includes(format)
                ? current.formats.filter((item) => item !== format)
                : [...current.formats, format]
            return { ...current, formats }
        })
    }

    const submit = async (event) => {
        event.preventDefault()
        setStatus('saving')
        setError('')
        try {
            const result = await saveBook(
                { ...draft, slug: editing ? slug : (draft.slug || suggestSlug(draft.title)) },
                editing ? { existingId: slug } : {},
            )
            if (result.status === 'duplicate') {
                setError('يوجد كتاب بهذا العنوان في المكتبة. لم يُستبدل شيء.')
                setStatus('ready')
                return
            }
            navigate('/admin/books')
        } catch (saveError) {
            setError(saveError.message || 'تعذّر حفظ الكتاب.')
            setStatus('ready')
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 md:pt-14">
            <MetaTags title={editing ? 'تعديل الكتاب' : 'إضافة كتاب'} description="سجّل كتابًا في مكتبة القراءة." url="https://mohamedshams.com/admin/books/new" type="website" />
            <Link to="/admin/books" className="small-caps text-accent">مكتبة القراءة</Link>
            <SectionHeader as="h1" kicker="المكتبة" title={editing ? 'تعديل الكتاب' : 'إضافة كتاب'} />
            <p className="mb-8 font-serif text-lg text-ink-muted">أدخل التفاصيل بنفسك. لا يُحفظ شيء حتى تضغط احفظ الكتاب.</p>
            {status === 'loading' && <p className="font-serif text-ink-muted">جارٍ التحميل…</p>}
            {status !== 'loading' && (
                <form onSubmit={submit} className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="font-display text-3xl text-ink">المعلومات الأساسية</h2>
                        <Field label="العنوان">
                            <input className={inputClass} value={draft.title} onChange={(event) => update('title', event.target.value)} required />
                        </Field>
                        <Field label="المؤلفون">
                            <textarea className={`${inputClass} min-h-20`} value={draft.authors} onChange={(event) => update('authors', event.target.value)} required />
                        </Field>
                        <Field label="رابط صورة الغلاف">
                            <input className={inputClass} value={draft.coverUrl} onChange={(event) => update('coverUrl', event.target.value)} />
                        </Field>
                        {draft.coverUrl && <img src={draft.coverUrl} alt="" className="aspect-[3/4] w-36 object-cover" />}
                        <Field label="الوصف">
                            <textarea className={`${inputClass} min-h-28`} value={draft.description} onChange={(event) => update('description', event.target.value)} />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="الناشر">
                                <input className={inputClass} value={draft.publisher} onChange={(event) => update('publisher', event.target.value)} />
                            </Field>
                            <Field label="سنة النشر">
                                <input className={inputClass} inputMode="numeric" value={draft.publishedYear} onChange={(event) => update('publishedYear', event.target.value)} />
                            </Field>
                            <Field label="اللغة">
                                <input className={inputClass} value={draft.language} onChange={(event) => update('language', event.target.value)} placeholder="ar أو en" />
                            </Field>
                            <Field label="عدد الصفحات">
                                <input className={inputClass} inputMode="numeric" value={draft.pageCount} onChange={(event) => update('pageCount', event.target.value)} />
                            </Field>
                        </div>
                        <Field label="التصنيفات">
                            <input className={inputClass} value={draft.categories} onChange={(event) => update('categories', event.target.value)} placeholder="افصل بينها بفاصلة" />
                        </Field>
                        <fieldset>
                            <legend className="small-caps">الصيغة</legend>
                            <div className="mt-3 flex flex-wrap gap-3">
                                {FORMAT_OPTIONS.map((format) => (
                                    <label key={format} className="flex items-center gap-2 font-serif text-ink">
                                        <input type="checkbox" checked={draft.formats.includes(format)} onChange={() => toggleFormat(format)} />
                                        {formatLabels[format] || format}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <Field label="ISBN">
                            <input className={inputClass} value={draft.isbn} onChange={(event) => update('isbn', event.target.value)} />
                        </Field>
                        <fieldset>
                            <legend className="small-caps">الظهور</legend>
                            <div className="mt-3 flex gap-4 font-serif">
                                <label className="flex items-center gap-2"><input type="radio" name="visibility" checked={draft.visibility !== 'public'} onChange={() => update('visibility', 'unlisted')} /> غير مدرج</label>
                                <label className="flex items-center gap-2"><input type="radio" name="visibility" checked={draft.visibility === 'public'} onChange={() => update('visibility', 'public')} /> عام</label>
                            </div>
                        </fieldset>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-display text-3xl text-ink">القراءة</h2>
                        <Field label="الحالة">
                            <select className={inputClass} value={draft.readingStatus} onChange={(event) => update('readingStatus', event.target.value)}>
                                {READING_STATUSES.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
                            </select>
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="الصفحة الحالية">
                                <input className={inputClass} inputMode="numeric" value={draft.currentPage} onChange={(event) => update('currentPage', event.target.value)} />
                            </Field>
                            <p className="self-end font-serif text-ink-muted">
                                {progress.percent == null ? 'أضف عدد الصفحات لحساب التقدّم.' : `${progress.percent}%`}
                            </p>
                            <Field label="تاريخ البدء">
                                <input className={inputClass} type="date" value={draft.startedOn} onChange={(event) => update('startedOn', event.target.value)} />
                            </Field>
                            <Field label="تاريخ الانتهاء">
                                <input className={inputClass} type="date" value={draft.finishedOn} onChange={(event) => update('finishedOn', event.target.value)} />
                            </Field>
                        </div>
                        <Field label="تقييم شخصي">
                            <select className={inputClass} value={draft.rating} onChange={(event) => update('rating', event.target.value)}>
                                <option value="">بلا تقييم</option>
                                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} من 5</option>)}
                            </select>
                        </Field>
                        <Field label="ملاحظات خاصة">
                            <textarea className={`${inputClass} min-h-28`} value={draft.notes} onChange={(event) => update('notes', event.target.value)} />
                        </Field>
                        <p className="font-serif text-sm text-ink-muted">الملاحظات الخاصة تُحفظ في سجل منفصل، ولا تظهر في المكتبة العامة.</p>
                    </section>

                    {error && <p className="font-serif text-ink">{error}</p>}
                    <button type="submit" className="small-caps border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-paper" disabled={status === 'saving'}>
                        {status === 'saving' ? 'جارٍ الحفظ…' : 'احفظ الكتاب'}
                    </button>
                </form>
            )}
        </div>
    )
}
