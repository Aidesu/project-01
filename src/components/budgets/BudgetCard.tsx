"use client";

import { useState, useTransition } from "react";
import GraphicCard2 from "@/components/modules/GraphicCard2";
import BudgetBar from "@/components/graphics/BudgetBar";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditBudgetModal from "@/components/forms/EditBudgetModal";
import { deleteBudget } from "@/app/actions/budget";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface BudgetItem {
    label: string;
    amount: number;
}

interface BudgetCardProps {
    dict: Dictionary;
    lang: string;
    budgetId: string;
    month: number;
    year: number;
    items: BudgetItem[];
    formattedMonth: string;
    isCurrent: boolean;
    trend: { value: string; label: string; type: "up" | "down" };
    chartData: { name: string; value: number; itemStyle: { color: string } }[];
}

export default function BudgetCard({
    dict,
    lang,
    budgetId,
    month,
    year,
    items,
    formattedMonth,
    isCurrent,
    trend,
    chartData,
}: BudgetCardProps) {
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, startTransition] = useTransition();

    const t = dict.budgetForm;
    const period = `${year}-${String(month).padStart(2, "0")}`;
    const periodLabel = formattedMonth + " " + year;

    // item.label = nom du champ de formulaire (convention de submitBudget)
    const defaultValues = Object.fromEntries(
        items.filter((item) => item.amount > 0).map((item) => [item.label, item.amount]),
    );

    function handleDelete() {
        startTransition(async () => {
            await deleteBudget(budgetId, lang);
            setShowDeleteConfirm(false);
        });
    }

    return (
        <>
            <GraphicCard2
                month={formattedMonth}
                year={year}
                isCurrent={isCurrent}
                trend={trend}
                modifyLabel={dict.budgets.editAction}
                deleteLabel={dict.budgets.deleteAction}
                onModify={() => setShowEdit(true)}
                onDelete={() => setShowDeleteConfirm(true)}
            >
                <BudgetBar data={chartData} />
            </GraphicCard2>

            {showEdit && (
                <EditBudgetModal
                    dict={dict}
                    lang={lang}
                    budgetId={budgetId}
                    period={period}
                    defaultValues={defaultValues}
                    onClose={() => setShowEdit(false)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    variant="danger"
                    title={t.deleteModal.title}
                    description={
                        <>
                            {t.deleteModal.description.split("{period}")[0]}
                            <span className="font-medium text-zinc-200 capitalize">{periodLabel}</span>
                            {t.deleteModal.description.split("{period}")[1]}
                        </>
                    }
                    confirmLabel={t.deleteModal.confirm}
                    cancelLabel={t.deleteModal.cancel}
                    pending={isDeleting}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </>
    );
}
