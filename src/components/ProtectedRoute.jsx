import { LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL;

const Shell = ({ children }) => (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-paper border border-rule rounded-3xl p-8 sm:p-10 max-w-md w-full text-center">
            {children}
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading, signIn, signOut } = useAuth();

    if (loading) {
        return (
            <Shell>
                <p className="text-ink-muted font-serif">جاري التحقق…</p>
            </Shell>
        );
    }

    if (!user) {
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
        );
    }

    if (OWNER_EMAIL && user.email !== OWNER_EMAIL) {
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
        );
    }

    return children;
};

export default ProtectedRoute;
