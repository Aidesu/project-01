import { formatCurrency, interpolate } from "@/lib/format";
import type { DashboardSummary } from "@/services/budgetService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface BalanceHeroCardProps {
    summary: DashboardSummary;
    previous: DashboardSummary | null;
    periodLabel: string;
    locale: string;
    currency: string;
    dict: Dictionary;
}

const SEGMENTS = [
    { key: "fixed", color: "#f97316" },
    { key: "variable", color: "#3b82f6" },
    { key: "savings", color: "#a855f7" },
    { key: "remaining", color: "#10b981" },
] as const;

/**
 * Carte héro du tableau de bord : répond d'un coup d'œil à la question
 * « combien me reste-t-il ce mois-ci ? » avec la répartition du revenu.
 * Rendu 100 % serveur.
 */
export default function BalanceHeroCard({
    summary,
    previous,
    periodLabel,
    locale,
    currency,
    dict,
}: BalanceHeroCardProps) {
    const overBudget = summary.remaining < 0;

    // Dénominateur de la barre : si le budget déborde, on normalise sur le
    // total alloué pour que la barre reste pleine sans déborder.
    const allocated = summary.fixed + summary.variable + summary.savings;
    const denominator = Math.max(summary.income, allocated, 1);

    const segmentNames: Record<(typeof SEGMENTS)[number]["key"], string> = {
        fixed: dict.totalFixedExpenses,
        variable: dict.totalVariableExpenses,
        savings: dict.totalSavings,
        remaining: dict.remaining,
    };

    // Tendance du restant vs mois précédent (seulement si comparable)
    const trend =
        previous && previous.remaining > 0
            ? ((summary.remaining - previous.remaining) / previous.remaining) * 100
            : null;
    const trendUp = trend !== null && trend >= 0;

    const allocatedPct = summary.income > 0
        ? Math.round((allocated / summary.income) * 100)
        : null;

    return (
        <div
            className="rounded-xl w-full relative h-full"
            style={{
                padding: "1px",
                background: overBudget
                    ? "linear-gradient(135deg, #f43f5e66 0%, #3b1d2e 60%, #1e1316 100%)"
                    : "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #3b1d6e 80%, #1e1333 100%)",
                boxShadow: overBudget
                    ? "0 0 32px 0 rgba(244,63,94,0.12)"
                    : "0 0 32px 0 rgba(124,58,237,0.18)",
            }}
        >
            <div className="relative flex h-full flex-col justify-between gap-5 rounded-xl bg-[#0f0b1a] p-5 overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                        background:
                            "radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.10) 0%, transparent 60%)",
                    }}
                />

                {/* Montant restant + tendance */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                            {dict.dashboard.leftToSpend}
                            <span className="ml-2 font-medium normal-case tracking-normal text-zinc-500 capitalize">
                                {periodLabel}
                            </span>
                        </p>
                        <p
                            className={`mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight leading-none ${
                                overBudget ? "text-rose-400" : "text-white"
                            }`}
                        >
                            {formatCurrency(summary.remaining, locale, currency)}
                        </p>
                    </div>

                    {overBudget ? (
                        <span className="shrink-0 rounded-md border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-400">
                            {dict.dashboard.overBudget}
                        </span>
                    ) : trend !== null ? (
                        <span
                            className={`flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                                trendUp
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                    : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                            }`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                {trendUp ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                                )}
                            </svg>
                            {Math.abs(trend).toFixed(1)}% {dict.dashboard.vsLastMonth}
                        </span>
                    ) : null}
                </div>

                {/* Barre de répartition du revenu + légende */}
                <div className="relative z-10">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800/80">
                        {SEGMENTS.map(({ key, color }) => {
                            const value = Math.max(summary[key], 0);
                            return (
                                value > 0 && (
                                    <div
                                        key={key}
                                        className="h-full first:rounded-l-full last:rounded-r-full"
                                        style={{
                                            width: `${(value / denominator) * 100}%`,
                                            background: color,
                                        }}
                                    />
                                )
                            );
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {SEGMENTS.map(({ key, color }) => (
                                <li key={key} className="flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ background: color }}
                                    />
                                    <span className="text-[11px] font-medium text-zinc-400">
                                        {segmentNames[key]}
                                    </span>
                                    <span className="text-[11px] font-semibold text-zinc-200">
                                        {formatCurrency(summary[key], locale, currency)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {allocatedPct !== null && (
                            <span className="text-[11px] font-medium text-zinc-500">
                                {interpolate(dict.dashboard.allocated, { pct: allocatedPct })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
