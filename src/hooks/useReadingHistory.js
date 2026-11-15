import { useEffect, useState } from 'react'
import { listPublicHistory } from '../services/libraryService'

export function useReadingHistory() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ status: 'loading', entries: [], error: null })

    useEffect(() => {
        let active = true
        setState((current) => ({ ...current, status: 'loading', error: null }))
        listPublicHistory()
            .then((entries) => {
                if (!active) return
                setState({
                    status: entries.length ? 'ready' : 'empty',
                    entries,
                    error: null,
                })
            })
            .catch((error) => {
                if (!active) return
                setState({ status: 'error', entries: [], error })
            })
        return () => {
            active = false
        }
    }, [attempt])

    return { ...state, retry: () => setAttempt((value) => value + 1) }
}
