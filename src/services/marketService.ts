/**
 * Données de marché (crypto + actions), sans clé d'API :
 * - Liste crypto : CoinGecko `/coins/markets` — top 100 par capitalisation
 *   (prix, variation 24 h, logo, sparkline 7 j) en un seul appel.
 * - Liste actions : endpoint batch `spark` de Yahoo Finance — toutes les
 *   valeurs de l'univers en un seul appel (clôtures 1 mois pour le sparkline).
 * - Chandeliers (détail) : Yahoo chart v8. Pour une crypto on tente la paire
 *   `SYMBOL-USD` avec un garde-fou sur le prix (Yahoo suffixe certains tickers,
 *   ex. Toncoin = TON11419-USD) ; en cas d'échec, repli sur l'OHLC CoinGecko
 *   (sans volume, historique plafonné à 365 j par l'API publique).
 * Chaque appel est mis en cache 5 minutes via `next.revalidate` ; un échec
 * réseau dégrade en liste partielle.
 */

export type AssetType = "crypto" | "stock" | "forex";

export interface MarketAsset {
    /** Segment d'URL : id CoinGecko ("bitcoin"), symbole Yahoo ("aapl") ou paire ("eurusd"). */
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    image: string | null;
    price: number;
    change24h: number | null;
    currency: string;
    /** Codes ISO de la paire (devises uniquement) — l'UI localise le libellé. */
    pair?: { base: string; quote: string };
    /** Série de clôtures récentes pour le sparkline de la liste. */
    spark: number[];
}

export interface Candle {
    /** Timestamp en millisecondes. */
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}

export interface AssetChart {
    candles: Candle[];
    price: number;
    prevClose: number | null;
    currency: string;
    exchange: string | null;
}

/** `live` : bougies 5 s construites côté client à partir de l'endpoint de prix. */
export type ChartRange = "live" | "1d" | "1mo" | "3mo" | "1y" | "5y" | "max";

export const CHART_RANGES: ChartRange[] = ["live", "1d", "1mo", "3mo", "1y", "5y", "max"];

const REVALIDATE_SECONDS = 300;

const STOCK_UNIVERSE = [
    // — Tech US —
    { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Alphabet" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "NFLX", name: "Netflix" },
    { symbol: "AMD", name: "Advanced Micro Devices" },
    { symbol: "INTC", name: "Intel" },
    { symbol: "AVGO", name: "Broadcom" },
    { symbol: "QCOM", name: "Qualcomm" },
    { symbol: "ORCL", name: "Oracle" },
    { symbol: "CRM", name: "Salesforce" },
    { symbol: "ADBE", name: "Adobe" },
    { symbol: "IBM", name: "IBM" },
    { symbol: "UBER", name: "Uber" },
    { symbol: "ABNB", name: "Airbnb" },
    { symbol: "SHOP", name: "Shopify" },
    { symbol: "PYPL", name: "PayPal" },
    { symbol: "COIN", name: "Coinbase" },
    { symbol: "PLTR", name: "Palantir" },
    { symbol: "SNOW", name: "Snowflake" },
    { symbol: "SPOT", name: "Spotify" },
    { symbol: "ASML", name: "ASML" },
    { symbol: "SAP", name: "SAP" },
    // — Conso & industrie US —
    { symbol: "DIS", name: "Walt Disney" },
    { symbol: "NKE", name: "Nike" },
    { symbol: "SBUX", name: "Starbucks" },
    { symbol: "MCD", name: "McDonald's" },
    { symbol: "KO", name: "Coca-Cola" },
    { symbol: "PEP", name: "PepsiCo" },
    { symbol: "WMT", name: "Walmart" },
    { symbol: "COST", name: "Costco" },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "PFE", name: "Pfizer" },
    { symbol: "UNH", name: "UnitedHealth" },
    { symbol: "XOM", name: "ExxonMobil" },
    { symbol: "CVX", name: "Chevron" },
    { symbol: "BA", name: "Boeing" },
    { symbol: "CAT", name: "Caterpillar" },
    { symbol: "GE", name: "GE Aerospace" },
    { symbol: "F", name: "Ford" },
    { symbol: "GM", name: "General Motors" },
    // — Finance US —
    { symbol: "JPM", name: "JPMorgan Chase" },
    { symbol: "BAC", name: "Bank of America" },
    { symbol: "GS", name: "Goldman Sachs" },
    { symbol: "V", name: "Visa" },
    { symbol: "MA", name: "Mastercard" },
    { symbol: "AXP", name: "American Express" },
    { symbol: "BRK-B", name: "Berkshire Hathaway" },
    // — Euronext Paris —
    { symbol: "MC.PA", name: "LVMH" },
    { symbol: "OR.PA", name: "L'Oréal" },
    { symbol: "RMS.PA", name: "Hermès" },
    { symbol: "AIR.PA", name: "Airbus" },
    { symbol: "TTE.PA", name: "TotalEnergies" },
    { symbol: "SAN.PA", name: "Sanofi" },
    { symbol: "BNP.PA", name: "BNP Paribas" },
    { symbol: "AI.PA", name: "Air Liquide" },
    { symbol: "SU.PA", name: "Schneider Electric" },
    { symbol: "DG.PA", name: "Vinci" },
    { symbol: "KER.PA", name: "Kering" },
    { symbol: "CAP.PA", name: "Capgemini" },
    { symbol: "ENGI.PA", name: "Engie" },
    { symbol: "ACA.PA", name: "Crédit Agricole" },
    { symbol: "RNO.PA", name: "Renault" },
    { symbol: "STLAP.PA", name: "Stellantis" },
];

