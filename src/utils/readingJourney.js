export function sessionDate(value) {
    if (!value) return null
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date
}

export function durationDays(startedAt, finishedAt) {
    if (!startedAt || !finishedAt) return null
    const start = Date.UTC(startedAt.getFullYear(), startedAt.getMonth(), startedAt.getDate())
    const end = Date.UTC(finishedAt.getFullYear(), finishedAt.getMonth(), finishedAt.getDate())
    const span = Math.round((end - start) / 86400000)
    if (span < 0) return null
    return span + 1
}

export function durationLabel(days) {
    if (days == null) return ''
    if (days <= 1) return 'يوم واحد'
    if (days === 2) return 'يومان'
    if (days <= 10) return `${days} أيام`
    return `${days} يومًا`
}

function milestoneFrom(session, current) {
    const startedAt = sessionDate(session.startedAt)
    const finishedAt = session.status === 'finished' ? sessionDate(session.finishedAt) : null
    const book = session.book || null
    return {
        key: session.key,
        title: session.title || book?.title || '',
        authors: session.authors || book?.authors || [],
        coverUrl: book?.coverUrl || null,
        href: book?.id ? `/library/${book.id}` : null,
        startedAt,
        finishedAt,
        status: current ? 'reading' : (session.status || 'finished'),
        current,
        progress: current ? (session.progress || null) : null,
        durationDays: finishedAt ? durationDays(startedAt, finishedAt) : null,
    }
}

function currentRecord(current) {
    if (!current?.session || !current.book) return null
    return {
        key: current.session.key,
        title: current.session.title || current.book.title,
        authors: current.session.authors || current.book.authors,
        startedAt: current.session.startedAt,
        finishedAt: null,
        status: 'reading',
        progress: current.progress || current.session.progress || null,
        book: current.book,
    }
}

export function journeyYears(finished, current, now = new Date()) {
    const years = new Set()
    for (const session of finished) {
        const startedAt = sessionDate(session.startedAt)
        if (startedAt) years.add(startedAt.getFullYear())
    }
    const reading = currentRecord(current)
    const readingStart = reading ? sessionDate(reading.startedAt) : null
    if (readingStart) years.add(readingStart.getFullYear())
    if (reading) years.add(now.getFullYear())
    return [...years].sort((left, right) => right - left)
}

export function buildReadingJourney({ finished = [], current = null, year, now = new Date() } = {}) {
    const years = journeyYears(finished, current, now)
    const selected = years.includes(year) ? year : (years.includes(now.getFullYear()) ? now.getFullYear() : years[0])
    if (selected == null) return { year: now.getFullYear(), years, milestones: [] }

    const completed = finished
        .map((session) => milestoneFrom(session, false))
        .filter((item) => item.startedAt && item.startedAt.getFullYear() === selected)
        .sort((left, right) => left.startedAt - right.startedAt || String(left.key).localeCompare(String(right.key)))

    const reading = currentRecord(current)
    const readingStart = reading ? sessionDate(reading.startedAt) : null
    const includeCurrent = Boolean(
        readingStart && (readingStart.getFullYear() === selected || selected === now.getFullYear()),
    )
    if (!includeCurrent) return { year: selected, years, milestones: completed }

    const destination = milestoneFrom(reading, true)
    return {
        year: selected,
        years,
        milestones: [...completed.filter((item) => item.key !== destination.key), destination],
    }
}
