import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const EMPTY = { cash: [], crypto: [], stocks: [], gold: [], manual: [] };

export const getHoldings = async () => {
    const snap = await getDoc(doc(db, 'networth', 'holdings'));
    if (!snap.exists()) return { ...EMPTY, updatedAt: null };
    const data = snap.data();
    return {
        cash: data.cash || [],
        crypto: data.crypto || [],
        stocks: data.stocks || [],
        gold: data.gold || [],
        manual: data.manual || [],
        updatedAt: data.updatedAt || null,
    };
};

export const saveHoldings = async (holdings) => {
    await setDoc(doc(db, 'networth', 'holdings'), {
        ...holdings,
        updatedAt: new Date().toISOString(),
    });
};
