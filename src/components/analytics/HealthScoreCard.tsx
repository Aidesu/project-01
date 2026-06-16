import AnalyticsCard from "./AnalyticsCard";
import { formatPeriod, interpolate } from "@/lib/format";
import type { HealthScore, MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface HealthScoreCardProps {
    health: HealthScore | null;
    current: MonthlyPoint | null;
    lang: string;
    dict: Dictionary;
}

function scoreTheme(score: number) {
    if (score >= 75) return { color: "#10b981", labelKey: "excellent" as const };
    if (score >= 50) return { color: "#3b82f6", labelKey: "good" as const };
    if (score >= 25) return { color: "#f97316", labelKey: "fair" as const };
    return { color: "#f43f5e", labelKey: "poor" as const };
}

/**
 * Score de santé budgétaire 0–100 (jauge semi-circulaire SVG) avec ses
 * trois composantes : taux d'épargne, maîtrise des dépenses, marge de sécurité.
 */
export default function HealthScoreCard({ health, current, lang, dict }: HealthScoreCardProps) {
    const t = dict.analytics.healthScore;

    const subtitle = current
        ? interpolate(t.subtitle, { period: formatPeriod(current.month, current.year, lang) })
        : undefined;

    if (!health) {
        return (
            <AnalyticsCard title={t.title} subtitle={subtitle} accent="blue">
                <div className="flex h-full min-h-36 items-center justify-center">
                    <p className="text-sm text-zinc-500 text-center">{t.noIncome}</p>
                </div>
            </AnalyticsCard>
        );
    }

    const { color, labelKey } = scoreTheme(health.score);

    // Demi-jauge : arc de 180° (r=50 → demi-circonférence ≈ 157.1)
    const R = 50;
    const HALF = Math.PI * R;

    const bars = [
        { name: t.savingsRate, value: health.savingsRate, color: "#a855f7" },
        { name: t.spendingControl, value: health.spendingControl, color: "#3b82f6" },
        { name: t.safetyMargin, value: health.safetyMargin, color: "#10b981" },
    ];

    return (
        <AnalyticsCard title={t.title} subtitle={subtitle} accent="blue">
            <div className="flex h-full flex-col items-center gap-4">
                <div className="relative w-36">
                    <svg viewBox="0 0 120 65" className="w-full">
                        <path
                            d={`M 10 60 A ${R} ${R} 0 0 1 110 60`}
                            fill="none" stroke="#27272a" strokeWidth="10" strokeLinecap="round"
                        />
                        <path
                            d={`M 10 60 A ${R} ${R} 0 0 1 110 60`}
                            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                            strokeDasharray={HALF}
                            strokeDashoffset={HALF * (1 - health.score / 100)}
                        />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-white leading-none">
                            {health.score}
                        </span>
                        <span className="text-[11px] font-semibold mt-0.5" style={{ color }}>
                            {t[labelKey]}
                        </span>
                    </div>
                </div>

                <div className="w-full space-y-2.5">
                    {bars.map((bar) => (
                        <div key={bar.name}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-medium text-zinc-400">
                                    {bar.name}
                                </span>
                                <span className="text-[11px] font-semibold text-zinc-300">
                                    {Math.round(bar.value * 100)}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-800/80">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${Math.round(bar.value * 100)}%`,
                                        background: bar.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnalyticsCard>
    );
}
