"use client";

import BudgetForm from "@/components/forms/BudgetForm";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface EditBudgetModalProps {
    dict: Dictionary;
    lang: string;
    budgetId: string;
    /** Mois ciblé au format AAAA-MM. */
    period: string;
    /** Valeurs actuelles du budget : { fieldName: amount }. */
    defaultValues: Record<string, number>;
    onClose: () => void;
}

export default function EditBudgetModal({
    dict,
    lang,
    budgetId,
    period,
    defaultValues,
    onClose,
}: EditBudgetModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.7)" }}
        >
            <div className="animate-modal-in relative w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
                {/* Bouton de fermeture */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="modal-scroll overflow-y-auto pt-12 rounded-2xl">
                    <BudgetForm
                        dict={dict}
                        lang={lang}
                        period={period}
                        defaultValues={defaultValues}
                        mode="edit"
                        budgetId={budgetId}
                        onSuccess={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
