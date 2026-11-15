import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import SectionHeader from '../../components/editorial/SectionHeader'
import { listLibrary } from '../../services/adminBookService'
import { commitGoodreadsImport } from '../../services/goodreadsImportService'
import { formatAuthors, statusLabels } from '../../utils/libraryFormat'
import {
    SESSION_LIMITATION,
    analyzeGoodreadsImport,
    entriesToImport,
    selectionIssues,
} from '../../utils/goodreadsImport'

const FILTERS = [
    ['all', 'الكل'],
    ['read', 'قرأتُه'],
    ['currently-reading', 'قيد القراءة'],
    ['to-read', 'أريد قراءته'],
    ['invalid', 'غير صالح'],
    ['duplicate', 'مكرر'],
]

const CHOICES = [
    ['reading', 'أقرأ الآن'],
    ['paused', 'متوقف'],
    ['want', 'أريد قراءته'],
]

function statusText(record, choices) {
    const status = record.needsChoice ? choices[record.rowNumber] : record.draft.readingStatus
    return statusLabels[status] || 'بانتظار الاختيار'
}

export default function ImportBooksPage() {
    const [libraryStatus, setLibraryStatus] = useState('loading')
    const [existingBooks, setExistingBooks] = useState([])
    const [libraryError, setLibraryError] = useState('')
    const [report, setReport] = useState(null)
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState(() => new Set())
    const [choices, setChoices] = useState({})
    const [importing, setImporting] = useState(false)
    const [results, setResults] = useState(null)
    const [importError, setImportError] = useState('')

    useEffect(() => {
        listLibrary().then((result) => {
            setExistingBooks(result.books)
            setLibraryStatus('ready')
        }).catch((error) => {
            setLibraryError(error.message || 'تعذّر تحميل المكتبة الحالية.')
            setLibraryStatus('error')
        })
    }, [])

    const records = report?.records || []
    const issues = useMemo(
        () => (report ? selectionIssues(records, selected, choices) : []),
        [report, records, selected, choices],
    )
    const readyEntries = useMemo(
        () => (report ? entriesToImport(records, selected, choices) : []),
        [report, records, selected, choices],
    )
    const visible = records.filter((record) => {
        if (filter === 'invalid') return !record.valid
        if (filter === 'duplicate') return Boolean(record.duplicate)
        if (filter === 'all') return true
        return record.shelf === filter
    })

    const onFile = async (event) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return
        const text = await file.text()
        const next = analyzeGoodreadsImport(text, existingBooks)
        const initial = new Set(
            next.records
                .filter((record) => record.valid && !record.duplicate && !record.needsChoice)
                .map((record) => record.rowNumber),
        )
        setReport(next)
        setSelected(initial)
        setChoices({})
        setResults(null)
        setImportError('')
        setFilter('all')
    }

    const toggle = (record) => {
        if (!record.valid || record.duplicate) return
        setSelected((current) => {
            const next = new Set(current)
            if (next.has(record.rowNumber)) next.delete(record.rowNumber)
            else next.add(record.rowNumber)
            return next
        })
    }

    const selectValid = () => {
        setSelected(new Set(
            records
                .filter((record) => record.valid && !record.duplicate && (!record.needsChoice || choices[record.rowNumber]))
                .map((record) => record.rowNumber),
        ))
    }

    const choose = (rowNumber, status) => {
        setChoices((current) => {
            const next = { ...current, [rowNumber]: status }
            if (status === 'reading') {
                records.forEach((record) => {
                    if (record.rowNumber !== rowNumber && next[record.rowNumber] === 'reading') next[record.rowNumber] = ''
                })
            }
            return next
        })
        setSelected((current) => new Set(current).add(rowNumber))
    }

    const runImport = async (entries) => {
        setImporting(true)
        setImportError('')
        try {
            setResults(await commitGoodreadsImport(entries))
        } catch (error) {
            setImportError(error.message || 'تعذّر الاستيراد.')
        } finally {
            setImporting(false)
        }
    }

    const downloadReport = () => {
        const payload = {
            unmappedFields: report?.unmappedFields || [],
            sessionLimitation: SESSION_LIMITATION,
            results,
        }
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'goodreads-import-report.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    const counts = results ? {
        imported: results.filter((item) => item.status === 'imported').length,
        skipped: results.filter((item) => item.status === 'skipped').length,
        failed: results.filter((item) => item.status === 'failed').length,
        notes: results.filter((item) => item.note === 'saved').length,
    } : null

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 md:pt-14">
            <MetaTags title="استيراد من غودريدز" description="راجع ملف غودريدز قبل إدخاله إلى المكتبة." url="https://mohamedshams.com/admin/books/import" type="website" />
            <Link to="/admin/books" className="small-caps text-accent">مكتبة القراءة</Link>
            <SectionHeader as="h1" kicker="المكتبة" title="استيراد من غودريدز" />
            <p className="max-w-3xl font-serif text-lg text-ink-muted">
                اختر الملف، راجع السجلات، ثم أكّد الاستيراد. الكتب تُحفظ غير مدرجة، والمراجعات تبقى في الملاحظات الخاصة. {SESSION_LIMITATION}
            </p>
            <p className="mt-3 max-w-3xl font-serif text-ink-muted">
                الحقول التي لا مكان لها في المكتبة وتبقى خارج السجل: تاريخ الإضافة، سنة النشر الأصلية، عدد مرات القراءة، النسخ المملوكة، ورقم الكتاب في غودريدز.
            </p>

            {libraryStatus === 'loading' && <p className="mt-8 font-serif text-ink-muted">جارٍ التحميل…</p>}
            {libraryStatus === 'error' && <p className="mt-8 font-serif text-ink">{libraryError}</p>}

            {libraryStatus === 'ready' && (
                <label className="small-caps mt-8 inline-block cursor-pointer border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-paper">
                    اختيار ملف CSV
                    <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onFile} />
                </label>
            )}

            {report && (
                <>
                    <p className="mt-8 font-serif text-ink">
                        {records.length} صفًا. الصالح {records.filter((record) => record.valid).length}. المكرر {records.filter((record) => record.duplicate).length}. المحدد للاستيراد {readyEntries.length}.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {FILTERS.map(([id, label]) => (
                            <button key={id} type="button" onClick={() => setFilter(id)} className={`small-caps border px-3 py-1 ${filter === id ? 'border-ink bg-ink text-paper' : 'border-rule text-ink'}`}>
                                {label}
                            </button>
                        ))}
                        <button type="button" onClick={selectValid} className="small-caps border border-rule px-3 py-1 text-accent">تحديد الصالح</button>
                    </div>

                    <ul className="mt-8 divide-y divide-rule border-y border-rule">
                        {visible.map((record) => (
                            <li key={record.rowNumber} className="grid gap-4 py-5 sm:grid-cols-[auto_5rem_1fr]">
                                <input
                                    type="checkbox"
                                    className="mt-2"
                                    checked={selected.has(record.rowNumber)}
                                    disabled={!record.valid || Boolean(record.duplicate)}
                                    onChange={() => toggle(record)}
                                    aria-label={`تحديد ${record.draft.title}`}
                                />
                                <div className="flex aspect-[3/4] items-end bg-rule/30 p-2">
                                    <span className="font-display text-3xl text-ink/30">{record.draft.title?.slice(0, 1) || 'ك'}</span>
                                </div>
                                <div>
                                    <p className="small-caps text-accent">{statusText(record, choices)}</p>
                                    <h2 className="mt-1 font-display text-2xl text-ink">{record.draft.title || 'بدون عنوان'}</h2>
                                    <p className="mt-1 font-serif text-ink-muted">{formatAuthors(record.draft.authors) || 'بدون مؤلف'}</p>
                                    <p className="mt-2 font-serif text-sm text-ink">
                                        {record.draft.rating ? `التقييم ${record.draft.rating} من 5` : 'بلا تقييم'}
                                        {' · '}
                                        {record.draft.pageCount ? `${record.draft.pageCount} صفحة` : 'بدون عدد صفحات'}
                                        {' · '}
                                        {record.draft.finishedAt || 'بدون تاريخ قراءة'}
                                    </p>
                                    {record.needsChoice && (
                                        <label className="mt-3 block">
                                            <span className="small-caps">حالة هذا الكتاب</span>
                                            <select
                                                className="mt-2 border border-rule bg-paper px-3 py-2 font-serif text-ink"
                                                value={choices[record.rowNumber] || ''}
                                                onChange={(event) => choose(record.rowNumber, event.target.value)}
                                            >
                                                <option value="">اختر الحالة</option>
                                                {CHOICES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                            </select>
                                        </label>
                                    )}
                                    {record.duplicate && (
                                        <p className="mt-2 font-serif text-ink">مكرر مع «{record.duplicate.title}». لن يُستبدل.</p>
                                    )}
                                    {record.errors.map((error) => <p key={error} className="mt-2 font-serif text-ink">{error}</p>)}
                                    {record.warnings.map((warning) => <p key={warning} className="mt-2 font-serif text-ink-muted">{warning}</p>)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {issues.map((issue) => <p key={issue} className="mt-6 font-serif text-ink">{issue}</p>)}
                    {importError && <p className="mt-4 font-serif text-ink">{importError}</p>}
                    <button
                        type="button"
                        className="small-caps mt-6 border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
                        disabled={importing || readyEntries.length === 0 || issues.length > 0}
                        onClick={() => runImport(readyEntries)}
                    >
                        {importing ? 'جارٍ الاستيراد…' : `استيراد ${readyEntries.length} كتابًا`}
                    </button>
                </>
            )}

            {counts && (
                <section className="mt-10 max-w-3xl">
                    <h2 className="font-display text-3xl text-ink">نتيجة الاستيراد</h2>
                    <ul className="mt-4 space-y-2 font-serif text-lg text-ink">
                        <li>صفوف الملف: {records.length}</li>
                        <li>سجلات صالحة: {records.filter((record) => record.valid).length}</li>
                        <li>كُتبت في المكتبة: {counts.imported}</li>
                        <li>جلسات قراءة: 0. {SESSION_LIMITATION}</li>
                        <li>ملاحظات خاصة حُفظت: {counts.notes}</li>
                        <li>مكررات تُركت كما هي: {counts.skipped}</li>
                        <li>سجلات غير صالحة: {records.filter((record) => !record.valid).length}</li>
                        <li>عمليات فاشلة: {counts.failed}</li>
                    </ul>
                    {counts.failed > 0 && (
                        <button
                            type="button"
                            className="small-caps mt-4 border border-rule px-3 py-1"
                            onClick={() => {
                                const failedRows = new Set(results.filter((item) => item.status === 'failed').map((item) => item.rowNumber))
                                runImport(readyEntries.filter((entry) => failedRows.has(entry.rowNumber)))
                            }}
                        >
                            إعادة الفاشل
                        </button>
                    )}
                    <button type="button" className="small-caps mt-4 ms-3 border border-rule px-3 py-1" onClick={downloadReport}>
                        تنزيل التقرير
                    </button>
                </section>
            )}
        </div>
    )
}
