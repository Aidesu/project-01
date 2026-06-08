import { db } from "@/lib/db";

export async function getBudgets(userId: string) {
    try {
        return await db.budget.findMany({
            where: {
                userId: userId,
            },
            // On trie par les colonnes qui existent réellement dans ton schéma actuel
            orderBy: [{ year: "desc" }, { month: "desc" }],
            // On inclut les items pour pouvoir calculer les totaux dans ton composant
            include: {
                items: true,
            },
        });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return [];
    }
}
