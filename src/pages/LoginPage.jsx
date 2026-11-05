import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleMark = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.4a12 12 0 0 0 0 11l4-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
);

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, loading, signInWithGoogle, signIn } = useAuth();
    const ownerEmail = import.meta.env.VITE_OWNER_EMAIL;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) {
            const isOwner = !ownerEmail || user.email === ownerEmail;
            navigate(isOwner ? '/portal' : '/', { replace: true });
        }
    }, [loading, user, navigate, ownerEmail]);

    const handleGoogleSignIn = async () => {
        setError('');
        setSubmitting(true);

        try {
            const signInAction = signInWithGoogle || signIn;
            await signInAction();
        } catch (e) {
            if (e?.code === 'auth/unauthorized-domain') {
                setError('الموقع ده مش مضاف في إعدادات تسجيل الدخول.');
            } else if (e?.code === 'auth/popup-closed-by-user') {
                setError('اتقفلت نافذة جوجل قبل ما تخلّص. جرّب تاني.');
            } else {
                setError('ما قدرناش نسجّل الدخول دلوقتي. جرّب كمان لحظة.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-md border border-rule bg-paper px-8 py-10 sm:px-10">
                <p className="mb-3 text-sm font-medium text-accent">المساحة الخاصة</p>
                <h1 className="font-display text-4xl leading-tight text-ink">تسجيل الدخول</h1>
                <p className="mt-4 font-serif text-lg leading-relaxed text-ink-muted">
                    ادخل بحساب جوجل، وبعدها هتفتح بوابة الإدارة على طول.
                </p>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={submitting || loading}
                    className="mt-8 flex w-full items-center justify-center gap-3 border border-rule bg-white px-5 py-3.5 text-base font-medium text-neutral-800 transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <GoogleMark />
                    <span>{submitting ? 'جارٍ فتح نافذة جوجل…' : 'المتابعة بحساب جوجل'}</span>
                </button>

                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    هتظهر نافذة من جوجل. اختار الحساب، ولو قفلتها بالغلط تقدر تجرب تاني.
                </p>

                {error && (
                    <p className="mt-4 border border-rule px-3 py-2 text-sm text-accent" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    );
};

export default LoginPage;
