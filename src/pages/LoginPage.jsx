import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
                setError('This domain is not authorized in Firebase Auth settings.');
            } else if (e?.code === 'auth/popup-closed-by-user') {
                setError('Google sign-in was canceled. Please try again.');
            } else {
                setError('Unable to sign in right now. Please try again in a moment.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-8">
            <div className="bg-paper border border-rule rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-sm">
                <LogIn className="w-10 h-10 text-accent mx-auto mb-4" />
                <h1 className="font-display text-3xl text-ink mb-2">Sign in</h1>
                <p className="text-ink-muted font-serif mb-6">
                    Sign in with your Gmail account to continue.
                </p>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={submitting || loading}
                    className="inline-flex items-center justify-center gap-2 w-full bg-accent text-white px-5 py-3 rounded-full hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="font-display text-sm tracking-wide">
                        {submitting ? 'Signing in...' : 'Continue with Google'}
                    </span>
                </button>

                {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                )}
            </div>
        </section>
    );
};

export default LoginPage;
