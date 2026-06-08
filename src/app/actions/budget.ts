"use server";
import { db } from "@/lib/db";
import { TransactionType, CategoryType } from "@prisma/client";

export async function saveBudget(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    // Exemple de mapping : tu lies l'ID de l'input à une catégorie et un type
    const items = [
        {
            label: "Salary",
            amount: parseFloat(rawData.salaryWage as string) || 0,
            type: TransactionType.INCOME,
            category: CategoryType.SALARY,
        },
        {
            label: "Housing",
            amount: parseFloat(rawData.housing as string) || 0,
            type: TransactionType.FIXED,
            category: CategoryType.HOUSING,
        },
        // ... ajoute tous les autres ici
    ];

    await db.budget.create({
        data: {
            userId: "USER_ID_A_RECUPERER", // Utilise Clerk ou NextAuth ici
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            items: {
                create: items,
            },
        },
    });
}
