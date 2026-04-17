#!/usr/bin/env node

/**
 * Seed the Firestore `networth/holdings` doc from src/data/holdings.json.
 *
 * Usage:
 *   npm run networth:seed
 *
 * If you have no service account, use Email/Password auth instead:
 *   npm run networth:seed:client
 *
 * Credentials (first match wins):
 *   - FIREBASE_SERVICE_ACCOUNT_JSON — full JSON string (e.g. in CI secrets)
 *   - GOOGLE_APPLICATION_CREDENTIALS — path to a service account JSON file
 *   - ./serviceAccountKey.json at repo root (gitignored)
 */

import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
dotenv.config({ path: join(root, '.env') });

const holdingsPath = join(root, 'src/data/holdings.json');
const defaultKeyPath = join(root, 'serviceAccountKey.json');

const holdings = JSON.parse(readFileSync(holdingsPath, 'utf8'));

function resolveProjectId() {
    return (
        process.env.GCLOUD_PROJECT ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.VITE_FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID ||
        undefined
    );
}

function initAdmin() {
    if (admin.apps.length) return;

    const projectId = resolveProjectId();
    const withProject = (opts) => (projectId ? { ...opts, projectId } : opts);

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp(withProject({ credential: admin.credential.cert(sa) }));
        return;
    }

    const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (gac && existsSync(gac)) {
        const sa = JSON.parse(readFileSync(gac, 'utf8'));
        admin.initializeApp(withProject({ credential: admin.credential.cert(sa) }));
        return;
    }

    if (existsSync(defaultKeyPath)) {
        const sa = JSON.parse(readFileSync(defaultKeyPath, 'utf8'));
        admin.initializeApp(withProject({ credential: admin.credential.cert(sa) }));
        return;
    }

    throw new Error(
        'No Firebase Admin credentials found. Add serviceAccountKey.json at the repo root, set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON path, or set FIREBASE_SERVICE_ACCOUNT_JSON (full JSON). Download a key from Firebase Console → Project settings → Service accounts.',
    );
}

initAdmin();

const db = admin.firestore();

async function seed() {
    const docRef = db.collection('networth').doc('holdings');
    const payload = {
        ...holdings,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.set(payload, { merge: false });

    const total =
        (holdings.cash?.length || 0) +
        (holdings.crypto?.length || 0) +
        (holdings.stocks?.length || 0) +
        (holdings.gold?.length || 0) +
        (holdings.manual?.length || 0);

    console.log(
        `✅ Seeded networth/holdings from ${holdingsPath.replace(root + '/', '')}`,
    );
    console.log(
        `   Items: ${total} (cash:${holdings.cash?.length || 0}, crypto:${holdings.crypto?.length || 0}, stocks:${holdings.stocks?.length || 0}, gold:${holdings.gold?.length || 0}, manual:${holdings.manual?.length || 0})`,
    );
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    });
