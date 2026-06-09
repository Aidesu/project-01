import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export type DashboardSummary = {
    income: number;
    fixed: number;
    variable: number;
    savings: number;
    remaining: number;
};

export type EvolutionPoint = {
    month: number;
    year: number;
    income: number;
    expenses: number;
    savings: number;
};

export type DistributionPoint = {
    key: "fixed" | "variable" | "savings";
    value: number;
};

export type DashboardData = {
    currentPeriod: { month: number; year: number };
    summaryPeriod: { month: number; year: number } | null;
    isCurrentMonth: boolean;
    hasBudgets: boolean;
    summary: DashboardSummary | null;
    previousSummary: DashboardSummary | null;
    evolution: EvolutionPoint[];
    distribution: DistributionPoint[];
};

const sumByType = (
    items: { type: string; amount: number }[],
    type: string,
) => items.filter((i) => i.type === type).reduce((acc, i) => acc + i.amount, 0);

function toSummary(items: { type: string; amount: number }[]): DashboardSummary {
    const income = sumByType(items, "INCOME");
    const fixed = sumByType(items, "FIXED");
    const variable = sumByType(items, "VARIABLE");
    const savings = sumByType(items, "SAVING");
    return { income, fixed, variable, savings, remaining: income - fixed - variable - savings };
}

export async function getDashboardData(): Promise<DashboardData> {
    const { userId } = await verifySession();

    // Récupère les 13 derniers budgets (12 mois d'évolution + 1 pour la tendance)
    const budgets = await db.budget.findMany({
        where: { userId },
        orderBy: [{ year: "desc" }, { month: "desc" }],
        include: { items: true },
        take: 13,
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const currentBudget =
        budgets.find(
            (b) => b.month === currentMonth && b.year === currentYear,
        ) ?? null;

    // Budget de référence pour le résumé : mois en cours en priorité, sinon le plus récent
    const summaryBudget = currentBudget ?? (budgets.length > 0 ? budgets[0] : null);

    // Budget du mois précédent pour la tendance
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousBudget =
        budgets.find((b) => b.month === prevMonth && b.year === prevYear) ?? null;

    // Évolution sur les 6 derniers mois (du plus ancien au plus récent pour le graphe)
    const evolution: EvolutionPoint[] = [...budgets]
        .slice(0, 6)
        .reverse()
        .map((b) => ({
            month: b.month,
            year: b.year,
            income: sumByType(b.items, "INCOME"),
            expenses: sumByType(b.items, "FIXED") + sumByType(b.items, "VARIABLE"),
            savings: sumByType(b.items, "SAVING"),
        }));

    // Distribution pour le camembert
    const distribution: DistributionPoint[] = summaryBudget
        ? (
              [
                  { key: "fixed" as const, value: sumByType(summaryBudget.items, "FIXED") },
                  { key: "variable" as const, value: sumByType(summaryBudget.items, "VARIABLE") },
                  { key: "savings" as const, value: sumByType(summaryBudget.items, "SAVING") },
              ] as DistributionPoint[]
          ).filter((d) => d.value > 0)
        : [];

    return {
        currentPeriod: { month: currentMonth, year: currentYear },
        summaryPeriod: summaryBudget
            ? { month: summaryBudget.month, year: summaryBudget.year }
            : null,
        isCurrentMonth: !!currentBudget,
        hasBudgets: budgets.length > 0,
        summary: summaryBudget ? toSummary(summaryBudget.items) : null,
        previousSummary: previousBudget ? toSummary(previousBudget.items) : null,
        evolution,
        distribution,
    };
}

/**
 * Retourne les items du budget du mois précédent sous forme { fieldName: amount }.
 * Utilisé pour pré-remplir le formulaire de création.
 */
export async function getPreviousMonthDefaults(
    currentMonth: number,
    currentYear: number,
): Promise<Record<string, number>> {
    const { userId } = await verifySession();

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const budget = await db.budget.findFirst({
        where: { userId, month: prevMonth, year: prevYear },
        include: { items: true },
    });

    if (!budget) return {};

    // item.label = nom du champ de formulaire (convention de saveBudget)
    return Object.fromEntries(
        budget.items
            .filter((item) => item.amount > 0)
            .map((item) => [item.label, item.amount]),
    );
}

/**
 * Récupère les budgets de l'utilisateur connecté, triés du plus récent au plus ancien.
 * L'id utilisateur vient de la session vérifiée (DAL) — pas d'argument côté appelant.
 */
/**
 * Retourne les périodes (format "YYYY-MM") pour lesquelles un budget existe déjà.
 * Utilisé côté client pour détecter un conflit avant soumission.
 */
export async function getBudgetPeriods(): Promise<string[]> {
    const { userId } = await verifySession();

    const budgets = await db.budget.findMany({
        where: { userId },
        select: { month: true, year: true },
    });

    return budgets.map(
        ({ year, month }) =>
            `${year}-${String(month).padStart(2, "0")}`,
    );
}

export async function getBudgets() {
    const { userId } = await verifySession();

    try {
        return await db.budget.findMany({
            where: { userId },
            orderBy: [{ year: "desc" }, { month: "desc" }],
            include: { items: true },
        });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return [];
    }
}
