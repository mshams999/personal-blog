import { useEffect, useState } from 'react'
import { listPublicSessions, readPublicBook } from '../services/libraryService'

export function usePublicBook(slug) {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({
        status: 'loading',
        book: null,
        sessions: [],
        error: null,
    })

    useEffect(() => {
        let active = true
        setState((current) => ({ ...current, status: 'loading', error: null }))

        readPublicBook(slug)
            .then(async (book) => {
                if (!active) return null
                if (!book) {
                    setState({ status: 'notFound', book: null, sessions: [], error: null })
                    return null
                }
                const sessions = await listPublicSessions(book.id)
                if (!active) return null
                setState({ status: 'ready', book, sessions, error: null })
                return null
            })
            .catch((error) => {
                if (!active) return
                setState({ status: 'error', book: null, sessions: [], error })
            })

        return () => {
            active = false
        }
    }, [slug, attempt])

    return { ...state, retry: () => setAttempt((value) => value + 1) }
}
