"use server";
import { db } from "@/lib/db";
import { TransactionType, CategoryType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

/**
 * Correspondance entre les champs du formulaire (BudgetForm) et les
 * (catégorie, type) du modèle Prisma. Une seule source de vérité.
 */
const FIELD_MAP: {
    field: string;
    category: CategoryType;
    type: TransactionType;
}[] = [
    // --- Revenus ---
    { field: "salaryWage", category: "SALARY", type: "INCOME" },
    { field: "partnerSalaryWage", category: "PARTNER_SALARY", type: "INCOME" },
    { field: "rentalIncome", category: "RENTAL_INCOME", type: "INCOME" },
    { field: "otherIncome", category: "OTHER_INCOME", type: "INCOME" },
    // --- Épargne ---
    { field: "emergencyFund", category: "EMERGENCY_FUND", type: "SAVING" },
    { field: "retirementSaving", category: "RETIREMENT_SAVING", type: "SAVING" },
    {
        field: "otherSavings",
        category: "OTHER_SAVINGS_INVESTMENTS",
        type: "SAVING",
    },
    // --- Dépenses variables ---
    { field: "groceries", category: "GROCERIES", type: "VARIABLE" },
    { field: "diningOut", category: "DINING_OUT_ENTERTAINMENT", type: "VARIABLE" },
    { field: "otherVariable", category: "OTHERS", type: "VARIABLE" },
    // --- Dépenses fixes ---
    { field: "housing", category: "HOUSING", type: "FIXED" },
    { field: "propertyTaxes", category: "PROPERTY_TAXES", type: "FIXED" },
    { field: "homeInsurance", category: "HOME_INSURANCE", type: "FIXED" },
    { field: "electricity", category: "ELECTRICITY", type: "FIXED" },
    { field: "water", category: "WATER", type: "FIXED" },
    { field: "gas", category: "GAS", type: "FIXED" },
    { field: "internet", category: "INTERNET_CABLE_PHONE", type: "FIXED" },
    { field: "carPayment", category: "CAR_PAYMENT", type: "FIXED" },
    { field: "gasoline", category: "GASOLINE_FUEL", type: "FIXED" },
    { field: "carInsurance", category: "INSURANCE", type: "FIXED" },
    { field: "publicTransport", category: "PUBLIC_TRANSPORTATION", type: "FIXED" },
    { field: "loanPayments", category: "LOAN_PAYMENTS", type: "FIXED" },
    { field: "studentLoans", category: "STUDENT_LOANS", type: "FIXED" },
    { field: "creditCard", category: "CREDIT_CARD_PAYMENT", type: "FIXED" },
    { field: "personalLoan", category: "PERSONAL_LOAN", type: "FIXED" },
    { field: "healthInsurance", category: "HEALTH_INSURANCE", type: "FIXED" },
    { field: "medications", category: "PRESCRIPTION_MEDICATIONS", type: "FIXED" },
    { field: "healthExpenses", category: "HEALTH_RELATED_EXPENSES", type: "FIXED" },
    { field: "incomeTax", category: "OTHERS", type: "FIXED" },
    { field: "subscriptions", category: "SUBSCRIPTIONS", type: "FIXED" },
    { field: "streaming", category: "STREAMING_SERVICES", type: "FIXED" },
    { field: "magazines", category: "MAGAZINES", type: "FIXED" },
    { field: "othersFixed", category: "OTHERS", type: "FIXED" },
];

export async function saveBudget(formData: FormData) {
    // Sécurité : l'utilisateur doit être connecté ; on récupère son id réel.
    const { userId } = await verifySession();

    // Mois ciblé : champ "period" au format AAAA-MM, sinon le mois courant.
    const period = String(formData.get("period") ?? "");
    const match = period.match(/^(\d{4})-(\d{2})$/);
    const now = new Date();
    const year = match ? parseInt(match[1], 10) : now.getFullYear();
    const month = match ? parseInt(match[2], 10) : now.getMonth() + 1;

    const lang = String(formData.get("lang") ?? "en");

    // Construit les lignes : on ne garde que les montants saisis (> 0).
    const items = FIELD_MAP.map(({ field, category, type }) => ({
        label: field,
        category,
        type,
        amount: parseFloat(String(formData.get(field) ?? "")) || 0,
    })).filter((item) => item.amount > 0);

    // Un seul budget par (utilisateur, mois, année) : on remplace s'il existe déjà.
    const existing = await db.budget.findFirst({
        where: { userId, month, year },
    });

    if (existing) {
        await db.budgetItem.deleteMany({ where: { budgetId: existing.id } });
        await db.budget.update({
            where: { id: existing.id },
            data: { items: { create: items } },
        });
    } else {
        await db.budget.create({
            data: { userId, month, year, items: { create: items } },
        });
    }

    // Rafraîchit la liste puis redirige automatiquement vers la page des budgets.
    revalidatePath(`/${lang}/budgets`);
    redirect(`/${lang}/budgets`);
}
