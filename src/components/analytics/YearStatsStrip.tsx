import { formatCurrency, formatPercent } from "@/lib/format";
import type { YearStats } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface YearStatsStripProps {
    year: YearStats;
    currency: string;
    locale: string;
    dict: Dictionary;
}

/** Bandeau compact « l'année en un coup d'œil » : 4 statistiques clés. */
export default function YearStatsStrip({ year, currency, locale, dict }: YearStatsStripProps) {
    const t = dict.analytics.yearStats;

    const stats = [
        {
            name: t.totalSaved,
            value: formatCurrency(year.totalSaved, locale, currency),
            color: "#a855f7",
        },
        {
            name: t.avgSavingsRate,
            value:
                year.avgSavingsRate !== null
                    ? formatPercent(year.avgSavingsRate, locale, 1)
                    : "—",
            color: "#10b981",
        },
        {
            name: t.avgExpenses,
            value: formatCurrency(year.avgExpenses, locale, currency),
            color: "#f97316",
        },
        {
            name: t.monthsTracked,
            value: `${year.monthsTracked} / 12`,
            color: "#3b82f6",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] px-4 py-3.5 shadow-xl"
                >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{
                            background: `linear-gradient(180deg, ${stat.color}99 0%, ${stat.color}22 100%)`,
                        }}
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                        {stat.name}
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white tracking-tight">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
