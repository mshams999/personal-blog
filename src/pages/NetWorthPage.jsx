import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import { format as formatDate, parseISO, isValid } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import {
  TrendingUp, TrendingDown, RefreshCw, LogOut, DollarSign,
  BarChart2, Target, Wallet, Pencil, Check, X, Plus, Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHoldings, saveHoldings } from '../services/networthService';
import { fetchPrices } from '../services/pricesService';
import { getDashboardData, saveDashboardData } from '../services/dashboardService';

// ─── Colors ──────────────────────────────────────────────────────────────────
const BLUE = '#3B82F6';
const GREEN = '#22C55E';
const ORANGE = '#F59E0B';
const PURPLE = '#8B5CF6';
const TEAL = '#14B8A6';
const PINK = '#EC4899';
const RED = '#EF4444';
const PIE_COLORS = [BLUE, ORANGE, PURPLE, GREEN, TEAL, PINK, RED];
const DONUT_COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#22C55E', '#14B8A6'];
const GOAL_COLORS = [BLUE, GREEN, PURPLE, ORANGE, TEAL, PINK];
const SUPPORTED_CURRENCIES = ['USD', 'EGP', 'SAR'];

// ─── Currency context ─────────────────────────────────────────────────────────
const CurrencyCtx = createContext({ fmtD: (v) => `$${v}`, displayCurrency: 'USD', fxRates: {} });
const useCurrency = () => useContext(CurrencyCtx);

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmt = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n ?? 0);
const fmtK = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${Math.round(n)}`);
const num = (v) => Number(v) || 0;
const parseDateInput = (value) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

// Convert native-currency amount to USD using fxRates
const toUsd = (amount, currency, fxRates) => {
  if (!currency || currency === 'USD') return num(amount);
  const rate = fxRates?.[currency];
  return rate ? num(amount) / rate : 0;
};

const generateWealthHistory = (totalNow, range) => {
  const counts = { '1M': 30, '3M': 13, '6M': 7, '1Y': 13, ALL: 19 };
  const n = counts[range] ?? 7;
  const start = totalNow * 0.72;
  return Array.from({ length: n }, (_, i) => {
    const t = i / Math.max(n - 1, 1);
    const trend = start + (totalNow - start) * t;
    const noise = (Math.random() - 0.48) * totalNow * 0.035;
    const d = new Date();
    if (range === '1M') d.setDate(d.getDate() - (n - 1 - i));
    else if (range === '3M') d.setDate(d.getDate() - (n - 1 - i) * 7);
    else d.setMonth(d.getMonth() - (n - 1 - i));
    const label =
      range === '1M' ? `${d.getMonth() + 1}/${d.getDate()}`
        : d.toLocaleString('default', { month: 'short' });
    return { name: label, value: Math.max(0, Math.round(trend + noise)) };
  });
};

// ─── Month picker ─────────────────────────────────────────────────────────────
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const parts = value ? value.split(' ') : [];
  const selMonth = parts[0] || '';
  const selYear = parts[1] ? parseInt(parts[1]) : null;
  const [pickerYear, setPickerYear] = useState(selYear || new Date().getFullYear());
  const select = (m) => { onChange(`${m} ${pickerYear}`); setOpen(false); };
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-36 border border-gray-200 rounded-lg px-2 py-1 text-sm text-left bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 hover:border-gray-300">
        {value || <span className="text-gray-400">Select month</span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-52">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPickerYear((y) => y - 1)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-base leading-none">‹</button>
              <span className="text-sm font-semibold text-gray-800">{pickerYear}</span>
              <button onClick={() => setPickerYear((y) => y + 1)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-base leading-none">›</button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {MONTH_NAMES.map((m) => {
                const active = selMonth === m && selYear === pickerYear;
                return (
                  <button key={m} onClick={() => select(m)}
                    className={`py-1.5 text-xs rounded-lg font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Currency select ──────────────────────────────────────────────────────────
function CurrencySelect({ value, onChange, className = '' }) {
  return (
    <select value={value || 'USD'} onChange={(e) => onChange(e.target.value)}
      className={`border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white ${className}`}>
      {SUPPORTED_CURRENCIES.map((c) => <option key={c}>{c}</option>)}
    </select>
  );
}

// ─── Reusable primitives ──────────────────────────────────────────────────────
function Inp({ value, onChange, type = 'text', placeholder, className = '', min }) {
  return (
    <input type={type} value={value ?? ''} min={min} placeholder={placeholder}
      onChange={(e) => onChange(type === 'number' ? num(e.target.value) : e.target.value)}
      className={`border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white ${className}`} />
  );
}

function EditBar({ editing, onEdit, onSave, onCancel, saving }) {
  if (editing) return (
    <div className="flex items-center gap-2">
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50">
        <Check size={13} /> {saving ? 'Saving…' : 'Save'}
      </button>
      <button onClick={onCancel} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
        <X size={13} /> Cancel
      </button>
    </div>
  );
  return (
    <button onClick={onEdit} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
      <Pencil size={13} className="text-gray-400" />
    </button>
  );
}

function SectionCard({ title, children, trailing, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}>
      {(title || trailing) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
          {trailing}
        </div>
      )}
      {children}
    </div>
  );
}

function KpiCard({ title, value, change, icon: Icon, iconBg }) {
  const { fmtD } = useCurrency();
  const pos = change >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{fmtD(value)}</p>
        <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${pos ? 'text-green-500' : 'text-red-500'}`}>
          {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {pos ? '+' : ''}{change.toFixed(1)}% vs last month
        </div>
      </div>
      <div className={`${iconBg} p-2.5 rounded-xl`}><Icon size={20} className="text-white" /></div>
    </div>
  );
}

function ChangeBadge({ pct }) {
  const pos = pct >= 0;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
      {pos ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
}

function HoldingCard({ name, symbol, iconBg, iconChar, holdingLabel, valueUsd, changePct }) {
  const { fmtD } = useCurrency();
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-sm font-bold`}>{iconChar}</div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{name}</p>
            <p className="text-xs text-gray-500">{symbol}</p>
          </div>
        </div>
        <ChangeBadge pct={changePct} />
      </div>
      <div>
        <p className="text-xs text-gray-500">Holdings</p>
        <p className="text-xs font-medium text-gray-700">{holdingLabel}</p>
      </div>
      <p className="text-lg font-bold text-gray-900">{fmtD(valueUsd)}</p>
    </div>
  );
}

const WealthTooltip = ({ active, payload, label }) => {
  const { fmtD } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-600 mb-0.5">{label}</p>
      <p className="font-bold text-blue-600">{fmtD(payload[0]?.value)}</p>
    </div>
  );
};

const BudgetTooltip = ({ active, payload, label }) => {
  const { fmtD } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey === 'budget' ? 'Budget' : 'Actual'}: {fmtD(p.value)}
        </p>
      ))}
    </div>
  );
};

const CashflowTooltip = ({ active, payload, label }) => {
  const { fmtD } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey === 'inflow' ? 'Inflow' : 'Outflow'}: {fmtD(p.value)}
        </p>
      ))}
    </div>
  );
};

