"use client";

import { useState, useTransition } from "react";
import GoalCard from "./GoalCard";
import GoalFormModal from "./GoalFormModal";
import ContributeModal from "./ContributeModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteGoal, togglePinGoal } from "@/app/actions/goal";
import { interpolate } from "@/lib/format";
import type { GoalDTO } from "@/services/goalService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface GoalsBoardProps {
    goals: GoalDTO[];
    userName: string | null;
    lang: string;
    locale: string;
    currency: string;
    dict: Dictionary;
}

/**
 * Grille des objectifs + tuile de création + orchestration des modales
 * (création/édition, ajout de fonds, suppression).
 */
export default function GoalsBoard({
    goals,
    userName,
    lang,
    locale,
    currency,
    dict,
}: GoalsBoardProps) {
    // "new" = création ; GoalDTO = édition ; null = fermé
    const [formGoal, setFormGoal] = useState<GoalDTO | "new" | null>(null);
    const [contributeGoal, setContributeGoal] = useState<GoalDTO | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<GoalDTO | null>(null);
    const [deleting, startDelete] = useTransition();
    const [, startPin] = useTransition();

    const confirmDelete = () => {
        if (!deleteTarget) return;
        startDelete(async () => {
            await deleteGoal(deleteTarget.id, lang);
            setDeleteTarget(null);
        });
    };

    return (
        <>
            {goals.length === 0 ? (
                /* ── État vide ──────────────────────────────────────────── */
                <div className="flex flex-col items-center justify-center h-[50vh] gap-5 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">{dict.goals.noGoals}</h2>
                        <p className="text-sm text-zinc-500 mb-5">{dict.goals.createFirst}</p>
                        <button
                            type="button"
                            onClick={() => setFormGoal("new")}
                            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-medium text-white transition shadow-lg shadow-purple-900/30"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {dict.goals.newGoal}
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Grille des objectifs ───────────────────────────────── */
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            userName={userName}
                            lang={lang}
                            locale={locale}
                            currency={currency}
                            dict={dict}
                            onEdit={() => setFormGoal(goal)}
                            onDelete={() => setDeleteTarget(goal)}
                            onContribute={() => setContributeGoal(goal)}
                            onTogglePin={() =>
                                startPin(async () => {
                                    await togglePinGoal(goal.id, lang);
                                })
                            }
                        />
                    ))}

                    {/* Tuile « nouvel objectif » */}
                    <button
                        type="button"
                        onClick={() => setFormGoal("new")}
                        className="flex h-60 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-800 text-zinc-600 transition hover:border-purple-500/40 hover:text-purple-400"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-sm font-medium">{dict.goals.newGoal}</span>
                    </button>
                </div>
            )}

            {/* ── Modales ────────────────────────────────────────────────── */}
            {formGoal !== null && (
                <GoalFormModal
                    goal={formGoal === "new" ? null : formGoal}
                    lang={lang}
                    dict={dict}
                    onClose={() => setFormGoal(null)}
                />
            )}

            {contributeGoal && (
                <ContributeModal
                    goal={contributeGoal}
                    lang={lang}
                    dict={dict}
                    onClose={() => setContributeGoal(null)}
                />
            )}

            {deleteTarget && (
                <ConfirmModal
                    variant="danger"
                    title={dict.goals.deleteModal.title}
                    description={interpolate(dict.goals.deleteModal.description, {
                        name: deleteTarget.name,
                    })}
                    confirmLabel={dict.goals.deleteModal.confirm}
                    cancelLabel={dict.goals.deleteModal.cancel}
                    pending={deleting}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}
