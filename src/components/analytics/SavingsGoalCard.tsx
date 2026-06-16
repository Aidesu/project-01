import Link from "next/link";
import AnalyticsCard from "./AnalyticsCard";
import { formatCurrency, formatPeriod, interpolate } from "@/lib/format";
import type { MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface SavingsGoalCardProps {
    current: MonthlyPoint | null;
    savingsGoal: number | null;
    currency: string;
    lang: string;
    locale: string;
    dict: Dictionary;
}

/**
 * Progression de l'objectif d'épargne mensuel (User.savingsGoal)
 * sous forme d'anneau SVG — rendu 100 % serveur, aucun JS client.
 */
export default function SavingsGoalCard({
    current,
    savingsGoal,
    currency,
    lang,
    locale,
    dict,
}: SavingsGoalCardProps) {
    const t = dict.analytics.savingsGoal;
    const saved = current?.savings ?? 0;

    const subtitle = current
        ? interpolate(t.subtitle, { period: formatPeriod(current.month, current.year, lang) })
        : undefined;

    // Pas d'objectif défini : invite à en créer un sur la page Compte
    if (!savingsGoal || savingsGoal <= 0) {
        return (
            <AnalyticsCard title={t.title} subtitle={subtitle} accent="purple">
                <div className="flex h-full min-h-36 flex-col items-center justify-center gap-3 text-center">
                    <p className="text-sm text-zinc-500">{t.noGoal}</p>
                    <Link
                        href={`/${lang}/accounts`}
                        className="rounded-lg border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20"
                    >
                        {t.setGoal} →
                    </Link>
                </div>
            </AnalyticsCard>
        );
    }

    const ratio = Math.min(saved / savingsGoal, 1);
    const pct = Math.round((saved / savingsGoal) * 100);
    const reached = saved >= savingsGoal;

    // Anneau SVG : r=52 → circonférence ≈ 326.7
    const R = 52;
    const CIRC = 2 * Math.PI * R;
    const color = reached ? "#10b981" : "#a855f7";

    return (
        <AnalyticsCard
            title={t.title}
            subtitle={subtitle}
            accent={reached ? "emerald" : "purple"}
        >
            <div className="flex h-full items-center justify-center gap-6">
                <div className="relative h-32 w-32 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                        <circle
                            cx="60" cy="60" r={R} fill="none"
                            stroke="#27272a" strokeWidth="10"
                        />
                        <circle
                            cx="60" cy="60" r={R} fill="none"
                            stroke={color} strokeWidth="10" strokeLinecap="round"
                            strokeDasharray={CIRC}
                            strokeDashoffset={CIRC * (1 - ratio)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-white leading-none">
                            {pct}%
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <p className="text-xl font-bold text-white leading-tight">
                        {formatCurrency(saved, locale, currency)}
                        <span className="ml-1.5 text-xs font-medium text-zinc-500">
                            {t.saved}
                        </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                        {interpolate(t.ofGoal, {
                            goal: formatCurrency(savingsGoal, locale, currency),
                        })}
                    </p>
                    {reached ? (
                        <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {t.reached}
                        </span>
                    ) : (
                        <span className="mt-1 inline-flex w-fit rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
                            {interpolate(t.remainingToGoal, {
                                amount: formatCurrency(savingsGoal - saved, locale, currency),
                            })}
                        </span>
                    )}
                </div>
            </div>
        </AnalyticsCard>
    );
}
