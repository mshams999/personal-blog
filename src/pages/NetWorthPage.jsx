import { useEffect, useMemo, useState } from 'react';
import { Coins, RefreshCw, TrendingUp, Wallet, Gem, Building2, LogOut } from 'lucide-react';
import { Kicker, SectionHeader, Standfirst, Rule } from '../components/editorial';
import { getHoldings } from '../services/networthService';
import { fetchPrices } from '../services/pricesService';
import { useAuth } from '../context/AuthContext';

const fmtUSD = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
const fmtEGP = (n) =>
    new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n || 0);
const fmtQty = (n, digits = 4) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n || 0);

/** Distinct palettes so each source reads at a glance (borders + fills stay subtle on editorial paper). */
const CATEGORY = {
    cash: {
        label: 'نقد',
        icon: Wallet,
        bar: 'bg-emerald-500',
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-500/30',
        border: 'border-emerald-500/35',
        edge: 'border-s-emerald-500',
        surface: 'bg-emerald-500/[0.07] dark:bg-emerald-400/[0.09]',
        iconBg: 'bg-emerald-500/18 text-emerald-800 dark:text-emerald-200',
        labelTone: 'text-emerald-900/90 dark:text-emerald-100/95',
    },
    crypto: {
        label: 'عملات رقمية',
        icon: Coins,
        bar: 'bg-violet-500',
        dot: 'bg-violet-500',
        ring: 'ring-violet-500/30',
        border: 'border-violet-500/35',
        edge: 'border-s-violet-500',
        surface: 'bg-violet-500/[0.07] dark:bg-violet-400/[0.09]',
        iconBg: 'bg-violet-500/18 text-violet-800 dark:text-violet-200',
        labelTone: 'text-violet-900/90 dark:text-violet-100/95',
    },
    stocks: {
        label: 'أسهم',
        icon: TrendingUp,
        bar: 'bg-sky-600',
        dot: 'bg-sky-600',
        ring: 'ring-sky-500/30',
        border: 'border-sky-500/35',
        edge: 'border-s-sky-600',
        surface: 'bg-sky-500/[0.07] dark:bg-sky-400/[0.09]',
        iconBg: 'bg-sky-500/18 text-sky-900 dark:text-sky-100',
        labelTone: 'text-sky-950/90 dark:text-sky-50/95',
    },
    gold: {
        label: 'ذهب',
        icon: Gem,
        bar: 'bg-amber-500',
        dot: 'bg-amber-500',
        ring: 'ring-amber-500/30',
        border: 'border-amber-500/40',
        edge: 'border-s-amber-500',
        surface: 'bg-amber-500/[0.08] dark:bg-amber-400/[0.10]',
        iconBg: 'bg-amber-500/20 text-amber-900 dark:text-amber-100',
        labelTone: 'text-amber-950/90 dark:text-amber-50/95',
    },
    manual: {
        label: 'أصول أخرى',
        icon: Building2,
        bar: 'bg-rose-500',
        dot: 'bg-rose-500',
        ring: 'ring-rose-500/30',
        border: 'border-rose-500/35',
        edge: 'border-s-rose-500',
        surface: 'bg-rose-500/[0.07] dark:bg-rose-400/[0.09]',
        iconBg: 'bg-rose-500/18 text-rose-800 dark:text-rose-200',
        labelTone: 'text-rose-900/90 dark:text-rose-100/95',
    },
};

const ORDER = ['cash', 'crypto', 'stocks', 'gold', 'manual'];

const GOLD_KARAT_MAX = 24;

