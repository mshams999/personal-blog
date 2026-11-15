import { useEffect, useState } from 'react'
import { listPublicBooks } from '../services/libraryService'

export function useLibraryCatalog() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ status: 'loading', books: [], error: null })

    useEffect(() => {
        let active = true
        setState((current) => ({ ...current, status: 'loading', error: null }))
        listPublicBooks()
            .then((books) => {
                if (!active) return
                setState({
                    status: books.length ? 'ready' : 'empty',
                    books,
                    error: null,
                })
            })
            .catch((error) => {
                if (!active) return
                setState({ status: 'error', books: [], error })
            })
        return () => {
            active = false
        }
    }, [attempt])

    return { ...state, retry: () => setAttempt((value) => value + 1) }
}
