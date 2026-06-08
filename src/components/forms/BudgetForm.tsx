"use client";

import { saveBudget } from "@/app/actions/budget";

interface BudgetFormProps {
    dict: any;
}

const FormInput = ({ id, label }: { id: string; label: string }) => (
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
            className="w-full border border-gray-800 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-900 placeholder-gray-600"
        />
    </div>
);

export default function BudgetForm({ dict }: BudgetFormProps) {
    const t = dict.budgetForm;
    const cat = t.categories;
    const f = t.fields;

    return (
        <form action={saveBudget} className="max-w-7xl mx-auto p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                >
                    {t.saveButton || "Save"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- INCOME --- */}
                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.income}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="salaryWage" label={f.salaryWage} />
                        <FormInput
                            id="partnerSalaryWage"
                            label={f.partnerSalaryWage}
                        />
                        <FormInput id="rentalIncome" label={f.rentalIncome} />
                        <FormInput id="otherIncome" label={f.otherIncome} />
                    </div>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.savings}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="emergencyFund" label={f.emergencyFund} />
                        <FormInput
                            id="retirementSaving"
                            label={f.retirementSaving}
                        />
                        <FormInput id="otherSavings" label={f.otherSavings} />
                    </div>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.variable}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput id="groceries" label={f.groceries} />
                        <FormInput id="diningOut" label={f.diningOut} />
                        <FormInput id="otherVariable" label={f.otherVariable} />
                    </div>
                </div>

                {/* --- FIXED EXPENSES --- */}
                <div className="bg-black p-6 rounded-xl shadow-md border border-gray-800 lg:col-span-2">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 pb-2 border-b border-gray-800">
                        {cat.fixed}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                        <FormInput id="housing" label={f.housing} />
                        <FormInput id="propertyTaxes" label={f.propertyTaxes} />
                        <FormInput id="homeInsurance" label={f.homeInsurance} />
                        <FormInput id="electricity" label={f.electricity} />
                        <FormInput id="water" label={f.water} />
                        <FormInput id="gas" label={f.gas} />
                        <FormInput id="internet" label={f.internet} />
                        <FormInput id="carPayment" label={f.carPayment} />
                        <FormInput id="gasoline" label={f.gasoline} />
                        <FormInput id="carInsurance" label={f.carInsurance} />
                        <FormInput
                            id="publicTransport"
                            label={f.publicTransport}
                        />
                        <FormInput id="loanPayments" label={f.loanPayments} />
                        <FormInput id="studentLoans" label={f.studentLoans} />
                        <FormInput id="creditCard" label={f.creditCard} />
                        <FormInput id="personalLoan" label={f.personalLoan} />
                        <FormInput
                            id="healthInsurance"
                            label={f.healthInsurance}
                        />
                        <FormInput id="medications" label={f.medications} />
                        <FormInput
                            id="healthExpenses"
                            label={f.healthExpenses}
                        />
                        <FormInput id="incomeTax" label={f.incomeTax} />
                        <FormInput id="subscriptions" label={f.subscriptions} />
                        <FormInput id="streaming" label={f.streaming} />
                        <FormInput id="magazines" label={f.magazines} />
                        <FormInput id="othersFixed" label={f.othersFixed} />
                    </div>
                </div>
            </div>
        </form>
    );
}
