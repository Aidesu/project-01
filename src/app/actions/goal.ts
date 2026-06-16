"use server";

import { db } from "@/lib/db";
import { GoalType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";

export type GoalActionState =
    | {
          success?: boolean;
          message?: string;
      }
    | undefined;

const GOAL_TYPES = Object.values(GoalType) as string[];

/** Les objectifs apparaissent aussi sur le tableau de bord. */
function revalidateGoalViews(lang: string) {
    revalidatePath(`/${lang}/goals`);
    revalidatePath(`/${lang}`);
}

/**
 * Création / édition d'un objectif d'épargne (formulaire unique).
 * Si `goalId` est présent : mise à jour, sinon création.
 */
export async function saveGoal(
    _prevState: GoalActionState,
    formData: FormData,
): Promise<GoalActionState> {
    const { userId } = await verifySession();

    const lang = String(formData.get("lang") ?? "en");
    const goalId = String(formData.get("goalId") ?? "");

    const name = String(formData.get("name") ?? "").trim();
    const rawType = String(formData.get("type") ?? "OTHER");
    const type = (GOAL_TYPES.includes(rawType) ? rawType : "OTHER") as GoalType;
    const targetAmount = parseFloat(String(formData.get("targetAmount") ?? ""));
    const savedAmount = parseFloat(String(formData.get("savedAmount") ?? "")) || 0;
    const rawDate = String(formData.get("targetDate") ?? "");
    const targetDate = rawDate ? new Date(`${rawDate}T00:00:00`) : null;

    if (!name || !Number.isFinite(targetAmount) || targetAmount <= 0) {
        return { success: false, message: "invalid" };
    }

    const data = {
        name,
        type,
        targetAmount,
        savedAmount: Math.max(savedAmount, 0),
        targetDate: targetDate && !isNaN(targetDate.getTime()) ? targetDate : null,
    };

    if (goalId) {
        // Édition : vérifie que l'objectif appartient bien à l'utilisateur.
        const result = await db.goal.updateMany({
            where: { id: goalId, userId },
            data,
        });
        if (result.count === 0) {
            return { success: false, message: "notFound" };
        }
    } else {
        await db.goal.create({ data: { userId, ...data } });
    }

    revalidateGoalViews(lang);
    return { success: true };
}

/** Épingle / désépingle un objectif (mis en avant sur le tableau de bord). */
export async function togglePinGoal(goalId: string, lang: string) {
    const { userId } = await verifySession();

    const goal = await db.goal.findFirst({
        where: { id: goalId, userId },
        select: { pinned: true },
    });
    if (!goal) return;

    await db.goal.update({
        where: { id: goalId },
        data: { pinned: !goal.pinned },
    });

    revalidateGoalViews(lang);
}

/** Ajoute un montant au capital épargné d'un objectif. */
export async function contributeToGoal(
    goalId: string,
    amount: number,
    lang: string,
): Promise<GoalActionState> {
    const { userId } = await verifySession();

    if (!Number.isFinite(amount) || amount <= 0) {
        return { success: false, message: "invalid" };
    }

    const result = await db.goal.updateMany({
        where: { id: goalId, userId },
        data: { savedAmount: { increment: amount } },
    });
    if (result.count === 0) {
        return { success: false, message: "notFound" };
    }

    revalidateGoalViews(lang);
    return { success: true };
}

/** Supprime définitivement un objectif appartenant à l'utilisateur connecté. */
export async function deleteGoal(goalId: string, lang: string) {
    const { userId } = await verifySession();

    await db.goal.deleteMany({ where: { id: goalId, userId } });

    revalidateGoalViews(lang);
}
