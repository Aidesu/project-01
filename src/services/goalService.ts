import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

/**
 * DTO sérialisable d'un objectif (les composants client ne reçoivent
 * jamais d'objet Date Prisma — targetDate est une chaîne ISO).
 */
export type GoalDTO = {
    id: string;
    name: string;
    type: "TRAVEL" | "CAR" | "HOME" | "EMERGENCY" | "TECH" | "EDUCATION" | "GIFT" | "OTHER";
    targetAmount: number;
    savedAmount: number;
    targetDate: string | null;
    pinned: boolean;
};

export type GoalsSummary = {
    totalSaved: number;
    totalTarget: number;
    reachedCount: number;
    count: number;
};

export async function getGoals(): Promise<GoalDTO[]> {
    const { userId } = await verifySession();

    const goals = await db.goal.findMany({
        where: { userId },
        orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
    });

    return goals.map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type,
        targetAmount: g.targetAmount,
        savedAmount: g.savedAmount,
        targetDate: g.targetDate ? g.targetDate.toISOString().slice(0, 10) : null,
        pinned: g.pinned,
    }));
}

/**
 * Sélectionne les objectifs à mettre en avant sur le tableau de bord :
 * 1. les épinglés d'abord (choix explicite de l'utilisateur),
 * 2. puis les plus proches d'être atteints (les plus motivants),
 * 3. les objectifs déjà atteints en dernier.
 */
export function pickDashboardGoals(goals: GoalDTO[], limit = 3): GoalDTO[] {
    const progress = (g: GoalDTO) =>
        g.targetAmount > 0 ? Math.min(g.savedAmount / g.targetAmount, 1) : 0;
    const reached = (g: GoalDTO) => g.savedAmount >= g.targetAmount;

    return [...goals]
        .sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            if (reached(a) !== reached(b)) return reached(a) ? 1 : -1;
            return progress(b) - progress(a);
        })
        .slice(0, limit);
}

export function summarizeGoals(goals: GoalDTO[]): GoalsSummary {
    return {
        totalSaved: goals.reduce((acc, g) => acc + g.savedAmount, 0),
        totalTarget: goals.reduce((acc, g) => acc + g.targetAmount, 0),
        reachedCount: goals.filter((g) => g.savedAmount >= g.targetAmount).length,
        count: goals.length,
    };
}