const computeRows = (holdings, prices, goldPerGramUsd, fxRates) => {
    const rows = { cash: [], crypto: [], stocks: [], gold: [], manual: [] };

    for (const item of holdings.cash) {
        const cur = item.currency;
        const amt = Number(item.amount);
        let subtotalUsd = null;
        let unitUsd = null;
        if (cur === 'USD') {
            subtotalUsd = amt;
            unitUsd = 1;
        } else if (fxRates?.[cur] != null) {
            subtotalUsd = amt / fxRates[cur];
            unitUsd = 1 / fxRates[cur];
        }
        rows.cash.push({
            label: item.label,
            quantity: item.amount,
            quantityLabel: `${fmtQty(item.amount, 2)} ${cur}`,
            unitUsd,
            subtotalUsd,
            _egpAmount: cur === 'EGP' ? amt : null,
        });
    }

    for (const item of holdings.crypto) {
        const p = prices[item.symbol];
        const subtotal = p != null ? Number(item.quantity) * p : null;
        rows.crypto.push({
            label: item.symbol,
            quantity: item.quantity,
            quantityLabel: fmtQty(item.quantity, 6),
            unitUsd: p,
            subtotalUsd: subtotal,
        });
    }

    for (const item of holdings.stocks) {
        const p = prices[item.symbol];
        const subtotal = p != null ? Number(item.quantity) * p : null;
        rows.stocks.push({
            label: item.symbol,
            quantity: item.quantity,
            quantityLabel: fmtQty(item.quantity, 2),
            unitUsd: p,
            subtotalUsd: subtotal,
        });
    }

    for (const item of holdings.gold) {
        const karat = item.karat != null ? Number(item.karat) : GOLD_KARAT_MAX;
        const purity = karat / GOLD_KARAT_MAX;
        const effectiveGoldPerGram =
            goldPerGramUsd != null ? goldPerGramUsd * purity : null;
        const subtotal =
            effectiveGoldPerGram != null ? Number(item.grams) * effectiveGoldPerGram : null;
        rows.gold.push({
            label: item.label,
            quantity: item.grams,
            quantityLabel: `${fmtQty(item.grams, 2)} g${karat !== GOLD_KARAT_MAX ? ` · ${karat}k` : ''}`,
            unitUsd: effectiveGoldPerGram,
            subtotalUsd: subtotal,
        });
    }

    for (const item of holdings.manual) {
        rows.manual.push({
            label: item.label,
            quantity: 1,
            quantityLabel: '—',
            unitUsd: Number(item.valueUsd),
            subtotalUsd: Number(item.valueUsd),
        });
    }

    return rows;
};

