import AnalyticsCard from "./AnalyticsCard";
import { formatCurrency, formatPeriod, interpolate } from "@/lib/format";
import type { CategoryAmount, MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface TopCategoriesCardProps {
    topCategories: CategoryAmount[];
    current: MonthlyPoint | null;
    currency: string;
    lang: string;
    locale: string;
    dict: Dictionary;
}

const TYPE_COLORS: Record<CategoryAmount["type"], string> = {
    FIXED: "#f97316",
    VARIABLE: "#3b82f6",
};

/**
 * Classement des plus gros postes de dépenses du mois de référence,
 * avec leur part du total (barres horizontales CSS).
 */
export default function TopCategoriesCard({
    topCategories,
    current,
    currency,
    lang,
    locale,
    dict,
}: TopCategoriesCardProps) {
    const t = dict.analytics.topCategories;
    const fieldLabels = dict.budgetForm.fields as Record<string, string>;

    const subtitle = current
        ? interpolate(t.subtitle, { period: formatPeriod(current.month, current.year, lang) })
        : undefined;

    if (topCategories.length === 0) {
        return (
            <AnalyticsCard title={t.title} subtitle={subtitle} accent="orange">
                <div className="flex h-full min-h-36 items-center justify-center">
                    <p className="text-sm text-zinc-500 text-center">{t.noExpenses}</p>
                </div>
            </AnalyticsCard>
        );
    }

    const maxShare = topCategories[0].share || 1;

    return (
        <AnalyticsCard title={t.title} subtitle={subtitle} accent="orange">
            <ul className="space-y-3">
                {topCategories.map((cat, index) => (
                    <li key={`${cat.label}-${index}`}>
                        <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="flex items-center gap-2 min-w-0">
                                <span className="text-[11px] font-mono font-bold text-zinc-600 w-3 shrink-0">
                                    {index + 1}
                                </span>
                                <span className="text-xs font-medium text-zinc-300 truncate">
                                    {fieldLabels[cat.label] ?? cat.label}
                                </span>
                            </span>
                            <span className="text-xs font-semibold text-zinc-200 whitespace-nowrap">
                                {formatCurrency(cat.amount, locale, currency)}
                                <span className="ml-1.5 text-[10px] font-medium text-zinc-500">
                                    {Math.round(cat.share * 100)}% {t.ofExpenses}
                                </span>
                            </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800/80 ml-5 max-w-[calc(100%-1.25rem)]">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.round((cat.share / maxShare) * 100)}%`,
                                    background: TYPE_COLORS[cat.type],
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </AnalyticsCard>
    );
}
