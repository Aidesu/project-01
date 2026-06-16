import { db } from "@/lib/db";
import { verifySession, getCurrentUser } from "@/lib/dal";

/**
 * Service d'analyse budgétaire — agrège l'historique des budgets de
 * l'utilisateur en métriques prêtes à afficher (onglet Analyse + dashboard).
 */

export type MonthlyPoint = {
    month: number;
    year: number;
    income: number;
    fixed: number;
    variable: number;
    savings: number;
    expenses: number; // fixed + variable
    remaining: number; // income - expenses - savings
    savingsRate: number | null; // % du revenu épargné (null si revenu nul)
};

export type CategoryAmount = {
    /** Nom du champ formulaire (convention saveBudget) → traduisible via dict.budgetForm.fields */
    label: string;
    type: "FIXED" | "VARIABLE";
    amount: number;
    /** Part des dépenses totales du mois (0–1) */
    share: number;
};

export type HealthScore = {
    /** Score global 0–100 */
    score: number;
    /** Sous-scores 0–1 */
    savingsRate: number;
    spendingControl: number;
    safetyMargin: number;
};

export type Insight =
    | { kind: "expensesUp" | "expensesDown"; pct: number }
    | { kind: "savingsRateLow" | "savingsRateGood"; pct: number }
    | { kind: "goalProgress"; pct: number }
    | { kind: "goalReached" }
    | { kind: "negativeRemaining" }
    | { kind: "topCategory"; label: string; pct: number }
    | { kind: "bestMonth"; month: number; year: number };

export type YearStats = {
    totalSaved: number;
    avgSavingsRate: number | null;
    avgExpenses: number;
    monthsTracked: number;
};

export type AnalyticsData = {
    hasBudgets: boolean;
    /** Mois de référence : mois courant si budgétisé, sinon le plus récent */
    reference: { month: number; year: number } | null;
    isCurrentMonth: boolean;
    /** Jusqu'à 12 mois, du plus ancien au plus récent */
    months: MonthlyPoint[];
    current: MonthlyPoint | null;
    previous: MonthlyPoint | null;
    topCategories: CategoryAmount[];
    health: HealthScore | null;
    /** Parts du revenu (0–1) pour la règle 50/30/20 : besoins / envies / épargne */
    rule: { needs: number; wants: number; savings: number } | null;
    savingsGoal: number | null;
    currency: string;
    year: YearStats;
    insights: Insight[];
};

type Item = { type: string; label: string; amount: number };

const sumByType = (items: Item[], type: string) =>
    items.filter((i) => i.type === type).reduce((acc, i) => acc + i.amount, 0);

function toPoint(month: number, year: number, items: Item[]): MonthlyPoint {
    const income = sumByType(items, "INCOME");
    const fixed = sumByType(items, "FIXED");
    const variable = sumByType(items, "VARIABLE");
    const savings = sumByType(items, "SAVING");
    const expenses = fixed + variable;
    return {
        month,
        year,
        income,
        fixed,
        variable,
        savings,
        expenses,
        remaining: income - expenses - savings,
        savingsRate: income > 0 ? (savings / income) * 100 : null,
    };
}

function computeHealth(p: MonthlyPoint): HealthScore | null {
    if (p.income <= 0) return null;

    // Taux d'épargne : objectif 20 % du revenu
    const savingsRate = Math.min((p.savings / p.income) / 0.2, 1);
    // Contrôle des dépenses : dépenses fixes ≤ 50 % du revenu
    const fixedRatio = p.fixed / p.income;
    const spendingControl =
        fixedRatio <= 0.5 ? 1 : Math.max(0, 1 - (fixedRatio - 0.5) / 0.5);
    // Marge de sécurité : reste à vivre ≥ 10 % du revenu
    const safetyMargin = Math.min(Math.max(p.remaining, 0) / p.income / 0.1, 1);

    const score = Math.round(savingsRate * 40 + spendingControl * 30 + safetyMargin * 30);
    return { score, savingsRate, spendingControl, safetyMargin };
}

