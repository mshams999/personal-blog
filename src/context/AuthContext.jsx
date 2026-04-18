import { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
    const signIn = signInWithGoogle;
    const signOut = () => firebaseSignOut(auth);

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