/** Devise de cotation déduite de la place (suffixe Yahoo). */
function currencyFor(symbol: string): string {
    return symbol.endsWith(".PA") ? "EUR" : "USD";
}

/**
 * Paires de devises (codes BASEQUOTE, cotées chez Yahoo en `BASEQUOTE=X`) :
 * majeures, croisements EUR/GBP/JPY et exotiques contre USD.
 */
const FOREX_UNIVERSE = [
    // — Majeures —
    "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD",
    // — Croisements EUR —
    "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD",
    "EURSEK", "EURNOK", "EURDKK", "EURPLN", "EURHUF", "EURCZK", "EURTRY",
    // — Croisements GBP / JPY / AUD —
    "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "AUDJPY", "CADJPY", "CHFJPY", "AUDNZD",
    // — Exotiques contre USD —
    "USDTRY", "USDMXN", "USDBRL", "USDZAR", "USDSEK", "USDNOK", "USDDKK",
    "USDPLN", "USDCNY", "USDHKD", "USDSGD", "USDKRW", "USDINR", "USDTHB",
    "USDIDR", "USDILS",
];

function forexParts(code: string): { base: string; quote: string } {
    return { base: code.slice(0, 3).toUpperCase(), quote: code.slice(3, 6).toUpperCase() };
}

// ── Yahoo Finance ────────────────────────────────────────────────────────────

interface YahooChartResult {
    meta: {
        currency: string;
        regularMarketPrice: number;
        chartPreviousClose?: number;
        fullExchangeName?: string;
        instrumentType?: string;
    };
    timestamp?: number[];
    indicators: {
        quote: {
            open?: (number | null)[];
            high?: (number | null)[];
            low?: (number | null)[];
            close?: (number | null)[];
            volume?: (number | null)[];
        }[];
    };
}

