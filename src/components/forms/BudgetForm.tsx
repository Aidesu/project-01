"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { submitBudget } from "@/app/actions/budget";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface BudgetFormProps {
    dict: Dictionary;
    lang: string;
    /** Mois ciblé au format AAAA-MM (valeur par défaut du sélecteur). */
    period: string;
    /** Valeurs pré-remplies depuis le mois précédent : { fieldName: amount }. */
    defaultValues?: Record<string, number>;
    /** Périodes "YYYY-MM" qui ont déjà un budget — pour détecter les conflits. */
    existingPeriods?: string[];
    /** "create" (page dédiée, redirige) ou "edit" (popup, pas de redirection). */
    mode?: "create" | "edit";
    /** Id du budget à modifier — requis en mode "edit". */
    budgetId?: string;
    /** Appelé après une sauvegarde réussie en mode "edit" (ferme la popup). */
    onSuccess?: () => void;
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
    mode = "create",
    budgetId,
    onSuccess,
}: BudgetFormProps) {
    const t = dict.budgetForm;
    const cat = t.categories;
    const f = t.fields;
    const isEdit = mode === "edit";

    const formRef = useRef<HTMLFormElement>(null);
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [showModal, setShowModal] = useState(false);
    const [state, formAction, pending] = useActionState(submitBudget, undefined);

    const isConflict = !isEdit && existingPeriods.includes(selectedPeriod);

    // Formate "YYYY-MM" en libellé lisible (modals + en-tête d'édition).
    const periodLabel = selectedPeriod
        ? new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(
              new Date(
                  parseInt(selectedPeriod.slice(0, 4)),
                  parseInt(selectedPeriod.slice(5, 7)) - 1,
              ),
          )
        : "";

    // En mode édition, ferme la popup une fois la sauvegarde confirmée par le serveur.
    useEffect(() => {
        if (isEdit && state?.success) {
            onSuccess?.();
        }
    }, [isEdit, state, onSuccess]);

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
            {/* ── Modal de confirmation d'écrasement (création uniquement) ─── */}
            {showModal && (
                <ConfirmModal
                    variant="warning"
                    title={t.overwriteModal.title}
                    description={
                        <>
                            {t.overwriteModal.description.split("{period}")[0]}
                            <span className="font-medium text-zinc-200 capitalize">{periodLabel}</span>
                            {t.overwriteModal.description.split("{period}")[1]}
                        </>
                    }
                    confirmLabel={t.overwriteModal.confirm}
                    cancelLabel={t.overwriteModal.cancel}
                    onConfirm={confirmOverwrite}
                    onCancel={() => setShowModal(false)}
                />
            )}

        <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4 text-white">
            {/* Contexte transmis à l'action serveur */}
            <input type="hidden" name="lang" value={lang} />
            {isEdit && <input type="hidden" name="budgetId" value={budgetId} />}
            {isEdit && <input type="hidden" name="period" value={selectedPeriod} />}

            <div className="flex justify-between items-center mb-6 gap-4">
                {isEdit ? (
                    <div>
                        <h2 className="text-2xl font-bold text-white">{t.editTitle}</h2>
                        <p className="text-sm font-medium text-purple-400 capitalize mt-0.5">{periodLabel}</p>
                    </div>
                ) : (
                    <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                )}
                <div className="flex items-center gap-3">
                    {isEdit ? null : (
                        <>
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
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                    >
                        {pending ? "…" : (t.saveButton || "Save")}
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
