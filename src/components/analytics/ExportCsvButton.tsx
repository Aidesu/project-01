"use client";

import type { MonthlyPoint } from "@/services/analyticsService";

interface ExportCsvButtonProps {
    months: MonthlyPoint[];
    label: string;
}

/**
 * Exporte l'historique mensuel au format CSV (généré côté client,
 * aucun aller-retour serveur).
 */
export default function ExportCsvButton({ months, label }: ExportCsvButtonProps) {
    const handleExport = () => {
        const header = [
            "period",
            "income",
            "fixed_expenses",
            "variable_expenses",
            "savings",
            "remaining",
            "savings_rate_pct",
        ];
        const rows = months.map((m) => [
            `${m.year}-${String(m.month).padStart(2, "0")}`,
            m.income,
            m.fixed,
            m.variable,
            m.savings,
            m.remaining,
            m.savingsRate === null ? "" : m.savingsRate.toFixed(1),
        ]);

        const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "budget-analytics.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            disabled={months.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-1.5 text-[11px] font-semibold text-purple-400 transition-colors hover:bg-purple-500/15 hover:border-purple-500/35 disabled:opacity-40 disabled:pointer-events-none"
        >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
            {label}
        </button>
    );
}
