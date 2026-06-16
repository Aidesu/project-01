import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
    CHART_RANGES,
    getAssetChart,
    getMarketAssets,
    resolveAsset,
    type ChartRange,
} from "@/services/marketService";
import AssetIcon from "@/components/markets/AssetIcon";
import ChangeBadge from "@/components/markets/ChangeBadge";
import CandlestickChart from "@/components/markets/CandlestickChart";
import LiveCandlestickChart from "@/components/markets/LiveCandlestickChart";
import { currencyPairName, formatCompact, formatPrice } from "@/lib/format";
import type { AssetType } from "@/services/marketService";

const BADGE_STYLES: Record<AssetType, string> = {
    crypto: "bg-purple-500/10 text-purple-400",
    stock: "bg-blue-500/10 text-blue-400",
    forex: "bg-amber-500/10 text-amber-400",
};

interface PageProps {
    params: Promise<{ lang: string; asset: string }>;
    searchParams: Promise<{ range?: string }>;
}

const LOCALE_MAP: Record<string, string> = {
    fr: "fr-FR",
    ja: "ja-JP",
    en: "en-US",
};

export default async function AssetPage({ params, searchParams }: PageProps) {
    const [{ lang, asset: rawId }, { range: rawRange }] = await Promise.all([
        params,
        searchParams,
    ]);

    const asset = await resolveAsset(decodeURIComponent(rawId));
    if (!asset) notFound();

    const range: ChartRange = CHART_RANGES.includes(rawRange as ChartRange)
        ? (rawRange as ChartRange)
        : "3mo";

    const [dict, chart, assets] = await Promise.all([
        getDictionary(lang),
        getAssetChart(asset.id, range),
        getMarketAssets(),
    ]);

    const locale = LOCALE_MAP[lang] ?? "en-US";
    const m = dict.markets;
    // Données « live » de la liste (logo, variation 24 h) — facultatives
    const live = assets.find((a) => a.id === asset.id) ?? null;

    const currency = chart?.currency ?? live?.currency ?? "USD";
    const price = chart?.price ?? live?.price ?? null;
    const lastCandle = chart?.candles[chart.candles.length - 1] ?? null;
    const isForex = asset.type === "forex";
    const displayName = asset.pair
        ? currencyPairName(asset.pair.base, asset.pair.quote, locale)
        : (live?.name ?? asset.name);

    const badgeLabels: Record<AssetType, string> = {
        crypto: m.cryptoBadge,
        stock: m.stockBadge,
        forex: m.forexBadge,
    };

    const stats = lastCandle
        ? [
              { label: m.open, value: formatPrice(lastCandle.o, locale, currency, isForex) },
              { label: m.high, value: formatPrice(lastCandle.h, locale, currency, isForex) },
              { label: m.low, value: formatPrice(lastCandle.l, locale, currency, isForex) },
              // Le repli CoinGecko ne fournit pas de volume
              ...(lastCandle.v > 0
                  ? [{ label: m.volume, value: formatCompact(lastCandle.v, locale) }]
                  : []),
          ]
        : [];

    const rangeLabels: Record<ChartRange, string> = {
        live: m.rangeLive,
        "1d": m.range1d,
        "1mo": m.range1mo,
        "3mo": m.range3mo,
        "1y": m.range1y,
        "5y": m.range5y,
        max: m.rangeMax,
    };
    const isLive = range === "live";

    return (
        <div className="space-y-6">
            {/* ── Retour ──────────────────────────────────────────────── */}
            <Link
                href={`/${lang}/markets`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-purple-400"
            >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                {m.back}
            </Link>

            {/* ── En-tête de l'actif ──────────────────────────────────── */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <AssetIcon
                        symbol={asset.symbol}
                        image={live?.image ?? asset.image}
                        size="lg"
                        label={asset.pair ? `${asset.pair.base[0]}${asset.pair.quote[0]}` : undefined}
                    />
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {displayName}
                        </h1>
                        <p className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                            <span className="font-semibold">{asset.symbol}</span>
                            <span
                                className={`rounded px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[asset.type]}`}
                            >
                                {badgeLabels[asset.type]}
                            </span>
                            {chart?.exchange && <span>{chart.exchange}</span>}
                        </p>
                    </div>
                </div>

                {price !== null && (
                    <div className="text-right">
                        <p className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                            {formatPrice(price, locale, currency, isForex)}
                        </p>
                        {live?.change24h != null && (
                            <div className="mt-1 flex items-center justify-end gap-1.5">
                                <ChangeBadge value={live.change24h} locale={locale} />
                                <span className="text-[11px] text-zinc-600">{m.change24h}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Stats de la dernière séance ─────────────────────────── */}
            {stats.length > 0 && (
                <div className={`grid grid-cols-2 gap-4 ${stats.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                    {stats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-zinc-800/80 bg-[#0d0d11] px-4 py-3"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                                {label}
                            </p>
                            <p className="mt-1 text-sm font-bold tabular-nums text-zinc-100">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Graphique en chandeliers ────────────────────────────── */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] shadow-xl">
                <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, #7c3aed99 0%, #a855f722 100%)" }}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
                    <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                        {m.chartTitle}
                    </h2>
                    <div className="flex gap-1">
                        {CHART_RANGES.map((r) => (
                            <Link
                                key={r}
                                href={`/${lang}/markets/${encodeURIComponent(asset.id)}?range=${r}`}
                                replace
                                scroll={false}
                                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition ${
                                    r === range
                                        ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                }`}
                            >
                                {r === "live" && (
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            isLive ? "animate-pulse bg-emerald-400" : "bg-zinc-600"
                                        }`}
                                    />
                                )}
                                {rangeLabels[r]}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="h-[26rem] px-3 pb-4">
                    {isLive ? (
                        <LiveCandlestickChart
                            key={asset.id}
                            assetId={asset.id}
                            locale={locale}
                            currency={currency}
                            dict={dict}
                            forex={isForex}
                        />
                    ) : chart ? (
                        <CandlestickChart
                            candles={chart.candles}
                            range={range}
                            locale={locale}
                            currency={currency}
                            dict={dict}
                            forex={isForex}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-zinc-600">{m.chartError}</p>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[11px] text-zinc-600">{m.dataNote}</p>
        </div>
    );
}