async function fetchYahooChart(
    symbol: string,
    range: string,
    interval: string,
    revalidate: number | false = REVALIDATE_SECONDS,
): Promise<YahooChartResult | null> {
    try {
        const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`,
            {
                headers: { "User-Agent": "Mozilla/5.0" },
                ...(revalidate === false
                    ? { cache: "no-store" as const }
                    : { next: { revalidate } }),
            },
        );
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.chart?.result?.[0] as YahooChartResult) ?? null;
    } catch {
        return null;
    }
}

function parseYahooCandles(result: YahooChartResult): Candle[] {
    const quote = result.indicators.quote[0] ?? {};
    const timestamps = result.timestamp ?? [];
    const candles: Candle[] = [];
    for (let i = 0; i < timestamps.length; i++) {
        const o = quote.open?.[i];
        const h = quote.high?.[i];
        const l = quote.low?.[i];
        const c = quote.close?.[i];
        if (o == null || h == null || l == null || c == null) continue;
        candles.push({ t: timestamps[i] * 1000, o, h, l, c, v: quote.volume?.[i] ?? 0 });
    }
    return candles;
}

// ── Liste ────────────────────────────────────────────────────────────────────

/** Réduit une série à `target` points pour garder les sparklines légers. */
function downsample(values: number[], target = 24): number[] {
    if (values.length <= target) return values;
    const step = (values.length - 1) / (target - 1);
    return Array.from({ length: target }, (_, i) => values[Math.round(i * step)]);
}

interface CoinGeckoMarket {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number | null;
    sparkline_in_7d?: { price: number[] };
}

async function getCryptoAssets(): Promise<MarketAsset[]> {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h",
            { next: { revalidate: REVALIDATE_SECONDS } },
        );
        if (!res.ok) return [];
        const coins = (await res.json()) as CoinGeckoMarket[];
        return coins.map((coin) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            type: "crypto" as const,
            image: coin.image ?? null,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            currency: "USD",
            spark: downsample(coin.sparkline_in_7d?.price ?? []),
        }));
    } catch {
        return [];
    }
}

interface YahooSpark {
    close?: (number | null)[];
}

/** L'endpoint spark refuse plus de 20 symboles par appel. */
const SPARK_BATCH_SIZE = 20;

async function fetchSparkBatch(symbols: string[]): Promise<Record<string, YahooSpark>> {
    try {
        const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(symbols.join(","))}&range=1mo&interval=1d`,
            {
                headers: { "User-Agent": "Mozilla/5.0" },
                next: { revalidate: REVALIDATE_SECONDS },
            },
        );
        if (!res.ok) return {};
        return await res.json();
    } catch {
        return {};
    }
}

/** Spark pour une liste de symboles quelconque, découpée en lots de 20. */
async function fetchSparksChunked(symbols: string[]): Promise<Record<string, YahooSpark>> {
    const batches: string[][] = [];
    for (let i = 0; i < symbols.length; i += SPARK_BATCH_SIZE) {
        batches.push(symbols.slice(i, i + SPARK_BATCH_SIZE));
    }
    const results = await Promise.all(batches.map(fetchSparkBatch));
    return Object.assign({}, ...results);
}

/** Clôtures valides + variation sur la dernière séance d'une réponse spark. */
function sparkSeries(spark: YahooSpark | undefined): { closes: number[]; price: number; change: number | null } | null {
    const closes = (spark?.close ?? []).filter((v): v is number => v != null);
    if (closes.length === 0) return null;
    const price = closes[closes.length - 1];
    // Clôture de la veille = avant-dernier point (le dernier est la séance en cours).
    const prev = closes.length >= 2 ? closes[closes.length - 2] : null;
    return { closes, price, change: prev ? ((price - prev) / prev) * 100 : null };
}

async function getStockAssets(): Promise<MarketAsset[]> {
    const sparks = await fetchSparksChunked(STOCK_UNIVERSE.map((s) => s.symbol));
    const stocks: MarketAsset[] = [];
    for (const { symbol, name } of STOCK_UNIVERSE) {
        const series = sparkSeries(sparks[symbol]);
        if (!series) continue;
        stocks.push({
            id: symbol.toLowerCase(),
            symbol,
            name,
            type: "stock",
            image: null,
            price: series.price,
            change24h: series.change,
            currency: currencyFor(symbol),
            spark: downsample(series.closes),
        });
    }
    return stocks;
}

async function getForexAssets(): Promise<MarketAsset[]> {
    const sparks = await fetchSparksChunked(FOREX_UNIVERSE.map((code) => `${code}=X`));
    const pairs: MarketAsset[] = [];
    for (const code of FOREX_UNIVERSE) {
        const series = sparkSeries(sparks[`${code}=X`]);
        if (!series) continue;
        const pair = forexParts(code);
        pairs.push({
            id: code.toLowerCase(),
            symbol: `${pair.base}/${pair.quote}`,
            name: `${pair.base}/${pair.quote}`,
            type: "forex",
            image: null,
            price: series.price,
            change24h: series.change,
            currency: pair.quote,
            pair,
            spark: downsample(series.closes),
        });
    }
    return pairs;
}