const ClassCard = ({ id, rows, subtotalUsd, usdToEgp }) => {
    const meta = CATEGORY[id];
    const Icon = meta.icon;
    if (!rows.length) return null;

    return (
        <section
            className={`rounded-2xl border ${meta.border} ${meta.edge} border-s-4 bg-paper/80 shadow-sm backdrop-blur-sm ${meta.surface} overflow-hidden`}
        >
            <div className={`flex flex-col gap-4 border-b ${meta.border} px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6`}>
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}
                        aria-hidden
                    >
                        <Icon className="h-5 w-5" />
                    </span>
                    <div>
                        <p className={`font-display text-lg ${meta.labelTone}`}>{meta.label}</p>
                        <p className="text-xs text-ink-muted font-sans">تفاصيل هذا المصدر</p>
                    </div>
                </div>
                <div className="text-end sm:min-w-[9rem]">
                    <div className={`font-display text-xl tabular-nums ${meta.labelTone}`}>{fmtUSD(subtotalUsd)}</div>
                    {usdToEgp && (
                        <div className="text-xs text-ink-muted tabular-nums">{fmtEGP(subtotalUsd * usdToEgp)}</div>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto px-3 sm:px-5 pb-4">
                <table className="w-full min-w-[32rem] text-sm">
                    <thead>
                        <tr className={`text-ink-muted text-xs uppercase tracking-wide border-b ${meta.border}`}>
                            <th className="text-start py-3 pe-2 font-sans">البيان</th>
                            <th className="text-start py-3 pe-2 font-sans">الكمية</th>
                            <th className="text-start py-3 pe-2 font-sans">سعر الوحدة</th>
                            <th className="text-end py-3 ps-2 font-sans">المجموع (USD)</th>
                            <th className="text-end py-3 ps-2 font-sans">المجموع (EGP)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i} className={`border-b border-rule/40 last:border-0`}>
                                <td className="py-3 text-ink font-serif">{r.label}</td>
                                <td className="py-3 text-ink-muted tabular-nums">{r.quantityLabel}</td>
                                <td className="py-3 text-ink-muted tabular-nums">
                                    {r.unitUsd != null ? fmtUSD(r.unitUsd) : '—'}
                                </td>
                                <td className="py-3 text-end text-ink tabular-nums">
                                    {r.subtotalUsd != null ? fmtUSD(r.subtotalUsd) : '—'}
                                </td>
                                <td className="py-3 text-end text-ink-muted tabular-nums">
                                    {r.subtotalUsd != null && usdToEgp
                                        ? fmtEGP(r.subtotalUsd * usdToEgp)
                                        : r._egpAmount != null
                                          ? fmtEGP(r._egpAmount)
                                          : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const SourceOverview = ({ subtotals, totalUsd }) => {
    const entries = ORDER.map((id) => ({
        id,
        ...CATEGORY[id],
        value: subtotals[id] || 0,
    })).filter((e) => e.value > 0);

    if (!entries.length || !totalUsd) return null;

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {entries.map((e) => {
                const pct = (e.value / totalUsd) * 100;
                return (
                    <div
                        key={e.id}
                        className={`rounded-xl border ${e.border} ${e.surface} px-4 py-3 shadow-sm ring-1 ${e.ring}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.dot}`} aria-hidden />
                            <span className={`text-xs font-sans uppercase tracking-wide ${e.labelTone}`}>{e.label}</span>
                        </div>
                        <p className="mt-2 font-display text-lg text-ink tabular-nums">{fmtUSD(e.value)}</p>
                        <p className="text-xs text-ink-muted font-sans tabular-nums">{pct.toFixed(1)}٪ من الإجمالي</p>
                    </div>
                );
            })}
        </div>
    );
};

const AllocationStrip = ({ subtotals, totalUsd }) => {
    if (!totalUsd) return null;
    const entries = ORDER.map((id) => ({ id, ...CATEGORY[id], v: subtotals[id] || 0 })).filter((x) => x.v > 0);
    if (!entries.length) return null;

    return (
        <div className="rounded-2xl border border-rule/80 bg-paper/90 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <Kicker>التوزيع حسب المصدر</Kicker>
                <p className="text-xs text-ink-muted font-sans">كل لون يطابق البطاقة أدناه</p>
            </div>
            <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-rule/60 flex shadow-inner">
                {entries.map(({ id, v, bar }) => {
                    const pct = (v / totalUsd) * 100;
                    return (
                        <div
                            key={id}
                            className={`${bar} min-w-[4px] transition-[width] duration-500 ease-out`}
                            style={{ width: `${pct}%` }}
                            title={`${CATEGORY[id].label}: ${pct.toFixed(1)}%`}
                        />
                    );
                })}
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {entries.map(({ id, v, dot }) => (
                    <li key={id} className="flex items-center gap-2">
                        <span className={`h-3 w-3 shrink-0 rounded-sm ${dot}`} aria-hidden />
                        <span className="text-ink-muted font-sans">{CATEGORY[id].label}</span>
                        <span className="font-display text-ink tabular-nums">{((v / totalUsd) * 100).toFixed(1)}٪</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const NetWorthPage = () => {
    const { user, signOut } = useAuth();
    const [holdings, setHoldings] = useState(null);
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [refreshedAt, setRefreshedAt] = useState(null);

    const loadAll = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError(null);

            const h = holdings || (await getHoldings());
            if (!holdings) setHoldings(h);

            const cryptoSymbols = h.crypto.map((x) => x.symbol);
            const stockSymbols = h.stocks.map((x) => x.symbol);
            const includeGold = h.gold.length > 0;
            const fxCurrencies = [
                ...new Set(
                    (h.cash || [])
                        .map((x) => x.currency)
                        .filter((c) => c && c !== 'USD' && c !== 'EGP'),
                ),
            ];

            const pd = await fetchPrices({ cryptoSymbols, stockSymbols, includeGold, fxCurrencies });
            setPriceData(pd);
            setRefreshedAt(new Date());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAll(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { rows, subtotals, totalUsd, usdToEgp } = useMemo(() => {
        if (!holdings || !priceData) {
            return { rows: null, subtotals: {}, totalUsd: 0, usdToEgp: null };
        }
        const fx = priceData.usdToEgp;
        const fxRates = priceData.fxRates || {};
        const r = computeRows(holdings, priceData.prices, priceData.goldPerGramUsd, fxRates);

        const sum = (arr) => arr.reduce((acc, x) => acc + (x.subtotalUsd || 0), 0);
        const subs = {
            cash: sum(r.cash),
            crypto: sum(r.crypto),
            stocks: sum(r.stocks),
            gold: sum(r.gold),
            manual: sum(r.manual),
        };
        const total = Object.values(subs).reduce((a, b) => a + b, 0);
        return { rows: r, subtotals: subs, totalUsd: total, usdToEgp: fx };
    }, [holdings, priceData]);

    const today = new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-paper via-paper to-emerald-500/[0.04] py-10 sm:py-16 dark:from-paper dark:via-paper dark:to-violet-500/[0.06]"
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <SectionHeader
                    kicker="صافي الثروة"
                    title="الميزانية الشخصية"
                    trailing={
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                            <span className="text-sm text-ink-muted">{today}</span>
                            <button
                                type="button"
                                onClick={() => loadAll(true)}
                                disabled={refreshing}
                                className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper/90 px-4 py-2 text-xs font-sans text-ink shadow-sm transition hover:border-accent/30 hover:bg-accent/5 disabled:opacity-50"
                                aria-label="تحديث الأسعار"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                                تحديث الأسعار
                            </button>
                            <button
                                type="button"
                                onClick={signOut}
                                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-ink-muted transition hover:bg-rule/50 hover:text-ink"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                خروج
                            </button>
                        </div>
                    }
                />

                {loading && (
                    <div className="rounded-2xl border border-dashed border-rule bg-paper/60 px-6 py-12 text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                        <Standfirst className="!mb-0">جاري تحميل البيانات والأسعار…</Standfirst>
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-rose-500/35 bg-rose-500/[0.06] p-6 text-ink shadow-sm">
                        <p className="font-serif">تعذّر التحميل: {error}</p>
                    </div>
                )}

                {!loading && rows && (
                    <>
                        <section className="relative overflow-hidden rounded-2xl border border-rule/90 bg-paper p-6 shadow-md sm:p-10">
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-emerald-500 via-violet-500 to-amber-500 opacity-90"
                                aria-hidden
                            />
                            <Kicker>الإجمالي اليوم</Kicker>
                            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div>
                                    <div className="text-ink-muted text-xs font-sans uppercase tracking-wider">دولار أمريكي</div>
                                    <div className="font-display text-4xl tabular-nums text-ink sm:text-5xl">{fmtUSD(totalUsd)}</div>
                                </div>
                                <div>
                                    <div className="text-ink-muted text-xs font-sans uppercase tracking-wider">جنيه مصري</div>
                                    <div className="font-display text-4xl tabular-nums text-ink sm:text-5xl">
                                        {usdToEgp ? fmtEGP(totalUsd * usdToEgp) : '—'}
                                    </div>
                                </div>
                            </div>

                            {totalUsd > 0 && (
                                <div className="mt-8">
                                    <SourceOverview subtotals={subtotals} totalUsd={totalUsd} />
                                </div>
                            )}

                            {refreshedAt && (
                                <p className="mt-8 text-xs text-ink-muted font-sans">
                                    آخر تحديث: {refreshedAt.toLocaleString('ar-EG')}
                                    {usdToEgp && ` · USD/EGP = ${usdToEgp.toFixed(2)}`}
                                </p>
                            )}
                            {priceData?.errors?.length > 0 && (
                                <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-950 dark:text-amber-100 font-sans">
                                    تنبيه أسعار: {priceData.errors.join(' · ')}
                                </p>
                            )}
                        </section>

                        <AllocationStrip subtotals={subtotals} totalUsd={totalUsd} />

                        <Rule />

                        <div className="space-y-8">
                            {ORDER.map((id) => (
                                <ClassCard
                                    key={id}
                                    id={id}
                                    rows={rows[id]}
                                    subtotalUsd={subtotals[id]}
                                    usdToEgp={usdToEgp}
                                />
                            ))}
                        </div>

                        {holdings && Object.values(rows).every((r) => r.length === 0) && (
                            <Standfirst>
                                لا توجد بيانات بعد. أضف المقتنيات إلى مستند Firestore{' '}
                                <code className="font-mono text-sm">networth/holdings</code>.
                            </Standfirst>
                        )}

                        <p className="border-t border-rule/60 pt-6 text-center text-xs text-ink-muted font-sans">
                            تم تسجيل الدخول باسم {user?.email}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default NetWorthPage;
