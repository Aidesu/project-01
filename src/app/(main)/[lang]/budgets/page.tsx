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

    return (
        <main className="w-full mx-auto">
            {/* Header : Titre + Barre de recherche + Bouton NEW */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-6">
                <h1 className="text-3xl font-bold text-white tracking-tight w-full md:w-auto">
                    My Budgets
                </h1>

                {/* Utilisation de la barre de recherche isolée en composant client */}
                <SearchBar />

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
                    // Si ta base de données utilise des objets Date bruts, on extrait le mois/année textuels
                    const monthName = new Intl.DateTimeFormat(lang, {
                        month: "long",
                    }).format(new Date(budget.year, budget.month - 1));
                    const formattedMonth =
                        monthName.charAt(0).toUpperCase() + monthName.slice(1);

                    // Reformatage des données de ta DB au format attendu par ton composant ECharts BudgetBar
                    const chartData = [
                        {
                            name: "Income",
                            value: budget.total_income,
                            itemStyle: { color: "#10b981" },
                        },
                        {
                            name: "Fixed",
                            value: budget.total_fixed_expenses,
                            itemStyle: { color: "#f97316" },
                        },
                        {
                            name: "Variable",
                            value: budget.total_variable_expenses,
                            itemStyle: { color: "#3b82f6" },
                        },
                        {
                            name: "Saved",
                            value: budget.total_savings,
                            itemStyle: { color: "#a855f7" },
                        },
                        {
                            name: "Remaining",
                            value: budget.remaining,
                            itemStyle: { color: "#6366f1" },
                        },
                    ];

                    return (
                        <GraphicCard2
                            key={budget.id}
                            month={formattedMonth}
                            year={dateObj.getFullYear()}
                            trend={{
                                value: "23%",
                                label: "save",
                                type: "down",
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
