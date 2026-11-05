import { useEffect, useState } from 'react'
import { doc, onSnapshot, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

const presenceRef = doc(db, 'presence', 'owner')
const ONLINE_MS = 90_000

export const useOwnerPresence = () => {
    const { user } = useAuth()
    const ownerEmail = import.meta.env.VITE_OWNER_EMAIL
    const [lastSeen, setLastSeen] = useState(null)
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const unsub = onSnapshot(
            presenceRef,
            (snap) => setLastSeen(snap.data()?.lastSeen?.toMillis?.() || null),
            () => setLastSeen(null)
        )
        const tick = setInterval(() => setNow(Date.now()), 15_000)
        return () => {
            unsub()
            clearInterval(tick)
        }
    }, [])

    useEffect(() => {
        const isOwner = Boolean(user && ownerEmail && user.email === ownerEmail)
        if (!isOwner) return undefined

        const beat = () => {
            if (document.visibilityState !== 'visible') return
            setDoc(presenceRef, { lastSeen: serverTimestamp() }, { merge: true }).catch(() => {})
        }

        beat()
        const timer = setInterval(beat, 30_000)
        document.addEventListener('visibilitychange', beat)

        return () => {
            clearInterval(timer)
            document.removeEventListener('visibilitychange', beat)
            setDoc(presenceRef, { lastSeen: Timestamp.fromMillis(0) }, { merge: true }).catch(() => {})
        }
    }, [user, ownerEmail])

    return Boolean(lastSeen && now - lastSeen < ONLINE_MS)
}