/** Liste complète (crypto, actions, devises). Vide si toutes les sources échouent. */
export async function getMarketAssets(): Promise<MarketAsset[]> {
    const [crypto, stocks, forex] = await Promise.all([
        getCryptoAssets(),
        getStockAssets(),
        getForexAssets(),
    ]);
    return [...crypto, ...stocks, ...forex];
}

// ── Détail ───────────────────────────────────────────────────────────────────

export interface ResolvedAsset {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    image: string | null;
    pair?: { base: string; quote: string };
}

/**
 * Identité d'un actif depuis son segment d'URL. Les actions viennent de
 * l'univers statique ; les cryptos du top 100 CoinGecko (appel mis en cache).
 */
export async function resolveAsset(id: string): Promise<ResolvedAsset | null> {
    const stock = STOCK_UNIVERSE.find((s) => s.symbol.toLowerCase() === id.toLowerCase());
    if (stock) {
        return {
            id: stock.symbol.toLowerCase(),
            symbol: stock.symbol,
            name: stock.name,
            type: "stock",
            image: null,
        };
    }
    const forexCode = FOREX_UNIVERSE.find((code) => code.toLowerCase() === id.toLowerCase());
    if (forexCode) {
        const pair = forexParts(forexCode);
        return {
            id: forexCode.toLowerCase(),
            symbol: `${pair.base}/${pair.quote}`,
            name: `${pair.base}/${pair.quote}`,
            type: "forex",
            image: null,
            pair,
        };
    }
    const coin = (await getCryptoAssets()).find((c) => c.id === id);
    if (coin) {
        return { id: coin.id, symbol: coin.symbol, name: coin.name, type: "crypto", image: coin.image };
    }
    return null;
}

/** Ranges servis par le serveur (`live` est construit côté client). */
type ServerRange = Exclude<ChartRange, "live">;

const RANGE_CONFIG: Record<ServerRange, { range: string; interval: string; revalidate: number }> = {
    "1d": { range: "1d", interval: "5m", revalidate: 60 },
    "1mo": { range: "1mo", interval: "1d", revalidate: REVALIDATE_SECONDS },
    "3mo": { range: "3mo", interval: "1d", revalidate: REVALIDATE_SECONDS },
    "1y": { range: "1y", interval: "1wk", revalidate: REVALIDATE_SECONDS },
    "5y": { range: "5y", interval: "1mo", revalidate: REVALIDATE_SECONDS },
    max: { range: "max", interval: "1mo", revalidate: REVALIDATE_SECONDS },
};

/**
 * L'API publique CoinGecko limite l'historique à 365 jours.
 * `1d` donne des bougies de 30 min (pas de 5 min côté CoinGecko).
 */
const COINGECKO_DAYS: Record<ServerRange, number> = {
    "1d": 1,
    "1mo": 30,
    "3mo": 90,
    "1y": 365,
    "5y": 365,
    max: 365,
};

