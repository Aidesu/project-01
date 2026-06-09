import GraphicCard2 from "@/components/modules/GraphicCard2";
import BudgetBar from "@/components/graphics/BudgetBar";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getBudgets } from "@/services/budgetService";
import SearchBar from "@/components/main/SearchBar";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function BudgetsPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const budgets = await getBudgets();

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return (
        <main className="w-full mx-auto">
            {/* Header : Titre + Barre de recherche + Bouton NEW */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-6">
                <h1 className="text-3xl font-bold text-white tracking-tight w-full md:w-auto">
                    {dict?.budgets?.title || "My Budgets"}
                </h1>

                {/* Utilisation de la barre de recherche isolée en composant client */}
                <SearchBar placeholder={dict?.budgets?.searchPlaceholder} />

                {/* Bouton NEW */}
                <Link
                    href={`/${lang}/budgets/new`}
                    className="w-full md:w-auto text-center text-sm font-semibold text-white bg-transparent px-8 py-2.5 rounded-full border border-gray-600 hover:border-white hover:bg-gray-800 transition-all"
                >
                    {dict?.budgets?.newButton || "NEW"}
                </Link>
            </div>

            <hr className="mb-5" />

            {/* Grille des cartes Budgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {budgets.map((budget) => {
                    // Nom du mois lisible à partir de month/year (1-12 → 0-11 pour Date)
                    const monthName = new Intl.DateTimeFormat(lang, {
                        month: "long",
                    }).format(new Date(budget.year, budget.month - 1));
                    const formattedMonth =
                        monthName.charAt(0).toUpperCase() + monthName.slice(1);

                    // Les totaux ne sont plus stockés en colonnes : on les calcule depuis les items.
                    const sumByType = (type: string) =>
                        budget.items
                            .filter((item) => item.type === type)
                            .reduce((acc, item) => acc + item.amount, 0);

                    const income = sumByType("INCOME");
                    const fixed = sumByType("FIXED");
                    const variable = sumByType("VARIABLE");
                    const savings = sumByType("SAVING");
                    const remaining = income - fixed - variable - savings;

                    // Taux d'épargne pour le badge de tendance.
                    const saveRate =
                        income > 0 ? Math.round((savings / income) * 100) : 0;

                    // Format attendu par le composant ECharts BudgetBar
                    const chartData = [
                        {
                            name: "Income",
                            value: income,
                            itemStyle: { color: "#10b981" },
                        },
                        {
                            name: "Fixed",
                            value: fixed,
                            itemStyle: { color: "#f97316" },
                        },
                        {
                            name: "Variable",
                            value: variable,
                            itemStyle: { color: "#3b82f6" },
                        },
                        {
                            name: "Saved",
                            value: savings,
                            itemStyle: { color: "#a855f7" },
                        },
                        {
                            name: "Remaining",
                            value: remaining,
                            itemStyle: { color: "#6366f1" },
                        },
                    ];

                    const isCurrent =
                        budget.month === currentMonth &&
                        budget.year === currentYear;

                    return (
                        <GraphicCard2
                            key={budget.id}
                            month={formattedMonth}
                            year={budget.year}
                            isCurrent={isCurrent}
                            trend={{
                                value: `${saveRate}%`,
                                label: "save",
                                type: saveRate >= 0 ? "up" : "down",
                            }}
                        >
                            <BudgetBar data={chartData} />
                        </GraphicCard2>
                    );
                })}
            </div>
        </main>
    );
}
