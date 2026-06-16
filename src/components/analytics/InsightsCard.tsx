import AnalyticsCard from "./AnalyticsCard";
import { formatPeriod, interpolate } from "@/lib/format";
import type { Insight } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface InsightsCardProps {
    insights: Insight[];
    lang: string;
    dict: Dictionary;
    /** Limite le nombre d'insights affichés (ex: 3 sur le dashboard) */
    limit?: number;
}

type Tone = "good" | "warn" | "bad" | "info";

const TONES: Record<Tone, { dot: string; bg: string; border: string }> = {
    good: { dot: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/15" },
    warn: { dot: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/15" },
    bad: { dot: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/15" },
    info: { dot: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/15" },
};

const ICONS: Record<Tone, React.ReactNode> = {
    good: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    warn: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    bad: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
};

function resolveInsight(
    insight: Insight,
    lang: string,
    dict: Dictionary,
): { text: string; tone: Tone } {
    const t = dict.analytics.insights;
    const fieldLabels = dict.budgetForm.fields as Record<string, string>;

    switch (insight.kind) {
        case "negativeRemaining":
            return { text: t.negativeRemaining, tone: "bad" };
        case "expensesUp":
            return { text: interpolate(t.expensesUp, { pct: insight.pct }), tone: "warn" };
        case "expensesDown":
            return { text: interpolate(t.expensesDown, { pct: insight.pct }), tone: "good" };
        case "savingsRateGood":
            return { text: interpolate(t.savingsRateGood, { pct: insight.pct }), tone: "good" };
        case "savingsRateLow":
            return { text: interpolate(t.savingsRateLow, { pct: insight.pct }), tone: "warn" };
        case "goalReached":
            return { text: t.goalReached, tone: "good" };
        case "goalProgress":
            return { text: interpolate(t.goalProgress, { pct: insight.pct }), tone: "info" };
        case "topCategory":
            return {
                text: interpolate(t.topCategory, {
                    category: fieldLabels[insight.label] ?? insight.label,
                    pct: insight.pct,
                }),
                tone: "info",
            };
        case "bestMonth":
            return {
                text: interpolate(t.bestMonth, {
                    month: formatPeriod(insight.month, insight.year, lang),
                }),
                tone: "info",
            };
    }
}

/** Liste d'observations générées automatiquement à partir des données budgétaires. */
export default function InsightsCard({ insights, lang, dict, limit }: InsightsCardProps) {
    const t = dict.analytics.insights;
    const items = (limit ? insights.slice(0, limit) : insights).map((insight) =>
        resolveInsight(insight, lang, dict),
    );

    return (
        <AnalyticsCard title={t.title} subtitle={t.subtitle} accent="blue">
            {items.length === 0 ? (
                <div className="flex h-full min-h-24 items-center justify-center">
                    <p className="text-sm text-zinc-500 text-center">{t.noInsights}</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {items.map((item, index) => {
                        const tone = TONES[item.tone];
                        return (
                            <li
                                key={index}
                                className={`flex items-start gap-2.5 rounded-lg border ${tone.border} ${tone.bg} px-3 py-2`}
                            >
                                <svg
                                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone.dot}`}
                                    fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
                                >
                                    {ICONS[item.tone]}
                                </svg>
                                <p className="text-xs leading-relaxed text-zinc-300">{item.text}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </AnalyticsCard>
    );
}
