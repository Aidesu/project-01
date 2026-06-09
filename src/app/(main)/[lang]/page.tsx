import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getDashboardData } from "@/services/budgetService";
import { getCurrentUser } from "@/lib/dal";
import StatCard from "@/components/main/StatCard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import type { ColorTheme } from "@/components/main/StatCard";

interface PageProps {
    params: Promise<{ lang: string }>;
}

const LOCALE_MAP: Record<string, string> = {
    fr: "fr-FR",
    ja: "ja-JP",
    en: "en-US",
};

function calcTrend(current: number, previous: number | undefined): number | null {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
}

export default async function DashboardPage({ params }: PageProps) {
    const { lang } = await params;

    const [dict, data, user] = await Promise.all([
        getDictionary(lang),
        getDashboardData(),
        getCurrentUser(),
    ]);

    const locale = LOCALE_MAP[lang] ?? "en-US";

    // ── État vide : aucun budget ─────────────────────────────────────────────
    if (!data.hasBudgets) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                        {dict.dashboard?.noDataYet}
                    </h2>
                    <p className="text-sm text-zinc-500 mb-5">
                        {dict.dashboard?.createFirstBudget}
                    </p>
                    <Link
                        href={`/${lang}/budgets/new`}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium text-white transition shadow-lg shadow-purple-900/30"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {dict.dashboard?.createBudget}
                    </Link>
                </div>
            </div>
        );
    }

    // ── Données KPI ──────────────────────────────────────────────────────────
    const s = data.summary!;
    const p = data.previousSummary;

    const kpi: { key: keyof typeof s; theme: ColorTheme }[] = [
        { key: "income",    theme: "emerald" },
        { key: "fixed",     theme: "orange"  },
        { key: "variable",  theme: "blue"    },
        { key: "savings",   theme: "purple"  },
        { key: "remaining", theme: "purple"  },
    ];

    // ── Période de référence ─────────────────────────────────────────────────
    const periodLabel = data.summaryPeriod
        ? new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(
              new Date(data.summaryPeriod.year, data.summaryPeriod.month - 1, 1),
          )
        : "";

    const dictKpiName: Record<string, string> = {
        income:    dict.totalIncome,
        fixed:     dict.totalFixedExpenses,
        variable:  dict.totalVariableExpenses,
        savings:   dict.totalSavings,
        remaining: dict.remaining,
    };

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {dict.welcome}
                        {user?.name ? (
                            <span className="text-purple-400">, {user.name.split(" ")[0]}</span>
                        ) : null}
                    </h1>
                    {periodLabel && (
                        <p className="text-sm text-zinc-500 mt-0.5 capitalize">{periodLabel}</p>
                    )}
                </div>

                <Link
                    href={`/${lang}/budgets/new`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#0d0d11] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-purple-500/40 hover:text-white"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {dict.dashboard?.createBudget}
                </Link>
            </div>

            {/* ── Bannière : pas de budget pour le mois en cours ─────────── */}
            {!data.isCurrentMonth && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-amber-300/80">
                            {dict.dashboard?.noBudgetCurrentMonth}
                        </p>
                    </div>
                    <Link
                        href={`/${lang}/budgets/new`}
                        className="shrink-0 rounded-lg bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25"
                    >
                        {dict.dashboard?.createBudget} →
                    </Link>
                </div>
            )}

            {/* ── KPI Cards ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {kpi.map(({ key, theme }) => (
                    <StatCard
                        key={key}
                        name={dictKpiName[key]}
                        amount={s[key]}
                        colorTheme={theme}
                        locale={locale}
                        trend={p ? calcTrend(s[key], p[key]) : null}
                    />
                ))}
            </div>

            {/* ── Charts ──────────────────────────────────────────────────── */}
            <DashboardCharts
                evolution={data.evolution}
                distribution={data.distribution}
                lang={lang}
                dict={dict}
            />
        </div>
    );
}
