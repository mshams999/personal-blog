#!/usr/bin/env node

/**
 * Seed `networth/holdings` using the Firebase client SDK (sign-in + setDoc).
 * Use when you do not have a service account JSON but have Email/Password auth
 * enabled for your Firebase user.
 *
 * Usage:
 *   npm run networth:seed:client
 *
 * Requires in .env (same as Vite):
 *   VITE_FIREBASE_* (apiKey, authDomain, projectId, appId, …)
 * And for this script only:
 *   FIREBASE_SEED_EMAIL — Firebase Auth user email
 *   FIREBASE_SEED_PASSWORD — that user’s password
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
dotenv.config({ path: join(root, '.env') });

const holdingsPath = join(root, 'src/data/holdings.json');
const holdings = JSON.parse(readFileSync(holdingsPath, 'utf8'));

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

async function main() {
    const email = process.env.FIREBASE_SEED_EMAIL;
    const password = process.env.FIREBASE_SEED_PASSWORD;
    if (!email || !password) {
        throw new Error(
            'Set FIREBASE_SEED_EMAIL and FIREBASE_SEED_PASSWORD in .env (Firebase user with Email/Password sign-in).',
        );
    }
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error('Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env.');
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password);

    const db = getFirestore(app);
    await setDoc(doc(db, 'networth', 'holdings'), {
        ...holdings,
        updatedAt: serverTimestamp(),
    });

    console.log('✅ Wrote networth/holdings via client SDK (authenticated).');
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Client seed failed:', err.message || err);
        process.exit(1);
    });