function computeInsights(
    current: MonthlyPoint | null,
    previous: MonthlyPoint | null,
    topCategories: CategoryAmount[],
    savingsGoal: number | null,
    months: MonthlyPoint[],
): Insight[] {
    const insights: Insight[] = [];
    if (!current) return insights;

    // Dépassement du revenu — l'alerte la plus importante en premier
    if (current.remaining < 0) {
        insights.push({ kind: "negativeRemaining" });
    }

    // Variation des dépenses vs mois précédent
    if (previous && previous.expenses > 0) {
        const pct = ((current.expenses - previous.expenses) / previous.expenses) * 100;
        if (Math.abs(pct) >= 1) {
            insights.push({
                kind: pct > 0 ? "expensesUp" : "expensesDown",
                pct: Math.round(Math.abs(pct)),
            });
        }
    }

    // Objectif d'épargne mensuel
    if (savingsGoal && savingsGoal > 0) {
        const pct = (current.savings / savingsGoal) * 100;
        if (pct >= 100) insights.push({ kind: "goalReached" });
        else insights.push({ kind: "goalProgress", pct: Math.round(pct) });
    }

    // Taux d'épargne vs cible des 20 %
    if (current.savingsRate !== null) {
        const pct = Math.round(current.savingsRate);
        insights.push({ kind: pct >= 20 ? "savingsRateGood" : "savingsRateLow", pct });
    }

    // Catégorie de dépense dominante
    if (topCategories.length > 0 && topCategories[0].share >= 0.2) {
        insights.push({
            kind: "topCategory",
            label: topCategories[0].label,
            pct: Math.round(topCategories[0].share * 100),
        });
    }

    // Meilleur mois d'épargne de l'année en cours
    const thisYear = months.filter((m) => m.year === current.year && m.savings > 0);
    if (thisYear.length > 1) {
        const best = thisYear.reduce((a, b) => (b.savings > a.savings ? b : a));
        if (best.month !== current.month || best.year !== current.year) {
            insights.push({ kind: "bestMonth", month: best.month, year: best.year });
        }
    }

    return insights;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const { userId } = await verifySession();

    const [budgets, user] = await Promise.all([
        db.budget.findMany({
            where: { userId },
            orderBy: [{ year: "desc" }, { month: "desc" }],
            include: { items: true },
            take: 13,
        }),
        getCurrentUser(),
    ]);

    const savingsGoal = user?.savingsGoal ?? null;
    const currency = user?.currency ?? "USD";

    if (budgets.length === 0) {
        return {
            hasBudgets: false,
            reference: null,
            isCurrentMonth: false,
            months: [],
            current: null,
            previous: null,
            topCategories: [],
            health: null,
            rule: null,
            savingsGoal,
            currency,
            year: { totalSaved: 0, avgSavingsRate: null, avgExpenses: 0, monthsTracked: 0 },
            insights: [],
        };
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Mois de référence : mois courant si budgétisé, sinon le plus récent
    const referenceBudget =
        budgets.find((b) => b.month === currentMonth && b.year === currentYear) ??
        budgets[0];

    // Mois précédant immédiatement le mois de référence
    const prevMonth = referenceBudget.month === 1 ? 12 : referenceBudget.month - 1;
    const prevYear = referenceBudget.month === 1 ? referenceBudget.year - 1 : referenceBudget.year;
    const previousBudget =
        budgets.find((b) => b.month === prevMonth && b.year === prevYear) ?? null;

    const months: MonthlyPoint[] = [...budgets]
        .slice(0, 12)
        .reverse()
        .map((b) => toPoint(b.month, b.year, b.items));

    const current = toPoint(referenceBudget.month, referenceBudget.year, referenceBudget.items);
    const previous = previousBudget
        ? toPoint(previousBudget.month, previousBudget.year, previousBudget.items)
        : null;

    // Top catégories de dépenses du mois de référence
    const expenseItems = referenceBudget.items.filter(
        (i) => i.type === "FIXED" || i.type === "VARIABLE",
    );
    const totalExpenses = expenseItems.reduce((acc, i) => acc + i.amount, 0);
    const topCategories: CategoryAmount[] = expenseItems
        .filter((i) => i.amount > 0)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6)
        .map((i) => ({
            label: i.label,
            type: i.type as "FIXED" | "VARIABLE",
            amount: i.amount,
            share: totalExpenses > 0 ? i.amount / totalExpenses : 0,
        }));

    // Règle 50/30/20 : besoins = fixes, envies = variables, épargne
    const rule =
        current.income > 0
            ? {
                  needs: current.fixed / current.income,
                  wants: current.variable / current.income,
                  savings: current.savings / current.income,
              }
            : null;

    // Statistiques de l'année en cours
    const yearPoints = months.filter((m) => m.year === currentYear);
    const ratedPoints = yearPoints.filter((m) => m.savingsRate !== null);
    const year: YearStats = {
        totalSaved: yearPoints.reduce((acc, m) => acc + m.savings, 0),
        avgSavingsRate:
            ratedPoints.length > 0
                ? ratedPoints.reduce((acc, m) => acc + (m.savingsRate ?? 0), 0) /
                  ratedPoints.length
                : null,
        avgExpenses:
            yearPoints.length > 0
                ? yearPoints.reduce((acc, m) => acc + m.expenses, 0) / yearPoints.length
                : 0,
        monthsTracked: yearPoints.length,
    };

    return {
        hasBudgets: true,
        reference: { month: referenceBudget.month, year: referenceBudget.year },
        isCurrentMonth:
            referenceBudget.month === currentMonth && referenceBudget.year === currentYear,
        months,
        current,
        previous,
        topCategories,
        health: computeHealth(current),
        rule,
        savingsGoal,
        currency,
        year,
        insights: computeInsights(current, previous, topCategories, savingsGoal, months),
    };
}
