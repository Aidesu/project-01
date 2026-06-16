import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAnalyticsData } from "@/services/analyticsService";
import { formatPeriod } from "@/lib/format";
import YearStatsStrip from "@/components/analytics/YearStatsStrip";
import HealthScoreCard from "@/components/analytics/HealthScoreCard";
import SavingsGoalCard from "@/components/analytics/SavingsGoalCard";
import Rule503020Card from "@/components/analytics/Rule503020Card";
import MonthComparisonCard from "@/components/analytics/MonthComparisonCard";
import TopCategoriesCard from "@/components/analytics/TopCategoriesCard";
import InsightsCard from "@/components/analytics/InsightsCard";
import ExportCsvButton from "@/components/analytics/ExportCsvButton";
import { CashflowChart, SavingsRateChart } from "@/components/analytics/AnalyticsCharts";

interface PageProps {
    params: Promise<{ lang: string }>;
}

const LOCALE_MAP: Record<string, string> = {
    fr: "fr-FR",
    ja: "ja-JP",
    en: "en-US",
};

export default async function AnalyticsPage({ params }: PageProps) {
    const { lang } = await params;

    const [dict, data] = await Promise.all([getDictionary(lang), getAnalyticsData()]);
    const t = dict.analytics;
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
                    <h2 className="text-lg font-semibold text-white mb-1">{t.noDataYet}</h2>
                    <p className="text-sm text-zinc-500 mb-5">{t.createFirstBudget}</p>
                    <Link
                        href={`/${lang}/budgets/new`}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium text-white transition shadow-lg shadow-purple-900/30"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t.createBudget}
                    </Link>
                </div>
            </div>
        );
    }

    const periodLabel = data.reference
        ? formatPeriod(data.reference.month, data.reference.year, lang)
        : "";

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t.title}</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        {t.subtitle}
                        {periodLabel && (
                            <span className="capitalize"> · {periodLabel}</span>
                        )}
                    </p>
                </div>
                <ExportCsvButton months={data.months} label={t.exportCsv} />
            </div>

            {/* ── L'année en un coup d'œil ────────────────────────────────── */}
            <YearStatsStrip year={data.year} currency={data.currency} locale={locale} dict={dict} />

            {/* ── Santé / Objectif / 50-30-20 ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <HealthScoreCard health={data.health} current={data.current} lang={lang} dict={dict} />
                <SavingsGoalCard
                    current={data.current}
                    savingsGoal={data.savingsGoal}
                    currency={data.currency}
                    lang={lang}
                    locale={locale}
                    dict={dict}
                />
                <Rule503020Card rule={data.rule} dict={dict} />
            </div>

            {/* ── Cash flow + comparaison mensuelle ───────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <CashflowChart months={data.months} lang={lang} dict={dict} />
                </div>
                <MonthComparisonCard
                    current={data.current}
                    previous={data.previous}
                    currency={data.currency}
                    lang={lang}
                    locale={locale}
                    dict={dict}
                />
            </div>

            {/* ── Taux d'épargne + top catégories ─────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <SavingsRateChart months={data.months} lang={lang} dict={dict} />
                </div>
                <TopCategoriesCard
                    topCategories={data.topCategories}
                    current={data.current}
                    currency={data.currency}
                    lang={lang}
                    locale={locale}
                    dict={dict}
                />
            </div>

            {/* ── Insights ────────────────────────────────────────────────── */}
            <InsightsCard insights={data.insights} lang={lang} dict={dict} />
        </div>
    );
}
