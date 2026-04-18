import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const EMPTY_DASHBOARD = {
  incomeSources: [],
  budget: [],
  expenseCategories: [],
  recentExpenses: [],
  goals: [],
  liabilities: [],
  cashflowEntries: [],
  recurringBills: [],
  wealthSnapshots: [], // [{ month: 'Apr 2026', value: 72800 }]
};

export const getDashboardData = async () => {
  const snap = await getDoc(doc(db, 'dashboard', 'main'));
  if (!snap.exists()) return { ...EMPTY_DASHBOARD };
  return { ...EMPTY_DASHBOARD, ...snap.data() };
};

export const saveDashboardData = async (data) => {
  await setDoc(doc(db, 'dashboard', 'main'), data);
};
