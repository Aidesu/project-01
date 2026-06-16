import { getDictionary } from "@/lib/i18n/dictionaries";
import { getGoals, summarizeGoals } from "@/services/goalService";
import { getCurrentUser } from "@/lib/dal";
import { formatCurrency, formatPercent } from "@/lib/format";
import GoalsBoard from "@/components/goals/GoalsBoard";

interface PageProps {
    params: Promise<{ lang: string }>;
}

const LOCALE_MAP: Record<string, string> = {
    fr: "fr-FR",
    ja: "ja-JP",
    en: "en-US",
};

export default async function GoalsPage({ params }: PageProps) {
    const { lang } = await params;

    const [dict, goals, user] = await Promise.all([
        getDictionary(lang),
        getGoals(),
        getCurrentUser(),
    ]);

    const locale = LOCALE_MAP[lang] ?? "en-US";
    const currency = user?.currency ?? "USD";
    const summary = summarizeGoals(goals);

    const stats = [
        {
            name: dict.goals.summary.saved,
            value: formatCurrency(summary.totalSaved, locale, currency),
            color: "#a855f7",
        },
        {
            name: dict.goals.summary.target,
            value: formatCurrency(summary.totalTarget, locale, currency),
            color: "#3b82f6",
        },
        {
            name: dict.goals.summary.overall,
            value:
                summary.totalTarget > 0
                    ? formatPercent((summary.totalSaved / summary.totalTarget) * 100, locale)
                    : "—",
            color: "#10b981",
        },
        {
            name: dict.goals.summary.reached,
            value: `${summary.reachedCount} / ${summary.count}`,
            color: "#f59e0b",
        },
    ];

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div>
                <h1 className="text-2xl font-bold text-white">{dict.goals.title}</h1>
                <p className="text-sm text-zinc-500 mt-0.5">{dict.goals.subtitle}</p>
            </div>

            {/* ── Résumé global ──────────────────────────────────────────── */}
            {goals.length > 0 && (
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
            )}

            {/* ── Grille des objectifs ───────────────────────────────────── */}
            <GoalsBoard
                goals={goals}
                userName={user?.name ?? null}
                lang={lang}
                locale={locale}
                currency={currency}
                dict={dict}
            />
        </div>
    );
}
