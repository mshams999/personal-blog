import { useEffect, useState } from 'react'
import { LogIn, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { galleryOwnerGateAllows } from '../services/galleryValidation'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL

const Shell = ({ children }) => (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-paper border border-rule rounded-3xl p-8 sm:p-10 max-w-md w-full text-center">
            {children}
        </div>
    </div>
)

/**
 * Gallery admin gate. Used only by /admin/gallery routes.
 * Library routes keep ProtectedRoute. This check is not a substitute for
 * Firestore rules or the Netlify authorizeOwner boundary.
 * A missing VITE_OWNER_EMAIL fails closed and shows the unauthorized state.
 */
const GalleryOwnerRoute = ({ children }) => {
    const { user, loading, signIn, signOut } = useAuth()
    const [gate, setGate] = useState('pending')

    useEffect(() => {
        if (loading) return undefined
        if (!user) {
            setGate('signed-out')
            return undefined
        }

        let cancelled = false
        setGate('pending')
        user.getIdTokenResult(true).then((result) => {
            if (cancelled) return
            const allowed = galleryOwnerGateAllows({
                claims: result?.claims,
                email: user.email,
                ownerEmail: OWNER_EMAIL,
            })
            setGate(allowed ? 'allowed' : 'denied')
        }).catch(() => {
            if (!cancelled) setGate('denied')
        })

        return () => {
            cancelled = true
        }
    }, [user, loading])

    if (loading || (user && gate === 'pending')) {
        return (
            <Shell>
                <p className="text-ink-muted font-serif">جاري التحقق…</p>
            </Shell>
        )
    }

    if (!user || gate === 'signed-out') {
        return (
            <Shell>
                <LogIn className="w-8 h-8 text-accent mx-auto mb-4" />
                <h2 className="font-display text-2xl text-ink mb-2">منطقة خاصة</h2>
                <p className="text-ink-muted font-serif mb-6">
                    يجب تسجيل الدخول لعرض هذه الصفحة.
                </p>
                <button
                    onClick={signIn}
                    className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full hover:opacity-90 transition"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="font-display text-sm tracking-wide">تسجيل الدخول بجوجل</span>
                </button>
            </Shell>
        )
    }

    if (gate !== 'allowed') {
        return (
            <Shell>
                <ShieldAlert className="w-8 h-8 text-accent mx-auto mb-4" />
                <h2 className="font-display text-2xl text-ink mb-2">غير مصرح</h2>
                <p className="text-ink-muted font-serif mb-6">
                    هذا الحساب ({user.email}) لا يملك صلاحية الوصول.
                </p>
                <button
                    onClick={signOut}
                    className="inline-flex items-center gap-2 border border-rule text-ink px-5 py-2.5 rounded-full hover:bg-ink/5 transition"
                >
                    <span className="font-display text-sm tracking-wide">تسجيل الخروج</span>
                </button>
            </Shell>
        )
    }

    return children
}

export default GalleryOwnerRoute
