import { promises as fs } from "fs";
import path from "path";

export interface RawBudgetItem {
    id: string;
    date: string;
    total_income: number;
    total_fixed_expenses: number;
    total_variable_expenses: number;
    total_savings: number;
    remaining: number;
}

export async function fetchBudgetsFromJSON(): Promise<RawBudgetItem[]> {
    try {
        // Construction du chemin absolu vers public/data/budgets.json
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "budgets.json",
        );
        const fileContents = await fs.readFile(filePath, "utf8");

        return JSON.parse(fileContents) as RawBudgetItem[];
    } catch (error) {
        console.error(
            "Erreur lors de la lecture du fichier budgets.json :",
            error,
        );
        return []; // Retourne un tableau vide en cas de pépin pour éviter le crash
    }
}
