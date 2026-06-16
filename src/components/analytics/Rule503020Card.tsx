import AnalyticsCard from "./AnalyticsCard";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface Rule503020CardProps {
    /** Parts du revenu (0–1) : besoins (fixes), envies (variables), épargne */
    rule: { needs: number; wants: number; savings: number } | null;
    dict: Dictionary;
}

const COLORS = {
    needs: "#f97316",
    wants: "#3b82f6",
    savings: "#a855f7",
    unallocated: "#3f3f46",
};

function Bar({
    label,
    segments,
}: {
    label: string;
    segments: { key: string; value: number; color: string }[];
}) {
    return (
        <div>
            <p className="mb-1.5 text-[11px] font-medium text-zinc-500">{label}</p>
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-zinc-800/80">
                {segments.map(
                    (seg) =>
                        seg.value > 0 && (
                            <div
                                key={seg.key}
                                className="h-full first:rounded-l-full last:rounded-r-full"
                                style={{
                                    width: `${Math.min(seg.value, 1) * 100}%`,
                                    background: seg.color,
                                }}
                            />
                        ),
                )}
            </div>
        </div>
    );
}

/**
 * Compare la répartition réelle du budget (besoins / envies / épargne en
 * % du revenu) à la règle 50/30/20 recommandée. Deux barres empilées.
 */
export default function Rule503020Card({ rule, dict }: Rule503020CardProps) {
    const t = dict.analytics.rule;

    if (!rule) {
        return (
            <AnalyticsCard title={t.title} subtitle={t.subtitle} accent="purple">
                <div className="flex h-full min-h-36 items-center justify-center">
                    <p className="text-sm text-zinc-500 text-center">{t.noIncome}</p>
                </div>
            </AnalyticsCard>
        );
    }

    const allocated = rule.needs + rule.wants + rule.savings;
    const unallocated = Math.max(1 - allocated, 0);

    const legend = [
        { key: "needs", name: t.needs, color: COLORS.needs, value: rule.needs, target: 50 },
        { key: "wants", name: t.wants, color: COLORS.wants, value: rule.wants, target: 30 },
        { key: "savings", name: t.savings, color: COLORS.savings, value: rule.savings, target: 20 },
    ];

    return (
        <AnalyticsCard title={t.title} subtitle={t.subtitle} accent="purple">
            <div className="flex h-full flex-col justify-between gap-5">
                <div className="space-y-4">
                    <Bar
                        label={t.yourBudget}
                        segments={[
                            { key: "needs", value: rule.needs, color: COLORS.needs },
                            { key: "wants", value: rule.wants, color: COLORS.wants },
                            { key: "savings", value: rule.savings, color: COLORS.savings },
                            { key: "rest", value: unallocated, color: COLORS.unallocated },
                        ]}
                    />
                    <Bar
                        label={t.recommended}
                        segments={[
                            { key: "needs", value: 0.5, color: COLORS.needs },
                            { key: "wants", value: 0.3, color: COLORS.wants },
                            { key: "savings", value: 0.2, color: COLORS.savings },
                        ]}
                    />
                </div>

                <ul className="grid grid-cols-3 gap-2">
                    {legend.map((item) => (
                        <li key={item.key} className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                                <span
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ background: item.color }}
                                />
                                {item.name}
                            </span>
                            <span className="pl-3.5 text-xs font-semibold text-white">
                                {Math.round(item.value * 100)}%
                                <span className="ml-1 text-[10px] font-medium text-zinc-600">
                                    / {item.target}%
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </AnalyticsCard>
    );
}