async function getCoinGeckoCandles(coinId: string, range: ServerRange): Promise<Candle[]> {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId)}/ohlc?vs_currency=usd&days=${COINGECKO_DAYS[range]}`,
            { next: { revalidate: REVALIDATE_SECONDS } },
        );
        if (!res.ok) return [];
        const rows = (await res.json()) as [number, number, number, number, number][];
        if (!Array.isArray(rows)) return [];
        return rows.map(([t, o, h, l, c]) => ({ t, o, h, l, c, v: 0 }));
    } catch {
        return [];
    }
}

/** Chandeliers OHLCV + prix courant pour un actif connu. */
export async function getAssetChart(
    id: string,
    range: ChartRange,
): Promise<AssetChart | null> {
    if (range === "live") return null;
    const { range: yahooRange, interval, revalidate } = RANGE_CONFIG[range];

    const stock = STOCK_UNIVERSE.find((s) => s.symbol.toLowerCase() === id.toLowerCase());
    if (stock) {
        const result = await fetchYahooChart(stock.symbol, yahooRange, interval, revalidate);
        if (!result) return null;
        const candles = parseYahooCandles(result);
        if (candles.length === 0) return null;
        return {
            candles,
            price: result.meta.regularMarketPrice,
            prevClose: result.meta.chartPreviousClose ?? null,
            currency: result.meta.currency ?? currencyFor(stock.symbol),
            exchange: result.meta.fullExchangeName ?? null,
        };
    }

    const forexCode = FOREX_UNIVERSE.find((code) => code.toLowerCase() === id.toLowerCase());
    if (forexCode) {
        const result = await fetchYahooChart(`${forexCode}=X`, yahooRange, interval, revalidate);
        if (!result) return null;
        const candles = parseYahooCandles(result);
        if (candles.length === 0) return null;
        return {
            candles,
            price: result.meta.regularMarketPrice,
            prevClose: result.meta.chartPreviousClose ?? null,
            currency: forexParts(forexCode).quote,
            exchange: null,
        };
    }

    const coin = (await getCryptoAssets()).find((c) => c.id === id);
    if (!coin) return null;

    // 1. Paire Yahoo `SYMBOL-USD`, validée par le prix CoinGecko : un même
    //    ticker peut désigner un autre token chez Yahoo.
    const result = await fetchYahooChart(`${coin.symbol}-USD`, yahooRange, interval, revalidate);
    if (
        result &&
        result.meta.instrumentType === "CRYPTOCURRENCY" &&
        coin.price > 0 &&
        Math.abs(result.meta.regularMarketPrice - coin.price) / coin.price < 0.2
    ) {
        const candles = parseYahooCandles(result);
        if (candles.length > 0) {
            return {
                candles,
                price: result.meta.regularMarketPrice,
                prevClose: result.meta.chartPreviousClose ?? null,
                currency: "USD",
                exchange: null,
            };
        }
    }

    // 2. Repli CoinGecko (sans volume)
    const candles = await getCoinGeckoCandles(coin.id, range);
    if (candles.length === 0) return null;
    return {
        candles,
        price: coin.price,
        prevClose: null,
        currency: "USD",
        exchange: null,
    };
}

// ── Prix instantané (mode live) ──────────────────────────────────────────────

/**
 * Prix courant d'un actif, sans cache — consommé par `/api/markets/price`
 * pour construire les bougies 5 s côté client.
 */
export async function getAssetPrice(id: string): Promise<{ price: number; currency: string } | null> {
    const stock = STOCK_UNIVERSE.find((s) => s.symbol.toLowerCase() === id.toLowerCase());
    if (stock) {
        const result = await fetchYahooChart(stock.symbol, "1d", "1m", false);
        if (!result) return null;
        return {
            price: result.meta.regularMarketPrice,
            currency: result.meta.currency ?? currencyFor(stock.symbol),
        };
    }

    const forexCode = FOREX_UNIVERSE.find((code) => code.toLowerCase() === id.toLowerCase());
    if (forexCode) {
        const result = await fetchYahooChart(`${forexCode}=X`, "1d", "1m", false);
        if (!result) return null;
        return { price: result.meta.regularMarketPrice, currency: forexParts(forexCode).quote };
    }

    const coin = (await getCryptoAssets()).find((c) => c.id === id);
    if (!coin) return null;

    // Même garde-fou que pour les chandeliers : la paire Yahoo doit coller
    // au prix CoinGecko, sinon c'est un autre token.
    const result = await fetchYahooChart(`${coin.symbol}-USD`, "1d", "1m", false);
    if (
        result &&
        result.meta.instrumentType === "CRYPTOCURRENCY" &&
        coin.price > 0 &&
        Math.abs(result.meta.regularMarketPrice - coin.price) / coin.price < 0.2
    ) {
        return { price: result.meta.regularMarketPrice, currency: "USD" };
    }

    // Repli : prix spot CoinGecko
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin.id)}&vs_currencies=usd`,
            { cache: "no-store" },
        );
        if (!res.ok) return null;
        const json = (await res.json()) as Record<string, { usd?: number }>;
        const price = json[coin.id]?.usd;
        return price != null ? { price, currency: "USD" } : null;
    } catch {
        return null;
    }
}