// ─── useSection hook ──────────────────────────────────────────────────────────
function useSection(data) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data);
  const [saving, setSaving] = useState(false);
  const startEdit = () => { setDraft(data); setEditing(true); };
  const cancel = () => { setDraft(data); setEditing(false); };
  return { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing };
}

// ─── Income Sources section ───────────────────────────────────────────────────
function IncomeSourcesSection({ sources, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(sources);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { label: '', category: '', frequency: 'Monthly', amount: 0, currency: 'USD', icon: '💼' }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  if (editing) return (
    <SectionCard title="Income Sources" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        {draft.map((src, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <Inp value={src.icon} onChange={(v) => update(i, 'icon', v)} className="w-10 text-center" placeholder="💼" />
            <Inp value={src.label} onChange={(v) => update(i, 'label', v)} className="flex-1 min-w-[100px]" placeholder="Source name" />
            <Inp value={src.category} onChange={(v) => update(i, 'category', v)} className="w-24" placeholder="Category" />
            <select value={src.frequency} onChange={(e) => update(i, 'frequency', e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
              {['Monthly', 'Variable', 'Quarterly', 'Annual'].map((f) => <option key={f}>{f}</option>)}
            </select>
            <Inp type="number" value={src.amount} onChange={(v) => update(i, 'amount', v)} className="w-24" min="0" />
            <CurrencySelect value={src.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} className="w-20" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1">
          <Plus size={13} /> Add source
        </button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Income Sources" trailing={<EditBar onEdit={startEdit} />}>
      {sources.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No income sources yet. Click edit to add.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sources.map((src) => {
            const usdAmount = toUsd(src.amount, src.currency || 'USD', fxRates);
            return (
              <div key={src.label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{src.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">{src.label}</p>
                      <p className="text-[10px] text-gray-400">{src.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{src.frequency}</span>
                </div>
                <p className="text-base font-bold text-gray-900 mt-2">
                  {fmt(src.amount, src.currency || 'USD')}
                  <span className="text-xs text-gray-400 font-normal">/mo</span>
                </p>
                {src.currency && src.currency !== 'USD' && (
                  <p className="text-[10px] text-gray-400 mt-0.5">≈ {fmtD(usdAmount)}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

function LiabilitiesSection({ rows, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { name: '', type: 'Loan', balance: 0, apr: 0, minPayment: 0, currency: 'USD' }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  const totalUsd = rows.reduce((sum, r) => sum + toUsd(r.balance, r.currency || 'USD', fxRates), 0);
  const minPaymentUsd = rows.reduce((sum, r) => sum + toUsd(r.minPayment, r.currency || 'USD', fxRates), 0);

  if (editing) return (
    <SectionCard title="Liabilities & Debt" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-6 gap-2 text-xs text-gray-500 font-medium px-1">
          <span>Name</span><span>Type</span><span>APR %</span><span>Currency</span><span>Balance</span><span>Min Pay</span>
        </div>
        {draft.map((l, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 items-center">
            <Inp value={l.name} onChange={(v) => update(i, 'name', v)} placeholder="Visa Platinum" />
            <Inp value={l.type} onChange={(v) => update(i, 'type', v)} placeholder="Loan" />
            <Inp type="number" value={l.apr} onChange={(v) => update(i, 'apr', v)} min="0" />
            <CurrencySelect value={l.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} />
            <Inp type="number" value={l.balance} onChange={(v) => update(i, 'balance', v)} min="0" />
            <div className="flex items-center gap-2">
              <Inp type="number" value={l.minPayment} onChange={(v) => update(i, 'minPayment', v)} min="0" />
              <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1">
          <Plus size={13} /> Add liability
        </button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Liabilities & Debt" trailing={<EditBar onEdit={startEdit} />}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No liabilities yet. Click edit to add.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.map((l, i) => (
              <div key={`${l.name}-${i}`} className="bg-red-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{l.name || 'Liability'}</p>
                  <span className="text-[10px] font-medium text-red-600">{l.type || 'Debt'}</span>
                </div>
                <p className="text-lg font-bold text-red-600 mt-1">{fmt(l.balance, l.currency || 'USD')}</p>
                <div className="flex justify-between mt-1 text-[11px] text-gray-500">
                  <span>APR: {num(l.apr).toFixed(1)}%</span>
                  <span>Min: {fmt(l.minPayment, l.currency || 'USD')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Total debt / min monthly payment</span>
            <span className="font-bold text-gray-900">{fmtD(totalUsd)} / {fmtD(minPaymentUsd)}</span>
          </div>
        </>
      )}
    </SectionCard>
  );
}

function CashflowSection({ entries, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(entries);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, {
    date: new Date().toISOString().slice(0, 10), type: 'outflow', spendType: 'variable', category: '', amount: 0, currency: 'USD', note: '',
  }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  const monthKey = (d) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
  };

  const grouped = entries.reduce((acc, e) => {
    const key = monthKey(e.date);
    if (!key) return acc;
    const usd = toUsd(e.amount, e.currency || 'USD', fxRates);
    if (!acc[key]) acc[key] = { inflow: 0, outflow: 0 };
    if (e.type === 'inflow') acc[key].inflow += usd;
    if (e.type === 'outflow') acc[key].outflow += usd;
    return acc;
  }, {});

  const monthlySeries = Object.entries(grouped)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-6)
    .map(([key, v]) => {
      const [y, m] = key.split('-');
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleString('default', { month: 'short' });
      return { name: label, inflow: Math.round(v.inflow), outflow: Math.round(v.outflow), net: Math.round(v.inflow - v.outflow) };
    });

  const currentKey = monthKey(new Date().toISOString());
  const thisMonth = grouped[currentKey] || { inflow: 0, outflow: 0 };
  const thisNet = thisMonth.inflow - thisMonth.outflow;

  if (editing) return (
    <SectionCard title="Cashflow Ledger" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-8 gap-2 text-xs text-gray-500 font-medium px-1">
          <span>Date</span><span>Type</span><span>Spend</span><span>Category</span><span>Currency</span><span>Amount</span><span className="col-span-2">Note</span>
        </div>
        {draft.map((e, i) => (
          <div key={i} className="grid grid-cols-8 gap-2 items-center">
            <DatePicker
              selected={parseDateInput(e.date)}
              onChange={(date) => update(i, 'date', date ? formatDate(date, 'yyyy-MM-dd') : '')}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
              className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            />
            <select value={e.type || 'outflow'} onChange={(ev) => update(i, 'type', ev.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
              {['inflow', 'outflow', 'transfer'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={e.spendType || 'variable'} onChange={(ev) => update(i, 'spendType', ev.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
              {['fixed', 'variable'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <Inp value={e.category} onChange={(v) => update(i, 'category', v)} placeholder="Salary / Groceries" />
            <CurrencySelect value={e.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} />
            <Inp type="number" value={e.amount} onChange={(v) => update(i, 'amount', v)} min="0" />
            <div className="col-span-2 flex items-center gap-2">
              <Inp value={e.note} onChange={(v) => update(i, 'note', v)} className="w-full" placeholder="Optional note" />
              <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1">
          <Plus size={13} /> Add cashflow entry
        </button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Monthly Cashflow" trailing={<EditBar onEdit={startEdit} />}>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No cashflow entries yet. Click edit to add.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-600 font-medium">Inflow</p>
              <p className="text-base font-bold text-gray-900">{fmtD(thisMonth.inflow)}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xs text-red-600 font-medium">Outflow</p>
              <p className="text-base font-bold text-gray-900">{fmtD(thisMonth.outflow)}</p>
            </div>
            <div className={`rounded-xl p-3 ${thisNet >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <p className="text-xs text-gray-600 font-medium">Net</p>
              <p className="text-base font-bold text-gray-900">{fmtD(thisNet)}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CashflowTooltip />} />
              <Bar dataKey="inflow" fill={GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" fill={RED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </SectionCard>
  );
}

function RecurringBillsSection({ rows, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, {
    name: '', category: '', amount: 0, currency: 'USD', dueDay: 1, spendType: 'fixed', autopay: false,
  }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  const monthlyTotalUsd = rows.reduce((sum, b) => sum + toUsd(b.amount, b.currency || 'USD', fxRates), 0);
  const fixedUsd = rows
    .filter((b) => (b.spendType || 'fixed') === 'fixed')
    .reduce((sum, b) => sum + toUsd(b.amount, b.currency || 'USD', fxRates), 0);

  if (editing) return (
    <SectionCard title="Recurring Bills" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-8 gap-2 text-xs text-gray-500 font-medium px-1">
          <span>Name</span><span>Category</span><span>Type</span><span>Due Day</span><span>Autopay</span><span>Currency</span><span>Amount</span><span />
        </div>
        {draft.map((b, i) => (
          <div key={i} className="grid grid-cols-8 gap-2 items-center">
            <Inp value={b.name} onChange={(v) => update(i, 'name', v)} placeholder="Rent" />
            <Inp value={b.category} onChange={(v) => update(i, 'category', v)} placeholder="Housing" />
            <select value={b.spendType || 'fixed'} onChange={(e) => update(i, 'spendType', e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
              {['fixed', 'variable'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <Inp type="number" value={b.dueDay} onChange={(v) => update(i, 'dueDay', Math.min(31, Math.max(1, num(v))))} min="1" />
            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input type="checkbox" checked={Boolean(b.autopay)} onChange={(e) => update(i, 'autopay', e.target.checked)} />
              Auto
            </label>
            <CurrencySelect value={b.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} />
            <Inp type="number" value={b.amount} onChange={(v) => update(i, 'amount', v)} min="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1">
          <Plus size={13} /> Add recurring bill
        </button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Recurring Bills" trailing={<EditBar onEdit={startEdit} />}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No recurring bills yet. Click edit to add.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.map((b, i) => (
              <div key={`${b.name}-${i}`} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{b.name || 'Bill'}</p>
                  <span className={`text-[10px] font-medium ${b.autopay ? 'text-green-600' : 'text-amber-600'}`}>
                    {b.autopay ? 'Autopay' : 'Manual'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{b.category || 'General'} · {b.spendType || 'fixed'}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-base font-bold text-gray-900">{fmt(b.amount, b.currency || 'USD')}</p>
                  <p className="text-xs text-gray-400">Due day {Math.min(31, Math.max(1, num(b.dueDay) || 1))}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Monthly recurring / fixed share</span>
            <span className="font-bold text-gray-900">{fmtD(monthlyTotalUsd)} / {monthlyTotalUsd > 0 ? ((fixedUsd / monthlyTotalUsd) * 100).toFixed(1) : '0.0'}%</span>
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ─── Budget section ───────────────────────────────────────────────────────────
function BudgetSection({ budget, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(budget);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { name: '', budget: 0, actual: 0, currency: 'USD' }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  // Convert each row to USD for chart
  const chartData = budget.map((row) => ({
    name: row.name,
    budget: Math.round(toUsd(row.budget, row.currency || 'USD', fxRates)),
    actual: Math.round(toUsd(row.actual, row.currency || 'USD', fxRates)),
  }));
  const totalBudget = chartData.reduce((s, d) => s + d.budget, 0);
  const totalActual = chartData.reduce((s, d) => s + d.actual, 0);
  const diff = totalActual - totalBudget;

  if (editing) return (
    <SectionCard title="Budget vs Actual" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="flex gap-2 text-xs text-gray-500 font-medium px-1 mb-1">
          <span className="flex-1">Category</span><span className="w-20">Currency</span>
          <span className="w-20">Budget</span><span className="w-20">Actual</span>
        </div>
        {draft.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={row.name} onChange={(v) => update(i, 'name', v)} className="flex-1" placeholder="Category" />
            <CurrencySelect value={row.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} className="w-20" />
            <Inp type="number" value={row.budget} onChange={(v) => update(i, 'budget', v)} className="w-20" min="0" />
            <Inp type="number" value={row.actual} onChange={(v) => update(i, 'actual', v)} className="w-20" min="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1">
          <Plus size={13} /> Add category
        </button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Budget vs Actual Spending" trailing={<EditBar onEdit={startEdit} />}>
      {budget.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No budget data yet. Click edit to add.</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">This month</p>
            <div className={`text-sm font-bold ${diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {diff > 0 ? '+' : ''}{fmtD(diff)}
              <span className="text-xs font-normal text-gray-400 ml-1">{diff > 0 ? 'over' : 'under'} budget</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={2} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v}`} tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<BudgetTooltip />} />
              <Bar dataKey="budget" fill="#BFDBFE" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill={BLUE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-200 inline-block" />Budget</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-500 inline-block" />Actual</span>
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ─── Expense section ──────────────────────────────────────────────────────────
function ExpenseSection({ categories, recentExpenses, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection({ categories, recentExpenses });
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const updateCat = (i, f, v) => setDraft((d) => ({ ...d, categories: d.categories.map((r, j) => (j === i ? { ...r, [f]: v } : r)) }));
  const addCat = () => setDraft((d) => ({ ...d, categories: [...d.categories, { name: '', value: 0, currency: 'USD' }] }));
  const removeCat = (i) => setDraft((d) => ({ ...d, categories: d.categories.filter((_, j) => j !== i) }));
  const updateExp = (i, f, v) => setDraft((d) => ({ ...d, recentExpenses: d.recentExpenses.map((r, j) => (j === i ? { ...r, [f]: v } : r)) }));
  const addExp = () => setDraft((d) => ({ ...d, recentExpenses: [...d.recentExpenses, { name: '', category: '', date: '', amount: 0, currency: 'USD' }] }));
  const removeExp = (i) => setDraft((d) => ({ ...d, recentExpenses: d.recentExpenses.filter((_, j) => j !== i) }));

  const catUsd = categories.map((e) => ({ ...e, usdValue: toUsd(e.value, e.currency || 'USD', fxRates) }));
  const total = catUsd.reduce((s, e) => s + e.usdValue, 0);

  if (editing) return (
    <SectionCard title="Expense Breakdown" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <p className="text-xs font-semibold text-gray-600 mb-2">Categories</p>
      <div className="space-y-2 mb-4">
        {draft.categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={cat.name} onChange={(v) => updateCat(i, 'name', v)} className="flex-1" placeholder="Category" />
            <CurrencySelect value={cat.currency || 'USD'} onChange={(v) => updateCat(i, 'currency', v)} className="w-20" />
            <Inp type="number" value={cat.value} onChange={(v) => updateCat(i, 'value', v)} className="w-24" min="0" />
            <button onClick={() => removeCat(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={addCat} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add category</button>
      </div>
      <p className="text-xs font-semibold text-gray-600 mb-2">Recent Expenses</p>
      <div className="space-y-2">
        {draft.recentExpenses.map((exp, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <Inp value={exp.name} onChange={(v) => updateExp(i, 'name', v)} className="flex-1 min-w-[80px]" placeholder="Name" />
            <Inp value={exp.category} onChange={(v) => updateExp(i, 'category', v)} className="w-20" placeholder="Category" />
            <Inp value={exp.date} onChange={(v) => updateExp(i, 'date', v)} className="w-20" placeholder="Apr 1" />
            <CurrencySelect value={exp.currency || 'USD'} onChange={(v) => updateExp(i, 'currency', v)} className="w-20" />
            <Inp type="number" value={exp.amount} onChange={(v) => updateExp(i, 'amount', v)} className="w-20" min="0" />
            <button onClick={() => removeExp(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={addExp} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add expense</button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Expense Breakdown" trailing={<EditBar onEdit={startEdit} />}>
      {categories.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No expense data yet. Click edit to add.</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">This month</p>
            <p className="text-xl font-bold text-gray-900">{fmtD(total)}</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <PieChart width={140} height={140}>
                <Pie data={catUsd} cx={65} cy={65} outerRadius={60} dataKey="usdValue" paddingAngle={1}>
                  {catUsd.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtD(v)} />
              </PieChart>
            </div>
            <div className="flex-1 space-y-1.5 pt-1">
              <p className="text-xs font-semibold text-gray-700 mb-2">Category Details</p>
              {catUsd.map((e, i) => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-600">{e.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{fmt(e.value, e.currency || 'USD')}</span>
                    {total > 0 && <span className="text-gray-400 ml-1">{((e.usdValue / total) * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {recentExpenses.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Recent Large Expenses</p>
              <div className="grid grid-cols-2 gap-2">
                {recentExpenses.map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2.5 py-2">
                    <div>
                      <p className="font-semibold text-gray-900">{e.name}</p>
                      <p className="text-gray-400">{e.category}{e.date ? ` · ${e.date}` : ''}</p>
                    </div>
                    <span className="font-bold text-gray-900">{fmt(e.amount, e.currency || 'USD')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}

// ─── Goals section ────────────────────────────────────────────────────────────
function GoalsSection({ goals, onSave }) {
  const { fmtD, fxRates } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(goals);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { name: '', target: 0, saved: 0, deadline: '', icon: '🎯', currency: 'USD' }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  if (editing) return (
    <SectionCard title="Financial Goals" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-3">
        {draft.map((g, i) => (
          <div key={i} className="space-y-1.5 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Inp value={g.icon} onChange={(v) => update(i, 'icon', v)} className="w-10 text-center" placeholder="🎯" />
              <Inp value={g.name} onChange={(v) => update(i, 'name', v)} className="flex-1" placeholder="Goal name" />
              <Inp value={g.deadline} onChange={(v) => update(i, 'deadline', v)} className="w-24" placeholder="Dec 2030" />
              <CurrencySelect value={g.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} className="w-20" />
              <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 mb-0.5">Saved</p>
                <Inp type="number" value={g.saved} onChange={(v) => update(i, 'saved', v)} className="w-full" min="0" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 mb-0.5">Target</p>
                <Inp type="number" value={g.target} onChange={(v) => update(i, 'target', v)} className="w-full" min="0" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add goal</button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Financial Goals" trailing={<EditBar onEdit={startEdit} />}>
      {goals.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No goals yet. Click edit to add.</p>
      ) : (
        <div className="space-y-4">
          {goals.map((g, i) => {
            const savedUsd = toUsd(g.saved, g.currency || 'USD', fxRates);
            const targetUsd = toUsd(g.target, g.currency || 'USD', fxRates);
            const pct = targetUsd > 0 ? Math.min(100, Math.round((savedUsd / targetUsd) * 100)) : 0;
            const color = GOAL_COLORS[i % GOAL_COLORS.length];
            return (
              <div key={g.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{g.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{g.name}</p>
                      {g.deadline && <p className="text-xs text-gray-400">Target {g.deadline}</p>}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{fmt(g.saved, g.currency || 'USD')} saved{g.currency && g.currency !== 'USD' && ` · ${fmtD(savedUsd)}`}</span>
                  <span className="text-gray-500 font-medium">{fmt(g.target, g.currency || 'USD')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Holdings sections ────────────────────────────────────────────────────────
function CryptoSection({ rows, onSave }) {
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { symbol: '', name: '', quantity: 0 }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  if (editing) return (
    <SectionCard title="Cryptocurrency Holdings" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 font-medium px-1">
          <span>Symbol</span><span>Name</span><span>Quantity</span>
        </div>
        {draft.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={c.symbol} onChange={(v) => update(i, 'symbol', v)} className="w-20 uppercase" placeholder="BTC" />
            <Inp value={c.name} onChange={(v) => update(i, 'name', v)} className="flex-1" placeholder="Bitcoin" />
            <Inp type="number" value={c.quantity} onChange={(v) => update(i, 'quantity', v)} className="w-24" min="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add coin</button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Cryptocurrency Holdings" trailing={<EditBar onEdit={startEdit} />}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No crypto holdings. Click edit to add.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((c, i) => (
            <HoldingCard key={c.symbol} name={c.name || c.symbol} symbol={c.symbol}
              iconBg={['bg-orange-100', 'bg-blue-100', 'bg-purple-100', 'bg-green-100'][i % 4]}
              iconChar={c.symbol?.[0] ?? '₿'}
              holdingLabel={`${c.quantity} ${c.symbol}`}
              valueUsd={c.valueUsd ?? 0} changePct={c.changePct ?? 0} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function StocksSection({ rows, onSave }) {
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { symbol: '', name: '', quantity: 0 }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  if (editing) return (
    <SectionCard title="Stocks & Shares" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 font-medium px-1">
          <span>Symbol</span><span>Name</span><span>Shares</span>
        </div>
        {draft.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={s.symbol} onChange={(v) => update(i, 'symbol', v)} className="w-20 uppercase" placeholder="AAPL" />
            <Inp value={s.name} onChange={(v) => update(i, 'name', v)} className="flex-1" placeholder="Apple Inc." />
            <Inp type="number" value={s.quantity} onChange={(v) => update(i, 'quantity', v)} className="w-24" min="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add stock</button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Stocks & Shares" trailing={<EditBar onEdit={startEdit} />}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No stocks. Click edit to add.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((s, i) => (
            <HoldingCard key={s.symbol} name={s.name || s.symbol} symbol={s.symbol}
              iconBg={['bg-gray-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'][i % 4]}
              iconChar={s.symbol?.[0] ?? '📊'}
              holdingLabel={`${s.quantity} shares`}
              valueUsd={s.valueUsd ?? 0} changePct={s.changePct ?? 0} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function GoldSection({ rows, onSave }) {
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { metal: 'Gold', grams: 0, karat: 21 }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  if (editing) return (
    <SectionCard title="Precious Metals" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="flex gap-2 text-xs text-gray-500 font-medium px-1">
          <span className="flex-1">Metal</span><span className="w-20">Karat</span><span className="w-28">Grams</span>
        </div>
        {draft.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={g.metal} onChange={(v) => update(i, 'metal', v)} className="flex-1" placeholder="Gold" />
            <select value={g.karat ?? 24} onChange={(e) => update(i, 'karat', Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
              {[18, 21, 22, 24].map((k) => <option key={k} value={k}>{k}K</option>)}
            </select>
            <Inp type="number" value={g.grams} onChange={(v) => update(i, 'grams', v)} className="w-28" min="0" placeholder="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add metal</button>
      </div>
    </SectionCard>
  );

  return (
    <SectionCard title="Precious Metals" trailing={<EditBar onEdit={startEdit} />}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No metals. Click edit to add.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((g, i) => (
            <HoldingCard key={i} name={`${g.metal || 'Gold'} ${g.karat ?? 24}K`} symbol="XAU"
              iconBg="bg-yellow-100" iconChar="🥇"
              holdingLabel={`${g.grams}g`}
              valueUsd={g.valueUsd ?? 0} changePct={g.changePct ?? 0} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Cash section ─────────────────────────────────────────────────────────────
function CashSection({ rows, fxRates, onSave }) {
  const { fmtD } = useCurrency();
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(rows);
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { label: '', amount: 0, currency: 'EGP' }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));

  const totalUsd = rows.reduce((s, c) => s + toUsd(c.amount ?? c.amountUsd ?? 0, c.currency || 'USD', fxRates), 0);

  if (editing) return (
    <SectionCard title="Cash & Savings" trailing={<EditBar editing saving={saving} onSave={save} onCancel={cancel} />}>
      <div className="space-y-2">
        <div className="flex gap-2 text-xs text-gray-500 font-medium px-1">
          <span className="flex-1">Account / Label</span><span className="w-20">Currency</span><span className="w-28">Amount</span>
        </div>
        {draft.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <Inp value={c.label} onChange={(v) => update(i, 'label', v)} className="flex-1" placeholder="CIB Savings" />
            <CurrencySelect value={c.currency || 'USD'} onChange={(v) => update(i, 'currency', v)} className="w-20" />
            <Inp type="number" value={c.amount ?? c.amountUsd ?? 0} onChange={(v) => update(i, 'amount', v)} className="w-28" min="0" />
            <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"><Plus size={13} /> Add account</button>
      </div>
    </SectionCard>
  );

  if (rows.length === 0) return null;

  return (
    <SectionCard title="Cash & Savings" trailing={<EditBar onEdit={startEdit} />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((c, i) => {
          const native = c.amount ?? c.amountUsd ?? 0;
          const currency = c.currency || 'USD';
          const usdVal = toUsd(native, currency, fxRates);
          return (
            <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">💵</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.label || 'Cash'}</p>
                  <p className="text-[10px] text-gray-400">{currency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{fmt(native, currency)}</p>
                {currency !== 'USD' && <p className="text-[10px] text-gray-400">≈ {fmtD(usdVal)}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Total</span>
        <span className="text-sm font-bold text-gray-900">{fmtD(totalUsd)}</span>
      </div>
    </SectionCard>
  );
}

// ─── Wealth History card ──────────────────────────────────────────────────────
function WealthHistoryCard({ wealthHistory, snapshots, onSaveSnapshots, className }) {
  const { editing, draft, setDraft, saving, setSaving, startEdit, cancel, setEditing } = useSection(snapshots);
  const save = async () => { setSaving(true); await onSaveSnapshots(draft); setSaving(false); setEditing(false); };
  const update = (i, f, v) => setDraft((d) => d.map((r, j) => (j === i ? { ...r, [f]: v } : r)));
  const add = () => setDraft((d) => [...d, { month: '', value: 0 }]);
  const remove = (i) => setDraft((d) => d.filter((_, j) => j !== i));
  const usingReal = snapshots.length >= 2;

  return (
    <SectionCard title="Wealth History" className={className} trailing={
      <div className="flex items-center gap-3">
        {usingReal
          ? <span className="text-[10px] text-green-500 font-medium">● Live data</span>
          : <span className="text-[10px] text-gray-400">Estimated — add snapshots for real data</span>}
        <EditBar editing={editing} onEdit={startEdit} onSave={save} onCancel={cancel} saving={saving} />
      </div>
    }>
      {editing ? (
        <div className="space-y-2">
          <div className="flex gap-2 text-xs text-gray-500 font-medium px-1 mb-1">
            <span className="w-36">Month</span><span className="w-36">Net Worth (USD)</span>
          </div>
          {draft.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <MonthPicker value={s.month} onChange={(v) => update(i, 'month', v)} />
              <Inp type="number" value={s.value} onChange={(v) => update(i, 'value', v)} className="w-36" min="0" />
              <button onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mt-1"><Plus size={13} /> Add month</button>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={wealthHistory} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BLUE} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BLUE} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<WealthTooltip />} />
              <Area type="monotone" dataKey="value" stroke={BLUE} strokeWidth={2} fill="url(#wealthGrad)" dot={false} activeDot={{ r: 4, fill: BLUE }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
            <div className="w-3 h-0.5 bg-blue-500 rounded" />
            Total Wealth (USD)
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function FinancialDashboard() {
  const { user, signOutUser } = useAuth();

  const [holdings, setHoldings] = useState(null);
  const [prices, setPrices] = useState({});
  const [goldPerGramUsd, setGoldPerGramUsd] = useState(null);
  const [fxRates, setFxRates] = useState({});
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [timeRange, setTimeRange] = useState('6M');
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  const loadPrices = useCallback(async (h) => {
    const cryptoSymbols = (h.crypto || []).map((c) => c.symbol).filter(Boolean);
    const stockSymbols = (h.stocks || []).map((s) => s.symbol).filter(Boolean);
    const includeGold = (h.gold || []).length > 0;
    const result = await fetchPrices({ cryptoSymbols, stockSymbols, includeGold, fxCurrencies: ['SAR'] });
    setPrices(result.prices ?? {});
    setGoldPerGramUsd(result.goldPerGramUsd ?? null);
    setFxRates(result.fxRates ?? {});
    if (result.errors?.length) setPriceError(result.errors.join(', '));
    else setPriceError(null);
  }, []);

  useEffect(() => {
    Promise.all([getHoldings(), getDashboardData()])
      .then(([h, dd]) => { setHoldings(h); setDashData(dd); return loadPrices(h); })
      .catch((e) => setPriceError(e.message))
      .finally(() => setLoading(false));
  }, [loadPrices]);

  const handleRefresh = async () => {
    if (!holdings) return;
    setRefreshing(true);
    await loadPrices(holdings).catch((e) => setPriceError(e.message));
    setRefreshing(false);
  };

  const saveDash = useCallback(async (patch) => {
    const next = { ...dashData, ...patch };
    setDashData(next);
    await saveDashboardData(next);
  }, [dashData]);

  const saveHoldingSection = useCallback(async (section, rows) => {
    const next = { ...holdings, [section]: rows };
    setHoldings(next);
    await saveHoldings(next);
    await loadPrices(next);
  }, [holdings, loadPrices]);

  const computed = useMemo(() => {
    if (!holdings) return null;

    const cryptoRows = (holdings.crypto || []).map((c) => ({
      ...c,
      valueUsd: c.quantity * (prices[c.symbol] ?? 0),
      changePct: c.changePct ?? 0,
    }));

    const stockRows = (holdings.stocks || []).map((s) => ({
      ...s,
      valueUsd: s.quantity * (prices[s.symbol] ?? 0),
      changePct: s.changePct ?? 0,
    }));

    const goldRows = (holdings.gold || []).map((g) => ({
      ...g,
      valueUsd: g.grams * (goldPerGramUsd ?? 0) * ((g.karat ?? 24) / 24),
      changePct: g.changePct ?? 0,
    }));

    const cashUsd = (holdings.cash || []).reduce((s, c) => {
      if (c.currency && c.amount != null) return s + toUsd(c.amount, c.currency, fxRates);
      return s + (c._egpAmount ? c._egpAmount / (fxRates?.EGP || 1) : num(c.amountUsd));
    }, 0);

    const cryptoUsd = cryptoRows.reduce((s, r) => s + r.valueUsd, 0);
    const stocksUsd = stockRows.reduce((s, r) => s + r.valueUsd, 0);
    const goldUsd = goldRows.reduce((s, r) => s + r.valueUsd, 0);
    const manualUsd = (holdings.manual || []).reduce((s, m) => s + num(m.valueUsd), 0);
    const totalUsd = cryptoUsd + stocksUsd + goldUsd + cashUsd + manualUsd;

    const allocationData = [
      { name: 'Cryptocurrency', value: Math.round(cryptoUsd) },
      { name: 'Stocks & Shares', value: Math.round(stocksUsd) },
      { name: 'Precious Metals', value: Math.round(goldUsd) },
      { name: 'Cash & Savings', value: Math.round(cashUsd) },
    ].filter((d) => d.value > 0);

    return { cryptoRows, stockRows, goldRows, cryptoUsd, stocksUsd, goldUsd, cashUsd, totalUsd, allocationData };
  }, [holdings, prices, goldPerGramUsd, fxRates]);

  // Currency context value
  const currencyCtx = useMemo(() => {
    const rate = displayCurrency === 'USD' ? 1 : (fxRates[displayCurrency] ?? 1);
    const fmtD = (usdVal) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency', currency: displayCurrency, maximumFractionDigits: 0,
      }).format((usdVal ?? 0) * rate);
    return { fmtD, displayCurrency, fxRates };
  }, [displayCurrency, fxRates]);

  const totalUsd = computed?.totalUsd ?? 0;
  const incomeSources = dashData?.incomeSources ?? [];
  const budget = dashData?.budget ?? [];
  const expenseCategories = dashData?.expenseCategories ?? [];
  const recentExpenses = dashData?.recentExpenses ?? [];
  const goals = dashData?.goals ?? [];
  const liabilities = dashData?.liabilities ?? [];
  const cashflowEntries = dashData?.cashflowEntries ?? [];
  const recurringBills = dashData?.recurringBills ?? [];

  const monthlyIncomeUsd = incomeSources.reduce(
    (s, i) => s + toUsd(i.amount, i.currency || 'USD', fxRates), 0,
  );

  const monthKey = (dateValue) => {
    const dt = new Date(dateValue);
    if (Number.isNaN(dt.getTime())) return null;
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
  };

  const cashflowByMonth = cashflowEntries.reduce((acc, entry) => {
    const key = monthKey(entry.date);
    if (!key) return acc;
    const usd = toUsd(entry.amount, entry.currency || 'USD', fxRates);
    if (!acc[key]) acc[key] = { inflow: 0, outflow: 0 };
    if (entry.type === 'inflow') acc[key].inflow += usd;
    if (entry.type === 'outflow') acc[key].outflow += usd;
    return acc;
  }, {});

  const currentMonthKey = monthKey(new Date().toISOString());
  const currentMonthData = cashflowByMonth[currentMonthKey] || { inflow: 0, outflow: 0 };
  const monthlyOutflowUsd = currentMonthData.outflow;
  const monthlyCashflowUsd = currentMonthData.inflow - currentMonthData.outflow;
  const savingsRate = currentMonthData.inflow > 0 ? (monthlyCashflowUsd / currentMonthData.inflow) * 100 : 0;

  const sortedMonthKeys = Object.keys(cashflowByMonth).sort();
  const prevMonthData = sortedMonthKeys.length > 1 ? cashflowByMonth[sortedMonthKeys[sortedMonthKeys.length - 2]] : null;
  const prevMonthNet = prevMonthData ? (prevMonthData.inflow - prevMonthData.outflow) : 0;
  const cashflowChangePct = prevMonthNet !== 0 ? ((monthlyCashflowUsd - prevMonthNet) / Math.abs(prevMonthNet)) * 100 : 0;

  const debtUsd = liabilities.reduce((sum, l) => sum + toUsd(l.balance, l.currency || 'USD', fxRates), 0);
  const minDebtPaymentUsd = liabilities.reduce((sum, l) => sum + toUsd(l.minPayment, l.currency || 'USD', fxRates), 0);
  const avgDebtApr = liabilities.length
    ? liabilities.reduce((sum, l) => sum + num(l.apr), 0) / liabilities.length
    : 0;

  const isCurrentMonth = (dateValue) => monthKey(dateValue) === currentMonthKey;
  const currentMonthOutflows = cashflowEntries
    .filter((e) => e.type === 'outflow' && isCurrentMonth(e.date))
    .map((e) => ({
      ...e,
      usd: toUsd(e.amount, e.currency || 'USD', fxRates),
      spendType: e.spendType || 'variable',
    }));

  let fixedSpendUsd = currentMonthOutflows
    .filter((e) => e.spendType === 'fixed')
    .reduce((sum, e) => sum + e.usd, 0);
  let variableSpendUsd = currentMonthOutflows
    .filter((e) => e.spendType !== 'fixed')
    .reduce((sum, e) => sum + e.usd, 0);

  if (fixedSpendUsd + variableSpendUsd === 0) {
    fixedSpendUsd = recurringBills
      .filter((b) => (b.spendType || 'fixed') === 'fixed')
      .reduce((sum, b) => sum + toUsd(b.amount, b.currency || 'USD', fxRates), 0);
    variableSpendUsd = recurringBills
      .filter((b) => (b.spendType || 'fixed') !== 'fixed')
      .reduce((sum, b) => sum + toUsd(b.amount, b.currency || 'USD', fxRates), 0);
  }

  const totalSpendSplitUsd = fixedSpendUsd + variableSpendUsd;
  const fixedSharePct = totalSpendSplitUsd > 0 ? (fixedSpendUsd / totalSpendSplitUsd) * 100 : 0;

  const upcomingBills = recurringBills
    .map((bill) => {
      const now = new Date();
      const dueDay = Math.min(31, Math.max(1, num(bill.dueDay) || 1));
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDue = new Date(year, month, Math.min(dueDay, daysInMonth));
      const nextDue = firstDue < now
        ? new Date(year, month + 1, Math.min(dueDay, new Date(year, month + 2, 0).getDate()))
        : firstDue;
      const diffDays = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
      return {
        ...bill,
        nextDue,
        diffDays,
        amountUsd: toUsd(bill.amount, bill.currency || 'USD', fxRates),
      };
    })
    .filter((bill) => bill.diffDays >= 0 && bill.diffDays <= 30)
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 6);

  const overdueBills = recurringBills
    .map((bill) => {
      const now = new Date();
      const dueDay = Math.min(31, Math.max(1, num(bill.dueDay) || 1));
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dueThisMonth = new Date(year, month, Math.min(dueDay, daysInMonth));
      const isOverdue = dueThisMonth < now && !bill.autopay;
      return {
        ...bill,
        dueThisMonth,
        isOverdue,
        amountUsd: toUsd(bill.amount, bill.currency || 'USD', fxRates),
      };
    })
    .filter((bill) => bill.isOverdue)
    .sort((a, b) => b.dueThisMonth - a.dueThisMonth)
    .slice(0, 5);

  const manualDueSoonBills = recurringBills
    .map((bill) => {
      const now = new Date();
      const dueDay = Math.min(31, Math.max(1, num(bill.dueDay) || 1));
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDue = new Date(year, month, Math.min(dueDay, daysInMonth));
      const nextDue = firstDue < now
        ? new Date(year, month + 1, Math.min(dueDay, new Date(year, month + 2, 0).getDate()))
        : firstDue;
      const diffDays = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
      return {
        ...bill,
        nextDue,
        diffDays,
        amountUsd: toUsd(bill.amount, bill.currency || 'USD', fxRates),
      };
    })
    .filter((bill) => !bill.autopay && bill.diffDays >= 0 && bill.diffDays <= 5)
    .sort((a, b) => a.diffDays - b.diffDays);

  const manualRiskUsd = manualDueSoonBills.reduce((sum, bill) => sum + bill.amountUsd, 0);
  const autopayRiskLevel = manualDueSoonBills.length === 0
    ? 'low'
    : manualDueSoonBills.length <= 2
      ? 'medium'
      : 'high';

  const wealthSnapshots = dashData?.wealthSnapshots ?? [];
  const wealthHistory = useMemo(() => {
    if (wealthSnapshots.length >= 2) {
      const sorted = [...wealthSnapshots].sort((a, b) => new Date(a.month) - new Date(b.month));
      const cutoffMonths = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, ALL: Infinity };
      const months = cutoffMonths[timeRange] ?? 6;
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - months);
      const filtered = months === Infinity ? sorted : sorted.filter((s) => new Date(s.month) >= cutoff);
      return (filtered.length >= 2 ? filtered : sorted).map((s) => ({ name: s.month, value: num(s.value) }));
    }
    return generateWealthHistory(totalUsd, timeRange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wealthSnapshots, totalUsd, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const liquidUsd = (computed?.cashUsd ?? 0) + (computed?.cryptoUsd ?? 0) + (computed?.stocksUsd ?? 0);
  const illiquidUsd = computed?.goldUsd ?? 0;
  const assetWorth = liquidUsd + illiquidUsd;
  const netWorth = assetWorth - debtUsd;
  const netWorthChangePct = wealthHistory.length > 1
    ? ((wealthHistory[wealthHistory.length - 1].value - wealthHistory[wealthHistory.length - 2].value)
      / Math.max(1, wealthHistory[wealthHistory.length - 2].value)) * 100
    : 0;
  const savingsTargetPct = 20;
  const savingsRateDeltaPct = savingsRate - savingsTargetPct;

  return (
    <CurrencyCtx.Provider value={currencyCtx}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track your wealth and cashflow</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Display currency toggle */}
              <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button key={c} onClick={() => setDisplayCurrency(c)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${displayCurrency === c ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
              {/* Time range */}
              <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((r) => (
                  <button key={r} onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${timeRange === r ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={handleRefresh} disabled={refreshing}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Refresh prices">
                <RefreshCw size={16} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={signOutUser} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Sign out">
                <LogOut size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* FX rates strip */}
          {(fxRates.EGP || fxRates.SAR) && (
            <div className="flex gap-4 mb-4 text-xs text-gray-400">
              {fxRates.EGP && <span>1 USD = {fxRates.EGP.toFixed(2)} EGP</span>}
              {fxRates.SAR && <span>1 USD = {fxRates.SAR.toFixed(2)} SAR</span>}
            </div>
          )}

          {priceError && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">⚠️ {priceError}</div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard title="Net Worth" value={netWorth} change={netWorthChangePct} icon={Wallet} iconBg="bg-blue-500" />
            <KpiCard title="Monthly Income" value={currentMonthData.inflow || monthlyIncomeUsd} change={cashflowChangePct} icon={DollarSign} iconBg="bg-green-500" />
            <KpiCard title="Net Cashflow" value={monthlyCashflowUsd} change={cashflowChangePct} icon={BarChart2} iconBg="bg-purple-500" />
            <KpiCard title="Debt Outstanding" value={debtUsd} change={-avgDebtApr} icon={TrendingDown} iconBg="bg-orange-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <SectionCard title="Savings Health">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Savings rate</p>
                  <p className={`text-lg font-bold ${savingsRate >= savingsTargetPct ? 'text-green-600' : 'text-amber-600'}`}>
                    {savingsRate.toFixed(1)}%
                  </p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${savingsRate >= savingsTargetPct ? 'bg-green-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }} />
                </div>
                <p className="text-xs text-gray-500">
                  Target {savingsTargetPct}% · {savingsRateDeltaPct >= 0 ? '+' : ''}{savingsRateDeltaPct.toFixed(1)} pts
                </p>
              </div>
            </SectionCard>
            <SectionCard title="Debt Snapshot">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Total debt</span><span className="font-semibold text-gray-900">{currencyCtx.fmtD(debtUsd)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Avg APR</span><span className="font-semibold text-gray-900">{avgDebtApr.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Min monthly payments</span><span className="font-semibold text-gray-900">{currencyCtx.fmtD(minDebtPaymentUsd)}</span></div>
              </div>
            </SectionCard>
            <SectionCard title="Runway Estimate">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Months covered by cash</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyOutflowUsd > 0 ? ((computed?.cashUsd ?? 0) / monthlyOutflowUsd).toFixed(1) : '∞'}
                </p>
                <p className="text-xs text-gray-500">Based on cash only and current month outflows</p>
              </div>
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <SectionCard title="Fixed vs Variable Spend">
              <div className="space-y-3">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${fixedSharePct}%` }} />
                  <div className="bg-orange-400 h-full" style={{ width: `${100 - fixedSharePct}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-medium">Fixed</p>
                    <p className="font-bold text-gray-900">{currencyCtx.fmtD(fixedSpendUsd)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-orange-600 font-medium">Variable</p>
                    <p className="font-bold text-gray-900">{currencyCtx.fmtD(variableSpendUsd)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Based on this month cashflow entries (falls back to recurring bills when empty).</p>
              </div>
            </SectionCard>
            <SectionCard title="Upcoming Due Payments (30 days)">
              {upcomingBills.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No upcoming bills in next 30 days.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingBills.map((bill, i) => (
                    <div key={`${bill.name}-${i}`} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{bill.name || 'Bill'}</p>
                        <p className="text-[11px] text-gray-500">
                          {bill.nextDue.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {bill.diffDays === 0 ? 'Due today' : `In ${bill.diffDays} days`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{fmt(bill.amount, bill.currency || 'USD')}</p>
                        {bill.currency !== 'USD' && <p className="text-[10px] text-gray-400">≈ {currencyCtx.fmtD(bill.amountUsd)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <SectionCard title="Overdue Bills Alert">
              {overdueBills.length === 0 ? (
                <p className="text-sm text-green-600 py-4 text-center">No overdue manual bills this month.</p>
              ) : (
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-700">
                    {overdueBills.length} overdue bill{overdueBills.length > 1 ? 's' : ''} require attention.
                  </div>
                  {overdueBills.map((bill, i) => (
                    <div key={`${bill.name}-overdue-${i}`} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{bill.name || 'Bill'}</p>
                        <p className="text-[11px] text-gray-500">
                          Due {bill.dueThisMonth.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · Manual payment
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{fmt(bill.amount, bill.currency || 'USD')}</p>
                        {bill.currency !== 'USD' && <p className="text-[10px] text-gray-400">≈ {currencyCtx.fmtD(bill.amountUsd)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Autopay Failure Risk">
              {manualDueSoonBills.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">Low risk: no manual bills due in the next 5 days.</p>
                  <p className="text-xs text-gray-500">Your near-term recurring obligations are covered by autopay or have later due dates.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    autopayRiskLevel === 'high'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {autopayRiskLevel === 'high' ? 'High' : 'Medium'} risk: {manualDueSoonBills.length} manual bill{manualDueSoonBills.length > 1 ? 's' : ''} due soon ({currencyCtx.fmtD(manualRiskUsd)}).
                  </div>
                  <div className="space-y-2">
                    {manualDueSoonBills.slice(0, 4).map((bill, i) => (
                      <div key={`${bill.name}-manual-risk-${i}`} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{bill.name || 'Bill'}</p>
                          <p className="text-[11px] text-gray-500">
                            {bill.diffDays === 0 ? 'Due today' : `Due in ${bill.diffDays} day${bill.diffDays > 1 ? 's' : ''}`}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{fmt(bill.amount, bill.currency || 'USD')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Wealth History */}
          <WealthHistoryCard wealthHistory={wealthHistory} snapshots={wealthSnapshots}
            timeRange={timeRange} onSaveSnapshots={(v) => saveDash({ wealthSnapshots: v })} className="mb-6" />

          {/* Asset Allocation + Income Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <SectionCard title="Asset Allocation">
              {computed?.allocationData?.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={computed.allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                        {computed.allocationData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => currencyCtx.fmtD(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    {computed.allocationData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span className="text-gray-600">{d.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{currencyCtx.fmtD(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-sm text-gray-400 py-8 text-center">No holdings data yet.</p>}
            </SectionCard>
            <IncomeSourcesSection sources={incomeSources} onSave={(v) => saveDash({ incomeSources: v })} />
          </div>

          {/* Cash */}
          {(holdings?.cash?.length > 0) && (
            <div className="mb-6">
              <CashSection rows={holdings.cash ?? []} fxRates={fxRates} onSave={(rows) => saveHoldingSection('cash', rows)} />
            </div>
          )}

          <div className="mb-6">
            <LiabilitiesSection rows={liabilities} onSave={(v) => saveDash({ liabilities: v })} />
          </div>

          <div className="mb-6">
            <RecurringBillsSection rows={recurringBills} onSave={(v) => saveDash({ recurringBills: v })} />
          </div>

          <div className="mb-6">
            <CashflowSection entries={cashflowEntries} onSave={(v) => saveDash({ cashflowEntries: v })} />
          </div>

          {/* Crypto */}
          {computed?.cryptoRows !== undefined && (
            <div className="mb-6">
              <CryptoSection rows={computed.cryptoRows} onSave={(rows) => saveHoldingSection('crypto', rows)} />
            </div>
          )}

          {/* Stocks */}
          {computed?.stockRows !== undefined && (
            <div className="mb-6">
              <StocksSection rows={computed.stockRows} onSave={(rows) => saveHoldingSection('stocks', rows)} />
            </div>
          )}

          {/* Gold */}
          {computed?.goldRows !== undefined && (
            <div className="mb-6">
              <GoldSection rows={computed.goldRows} onSave={(rows) => saveHoldingSection('gold', rows)} />
            </div>
          )}

          {/* Budget + Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <BudgetSection budget={budget} onSave={(v) => saveDash({ budget: v })} />
            <ExpenseSection categories={expenseCategories} recentExpenses={recentExpenses}
              onSave={(v) => saveDash({ expenseCategories: v.categories, recentExpenses: v.recentExpenses })} />
          </div>

          {/* Goals + Net Worth Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <GoalsSection goals={goals} onSave={(v) => saveDash({ goals: v })} />

            <SectionCard title="Net Worth Breakdown">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center"><Wallet size={12} className="text-white" /></div>
                      <p className="text-xs font-semibold text-blue-700">Liquid Assets</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{currencyCtx.fmtD(liquidUsd)}</p>
                    <p className="text-xs text-blue-500">{assetWorth > 0 ? ((liquidUsd / assetWorth) * 100).toFixed(1) : 0}% of total assets</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center"><Target size={12} className="text-white" /></div>
                      <p className="text-xs font-semibold text-purple-700">Illiquid Assets</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{currencyCtx.fmtD(illiquidUsd)}</p>
                    <p className="text-xs text-purple-500">{assetWorth > 0 ? ((illiquidUsd / assetWorth) * 100).toFixed(1) : 0}% of total assets</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" /> Liquid Assets
                  </p>
                  {[
                    { label: 'Cash & Savings', val: computed?.cashUsd ?? 0 },
                    { label: 'Cryptocurrency', val: computed?.cryptoUsd ?? 0 },
                    { label: 'Stocks & ETFs', val: computed?.stocksUsd ?? 0 },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                      <span className="text-gray-600">{r.label}</span>
                      <span className="font-semibold text-gray-900">{currencyCtx.fmtD(r.val)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" /> Liabilities
                  </p>
                  <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                    <span className="text-gray-600">Debt</span>
                    <span className="font-semibold text-red-600">-{currencyCtx.fmtD(debtUsd)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Net Worth</p>
                  <div className="flex justify-between text-sm py-2 rounded-lg bg-gray-50 px-2">
                    <span className="text-gray-700">Assets - Liabilities</span>
                    <span className="font-bold text-gray-900">{currencyCtx.fmtD(netWorth)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full inline-block" /> Illiquid Assets
                  </p>
                  <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                    <span className="text-gray-600">Precious Metals</span>
                    <span className="font-semibold text-gray-900">{currencyCtx.fmtD(computed?.goldUsd ?? 0)}</span>
                  </div>
                </div>
                {assetWorth > 0 && (
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    💡 Liquidity ratio of {((liquidUsd / assetWorth) * 100).toFixed(1)}% indicates{' '}
                    {liquidUsd / assetWorth > 0.6 ? 'strong' : 'moderate'} access to liquid funds.
                  </p>
                )}
              </div>
            </SectionCard>
          </div>

          {user && <p className="text-center text-xs text-gray-400 pb-4">Signed in as {user.email}</p>}
        </div>
      </div>
    </CurrencyCtx.Provider>
  );
}
