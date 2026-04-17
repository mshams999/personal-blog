const API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY;
const BASE = 'https://api.twelvedata.com/price';

/** Twelve Data often returns HTTP 200 with { status: 'error', code, message } (e.g. batch limits, bad symbol). */
const isApiErrorBody = (json) =>
    json &&
    (json.status === 'error' || (typeof json.code === 'number' && json.code >= 400));

/**
 * One GET /price per symbol. Batched comma-separated requests are unreliable (different
 * response shapes and error-in-body with HTTP 200), so we parallelize singles instead.
 */
const fetchPriceMap = async (symbols) => {
    if (!symbols.length) return {};
    if (!API_KEY) throw new Error('VITE_TWELVEDATA_API_KEY is not set');

    const unique = [...new Set(symbols)];
    const entries = await Promise.all(
        unique.map(async (sym) => {
            try {
                const url = `${BASE}?symbol=${encodeURIComponent(sym)}&apikey=${API_KEY}`;
                const res = await fetch(url);
                const json = await res.json();

                if (!res.ok) {
                    return [sym, null, json?.message || `HTTP ${res.status}`];
                }
                if (isApiErrorBody(json)) {
                    return [sym, null, json.message || `code ${json.code}`];
                }
                if (json?.price == null) {
                    return [sym, null, 'No price field'];
                }
                return [sym, Number(json.price), null];
            } catch (e) {
                return [sym, null, e.message || 'Request failed'];
            }
        }),
    );

    /** @type {Record<string, number>} */
    const out = {};
    /** @type {string[]} */
    const partialErrors = [];
    for (const [sym, price, err] of entries) {
        if (err != null) partialErrors.push(`${sym}: ${err}`);
        else out[sym] = price;
    }

    return { raw: out, partialErrors };
};

// Fetches unit prices in USD for all requested assets plus FX rates.
// fxCurrencies: extra ISO codes beyond EGP (e.g. ['SAR']). EGP is always requested.
// Twelve Data USD/XXX: price = how many units of XXX per 1 USD (e.g. USD/EGP = EGP per USD).
// Converting local amount to USD: amount / fxRates[XXX].
// Returns: { prices, goldPerGramUsd, fxRates, usdToEgp (alias for fxRates.EGP), errors }
export const fetchPrices = async ({
    cryptoSymbols = [],
    stockSymbols = [],
    includeGold = false,
    fxCurrencies = [],
}) => {
    const errors = [];
    const cryptoSyms = cryptoSymbols.map((s) => `${s}/USD`);
    const goldSym = includeGold ? ['XAU/USD'] : [];
    const fxSet = new Set(['EGP', ...fxCurrencies.filter((c) => c && c !== 'USD')]);
    const fxSym = [...fxSet].map((c) => `USD/${c}`);
    const allSymbols = [...cryptoSyms, ...stockSymbols, ...goldSym, ...fxSym];

    let raw = {};
    try {
        const { raw: map, partialErrors } = await fetchPriceMap(allSymbols);
        raw = map;
        errors.push(...partialErrors);
    } catch (e) {
        errors.push(e.message);
    }

    const prices = {};
    for (const s of cryptoSymbols) {
        const v = raw[`${s}/USD`];
        if (v != null) prices[s] = v;
    }
    for (const s of stockSymbols) {
        const v = raw[s];
        if (v != null) prices[s] = v;
    }

    const goldPerOunceUsd = raw['XAU/USD'];
    const goldPerGramUsd = goldPerOunceUsd ? goldPerOunceUsd / 31.1034768 : null;

    /** @type {Record<string, number>} */
    const fxRates = {};
    for (const c of fxSet) {
        const sym = `USD/${c}`;
        const v = raw[sym];
        if (v != null) fxRates[c] = Number(v);
    }

    const usdToEgp = fxRates.EGP ?? null;

    return { prices, goldPerGramUsd, fxRates, usdToEgp, errors };
};
