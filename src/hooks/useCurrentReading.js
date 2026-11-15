import { useEffect, useState } from 'react'
import { getCurrentReading } from '../services/libraryService'
import { isLibraryBlockedError } from '../services/libraryGuard'

export function useCurrentReading() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({
        status: 'loading',
        book: null,
        progress: null,
        error: null,
    })

    useEffect(() => {
        let active = true
        setState((current) => ({ ...current, status: 'loading', error: null }))
        getCurrentReading()
            .then((result) => {
                if (!active) return
                if (result.state !== 'ready') {
                    setState({ status: 'hidden', book: null, progress: null, error: null })
                    return
                }
                setState({
                    status: 'ready',
                    book: result.book,
                    progress: result.progress,
                    error: null,
                })
            })
            .catch((error) => {
                if (!active) return
                if (isLibraryBlockedError(error)) {
                    setState({ status: 'error', book: null, progress: null, error })
                    return
                }
                console.error(error)
                setState({ status: 'hidden', book: null, progress: null, error: null })
            })
        return () => {
            active = false
        }
    }, [attempt])

    return { ...state, retry: () => setAttempt((value) => value + 1) }
}
