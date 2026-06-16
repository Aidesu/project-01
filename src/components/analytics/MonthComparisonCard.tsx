import AnalyticsCard from "./AnalyticsCard";
import { formatCurrency, formatPeriod, interpolate } from "@/lib/format";
import type { MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface MonthComparisonCardProps {
    current: MonthlyPoint | null;
    previous: MonthlyPoint | null;
    currency: string;
    lang: string;
    locale: string;
    dict: Dictionary;
}

/**
 * Comparaison mois courant vs mois précédent, ligne par ligne
 * (revenus, dépenses, épargne, restant) avec delta en %.
 */
export default function MonthComparisonCard({
    current,
    previous,
    currency,
    lang,
    locale,
    dict,
}: MonthComparisonCardProps) {
    const t = dict.analytics.comparison;

    if (!current || !previous) {
        return (
            <AnalyticsCard title={t.title} accent="emerald">
                <div className="flex h-full min-h-36 items-center justify-center">
                    <p className="text-sm text-zinc-500 text-center">{t.noPrevious}</p>
                </div>
            </AnalyticsCard>
        );
    }

    const rows: {
        name: string;
        now: number;
        before: number;
        /** true si une hausse est une bonne nouvelle (revenus, épargne, restant) */
        upIsGood: boolean;
    }[] = [
        { name: t.income, now: current.income, before: previous.income, upIsGood: true },
        { name: t.expenses, now: current.expenses, before: previous.expenses, upIsGood: false },
        { name: t.savings, now: current.savings, before: previous.savings, upIsGood: true },
        { name: t.remaining, now: current.remaining, before: previous.remaining, upIsGood: true },
    ];

    return (
        <AnalyticsCard
            title={t.title}
            subtitle={interpolate(t.subtitle, {
                period: formatPeriod(previous.month, previous.year, lang),
            })}
            accent="emerald"
        >
            <ul className="divide-y divide-zinc-800/60">
                {rows.map((row) => {
                    const delta = row.before !== 0
                        ? ((row.now - row.before) / Math.abs(row.before)) * 100
                        : null;
                    const up = delta !== null && delta >= 0;
                    const good = delta === null ? null : up === row.upIsGood;

                    return (
                        <li key={row.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                            <span className="text-xs font-medium text-zinc-400">{row.name}</span>
                            <span className="flex items-center gap-3">
                                <span className="text-[11px] text-zinc-600 line-through decoration-zinc-700">
                                    {formatCurrency(row.before, locale, currency)}
                                </span>
                                <span className="text-sm font-semibold text-white">
                                    {formatCurrency(row.now, locale, currency)}
                                </span>
                                {delta !== null && (
                                    <span
                                        className={`flex w-16 items-center justify-end gap-0.5 text-[11px] font-semibold ${
                                            good ? "text-emerald-400" : "text-rose-400"
                                        }`}
                                    >
                                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            {up ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                                            )}
                                        </svg>
                                        {Math.abs(delta).toFixed(1)}%
                                    </span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </AnalyticsCard>
    );
}
