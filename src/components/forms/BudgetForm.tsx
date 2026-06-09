"use client";

import { useRef, useState } from "react";
import { saveBudget } from "@/app/actions/budget";

interface BudgetFormProps {
    dict: any;
    lang: string;
    /** Mois ciblé au format AAAA-MM (valeur par défaut du sélecteur). */
    period: string;
    /** Valeurs pré-remplies depuis le mois précédent : { fieldName: amount }. */
    defaultValues?: Record<string, number>;
    /** Périodes "YYYY-MM" qui ont déjà un budget — pour détecter les conflits. */
    existingPeriods?: string[];
}

const FormInput = ({
    id,
    label,
    defaultValue,
}: {
    id: string;
    label: string;
    defaultValue?: number;
}) => (
    <div className="flex flex-col gap-1 mb-3">
        <label
            htmlFor={id}
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
            {label}
        </label>
        <input
            type="number"
            id={id}
            name={id}
            step="0.01"
            placeholder="0.00"
            defaultValue={defaultValue ?? ""}
            className={`w-full border rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-900 placeholder-gray-600 ${
                defaultValue ? "border-purple-800/60" : "border-gray-800"
            }`}
        />
    </div>
);

export default function BudgetForm({
    dict,
    lang,
    period,
    defaultValues = {},
    existingPeriods = [],
}: BudgetFormProps) {
    const t = dict.budgetForm;
    const cat = t.categories;
    const f = t.fields;

    const formRef = useRef<HTMLFormElement>(null);
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [showModal, setShowModal] = useState(false);

    const isConflict = existingPeriods.includes(selectedPeriod);

    // Formate "YYYY-MM" en libellé lisible pour le modal.
    const periodLabel = selectedPeriod
        ? new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(
              new Date(
                  parseInt(selectedPeriod.slice(0, 4)),
                  parseInt(selectedPeriod.slice(5, 7)) - 1,
              ),
          )
        : "";

    function handleSubmit(e: React.FormEvent) {
        if (isConflict) {
            e.preventDefault();
            setShowModal(true);
        }
        // Pas de conflit → soumission native vers le server action, rien à faire.
    }

    function confirmOverwrite() {
        setShowModal(false);
        formRef.current?.requestSubmit();
    }

    return (
        <>
            {/* ── Modal de confirmation ─────────────────────────────────── */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/60"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: "modal-in 180ms cubic-bezier(0.16,1,0.3,1) both",
                        }}
                    >
                        {/* Icône */}
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>

                        {/* Titre + description */}
                        <h2 className="text-base font-semibold text-white mb-1">
                            Budget existant
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                            Un budget pour{" "}
                            <span className="font-medium text-zinc-200 capitalize">{periodLabel}</span>{" "}
                            existe déjà. Voulez-vous l&apos;écraser avec ces nouvelles
                            valeurs ?
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={confirmOverwrite}
                                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition hover:bg-purple-500 active:scale-95"
                            >
                                Écraser
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes modal-in {
                            from { opacity: 0; transform: scale(0.94) translateY(6px); }
                            to   { opacity: 1; transform: scale(1)    translateY(0);   }
                        }
                    `}</style>
                </div>
            )}

        <form ref={formRef} action={saveBudget} onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4 text-white">
            {/* Contexte transmis à l'action serveur */}
            <input type="hidden" name="lang" value={lang} />

            <div className="flex justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                <div className="flex items-center gap-3">
                    <label
                        htmlFor="period"
                        className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                        {f.month || "Mois"}
                    </label>

                    <div className="relative">
                        <input
                            type="month"
                            id="period"
                            name="period"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className={`border rounded-md p-2 text-sm text-white bg-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 [color-scheme:dark] transition-colors ${
                                isConflict
                                    ? "border-amber-500/60 pr-8"
                                    : "border-gray-800"
                            }`}
                        />
                        {/* Pastille d'avertissement inline */}
                        {isConflict && (
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </div>

                    {/* Badge "Déjà créé" */}
                    {isConflict && (
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Déjà créé
                        </span>
                    )}

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                    >
                        {t.saveButton || "Save"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- INCOME --- */}
                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.income}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="salaryWage" label={f.salaryWage} defaultValue={defaultValues["salaryWage"]} />
                        <FormInput id="partnerSalaryWage" label={f.partnerSalaryWage} defaultValue={defaultValues["partnerSalaryWage"]} />
                        <FormInput id="rentalIncome" label={f.rentalIncome} defaultValue={defaultValues["rentalIncome"]} />
                        <FormInput id="otherIncome" label={f.otherIncome} defaultValue={defaultValues["otherIncome"]} />
                    </div>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.savings}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="emergencyFund" label={f.emergencyFund} defaultValue={defaultValues["emergencyFund"]} />
                        <FormInput id="retirementSaving" label={f.retirementSaving} defaultValue={defaultValues["retirementSaving"]} />
                        <FormInput id="otherSavings" label={f.otherSavings} defaultValue={defaultValues["otherSavings"]} />
                    </div>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.variable}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="groceries" label={f.groceries} defaultValue={defaultValues["groceries"]} />
                        <FormInput id="diningOut" label={f.diningOut} defaultValue={defaultValues["diningOut"]} />
                        <FormInput id="otherVariable" label={f.otherVariable} defaultValue={defaultValues["otherVariable"]} />
                    </div>
                </div>

                {/* --- FIXED EXPENSES --- */}
                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800 lg:col-span-2">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.fixed}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                        <FormInput id="housing" label={f.housing} defaultValue={defaultValues["housing"]} />
                        <FormInput id="propertyTaxes" label={f.propertyTaxes} defaultValue={defaultValues["propertyTaxes"]} />
                        <FormInput id="homeInsurance" label={f.homeInsurance} defaultValue={defaultValues["homeInsurance"]} />
                        <FormInput id="electricity" label={f.electricity} defaultValue={defaultValues["electricity"]} />
                        <FormInput id="water" label={f.water} defaultValue={defaultValues["water"]} />
                        <FormInput id="gas" label={f.gas} defaultValue={defaultValues["gas"]} />
                        <FormInput id="internet" label={f.internet} defaultValue={defaultValues["internet"]} />
                        <FormInput id="carPayment" label={f.carPayment} defaultValue={defaultValues["carPayment"]} />
                        <FormInput id="gasoline" label={f.gasoline} defaultValue={defaultValues["gasoline"]} />
                        <FormInput id="carInsurance" label={f.carInsurance} defaultValue={defaultValues["carInsurance"]} />
                        <FormInput id="publicTransport" label={f.publicTransport} defaultValue={defaultValues["publicTransport"]} />
                        <FormInput id="loanPayments" label={f.loanPayments} defaultValue={defaultValues["loanPayments"]} />
                        <FormInput id="studentLoans" label={f.studentLoans} defaultValue={defaultValues["studentLoans"]} />
                        <FormInput id="creditCard" label={f.creditCard} defaultValue={defaultValues["creditCard"]} />
                        <FormInput id="personalLoan" label={f.personalLoan} defaultValue={defaultValues["personalLoan"]} />
                        <FormInput id="healthInsurance" label={f.healthInsurance} defaultValue={defaultValues["healthInsurance"]} />
                        <FormInput id="medications" label={f.medications} defaultValue={defaultValues["medications"]} />
                        <FormInput id="healthExpenses" label={f.healthExpenses} defaultValue={defaultValues["healthExpenses"]} />
                        <FormInput id="incomeTax" label={f.incomeTax} defaultValue={defaultValues["incomeTax"]} />
                        <FormInput id="subscriptions" label={f.subscriptions} defaultValue={defaultValues["subscriptions"]} />
                        <FormInput id="streaming" label={f.streaming} defaultValue={defaultValues["streaming"]} />
                        <FormInput id="magazines" label={f.magazines} defaultValue={defaultValues["magazines"]} />
                        <FormInput id="othersFixed" label={f.othersFixed} defaultValue={defaultValues["othersFixed"]} />
                    </div>
                </div>
            </div>
        </form>
        </>
    );
}
