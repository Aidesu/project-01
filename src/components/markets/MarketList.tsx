"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AssetIcon from "./AssetIcon";
import ChangeBadge from "./ChangeBadge";
import Sparkline from "./Sparkline";
import { currencyPairName, formatPrice } from "@/lib/format";
import type { AssetType, MarketAsset } from "@/services/marketService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface MarketListProps {
    assets: MarketAsset[];
    lang: string;
    locale: string;
    dict: Dictionary;
}

type Filter = "all" | AssetType;

const BADGE_STYLES: Record<AssetType, string> = {
    crypto: "bg-purple-500/10 text-purple-400",
    stock: "bg-blue-500/10 text-blue-400",
    forex: "bg-amber-500/10 text-amber-400",
};

export default function MarketList({ assets, lang, locale, dict }: MarketListProps) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const m = dict.markets;

    const badgeLabels: Record<AssetType, string> = {
        crypto: m.cryptoBadge,
        stock: m.stockBadge,
        forex: m.forexBadge,
    };

    // Libellés localisés ("Euro / Dollar des États-Unis") pour l'affichage ET la recherche
    const named = useMemo(
        () =>
            assets.map((asset) => ({
                asset,
                displayName: asset.pair
                    ? currencyPairName(asset.pair.base, asset.pair.quote, locale)
                    : asset.name,
            })),
        [assets, locale],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return named.filter(
            ({ asset, displayName }) =>
                (filter === "all" || asset.type === filter) &&
                (q === "" ||
                    displayName.toLowerCase().includes(q) ||
                    asset.symbol.toLowerCase().includes(q)),
        );
    }, [named, query, filter]);

    const tabs: { key: Filter; label: string; count: number }[] = [
        { key: "all", label: m.all, count: assets.length },
        { key: "crypto", label: m.crypto, count: assets.filter((a) => a.type === "crypto").length },
        { key: "stock", label: m.stocks, count: assets.filter((a) => a.type === "stock").length },
        { key: "forex", label: m.forex, count: assets.filter((a) => a.type === "forex").length },
    ];

    return (
        <div className="space-y-4">
            {/* ── Recherche + filtres ─────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <svg
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={m.searchPlaceholder}
                        className="w-full rounded-lg border border-zinc-800 bg-[#0d0d11] py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                </div>

                <div className="flex gap-1.5">
                    {tabs.map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                filter === key
                                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                                    : "border-zinc-800 bg-[#0d0d11] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                            }`}
                        >
                            {label}
                            <span
                                className={`rounded px-1 text-[10px] tabular-nums ${
                                    filter === key ? "bg-purple-500/20" : "bg-zinc-800/80"
                                }`}
                            >
                                {count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Liste ───────────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11]">
                {/* En-tête */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-zinc-900 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_6rem_8rem_1.25rem]">
                    <span>{m.asset}</span>
                    <span className="text-right">{m.price}</span>
                    <span className="hidden text-right sm:block">{m.change24h}</span>
                    <span className="hidden text-right sm:block">{m.last7d}</span>
                    <span className="hidden sm:block" />
                </div>

                {filtered.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-zinc-600">{m.noResults}</p>
                ) : (
                    <ul className="divide-y divide-zinc-900">
                        {filtered.map(({ asset, displayName }) => (
                            <li key={asset.id}>
                                <Link
                                    href={`/${lang}/markets/${encodeURIComponent(asset.id)}`}
                                    className="group grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-purple-500/[0.04] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_6rem_8rem_1.25rem]"
                                >
                                    {/* Actif */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <AssetIcon
                                            symbol={asset.symbol}
                                            image={asset.image}
                                            label={asset.pair ? `${asset.pair.base[0]}${asset.pair.quote[0]}` : undefined}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-zinc-100">
                                                {displayName}
                                            </p>
                                            <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                                <span className="font-medium">{asset.symbol}</span>
                                                <span
                                                    className={`rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide ${BADGE_STYLES[asset.type]}`}
                                                >
                                                    {badgeLabels[asset.type]}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Prix + variation (la variation passe sous le prix en mobile) */}
                                    <div className="text-right">
                                        <p className="text-sm font-bold tabular-nums text-white">
                                            {formatPrice(asset.price, locale, asset.currency, asset.type === "forex")}
                                        </p>
                                        <div className="mt-0.5 sm:hidden">
                                            <ChangeBadge value={asset.change24h} locale={locale} />
                                        </div>
                                    </div>

                                    <div className="hidden text-right sm:block">
                                        <ChangeBadge value={asset.change24h} locale={locale} />
                                    </div>

                                    <div className="hidden sm:block">
                                        <Sparkline values={asset.spark} />
                                    </div>

                                    <svg
                                        className="hidden h-3.5 w-3.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-purple-400 sm:block"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <p className="text-[11px] text-zinc-600">{m.dataNote}</p>
        </div>
    );
}
