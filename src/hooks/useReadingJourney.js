import { useEffect, useState } from 'react'
import { getCurrentReading, listPublicHistory } from '../services/libraryService'
import { isLibraryBlockedError } from '../services/libraryGuard'

export function useReadingJourney() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({
        status: 'loading',
        finished: [],
        current: null,
        error: null,
    })

    useEffect(() => {
        let active = true
        setState((current) => ({ ...current, status: 'loading', error: null }))
        Promise.all([listPublicHistory(), getCurrentReading()])
            .then(([finished, current]) => {
                if (!active) return
                setState({
                    status: 'ready',
                    finished,
                    current: current?.state === 'ready' ? current : null,
                    error: null,
                })
            })
            .catch((error) => {
                if (!active) return
                if (isLibraryBlockedError(error)) {
                    setState({ status: 'error', finished: [], current: null, error })
                    return
                }
                console.error(error)
                setState({ status: 'error', finished: [], current: null, error })
            })
        return () => {
            active = false
        }
    }, [attempt])

    return { ...state, retry: () => setAttempt((value) => value + 1) }
}
