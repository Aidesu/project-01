"use client";

import { useActionState, useEffect, useState } from "react";
import { saveGoal, type GoalActionState } from "@/app/actions/goal";
import { GOAL_THEMES } from "./goalTheme";
import type { GoalDTO } from "@/services/goalService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface GoalFormModalProps {
    /** null = création, sinon édition de cet objectif */
    goal: GoalDTO | null;
    lang: string;
    dict: Dictionary;
    onClose: () => void;
}

const TYPES = Object.keys(GOAL_THEMES) as GoalDTO["type"][];

const inputClasses =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-purple-500/50";

export default function GoalFormModal({ goal, lang, dict, onClose }: GoalFormModalProps) {
    const t = dict.goals.form;
    const [state, formAction, pending] = useActionState<GoalActionState, FormData>(
        saveGoal,
        undefined,
    );
    const [type, setType] = useState<GoalDTO["type"]>(goal?.type ?? "TRAVEL");

    // Fermeture automatique après une sauvegarde réussie
    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
        >
            <div
                className="animate-modal-in relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-5 text-base font-semibold text-white">
                    {goal ? dict.goals.editGoal : dict.goals.newGoal}
                </h2>

                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="lang" value={lang} />
                    {goal && <input type="hidden" name="goalId" value={goal.id} />}
                    <input type="hidden" name="type" value={type} />

                    {/* Nom */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                            {t.name}
                        </label>
                        <input
                            name="name"
                            required
                            maxLength={60}
                            defaultValue={goal?.name ?? ""}
                            placeholder={t.namePlaceholder}
                            className={inputClasses}
                        />
                    </div>

                    {/* Thème */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                            {t.type}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {TYPES.map((key) => {
                                const theme = GOAL_THEMES[key];
                                const active = type === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setType(key)}
                                        className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 transition ${
                                            active
                                                ? "border-purple-500/50 bg-purple-500/10"
                                                : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                                        }`}
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            style={{ color: active ? theme.color : "#71717a" }}
                                            fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
                                        >
                                            {theme.icon}
                                        </svg>
                                        <span
                                            className={`text-[10px] font-medium leading-tight text-center ${
                                                active ? "text-zinc-200" : "text-zinc-500"
                                            }`}
                                        >
                                            {dict.goals.types[key]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Montants */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                {t.targetAmount}
                            </label>
                            <input
                                name="targetAmount"
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                defaultValue={goal?.targetAmount ?? ""}
                                placeholder="0.00"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                {t.savedAmount}
                            </label>
                            <input
                                name="savedAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                defaultValue={goal?.savedAmount ?? ""}
                                placeholder="0.00"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Date cible */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                            {t.targetDate}
                        </label>
                        <input
                            name="targetDate"
                            type="date"
                            defaultValue={goal?.targetDate ?? ""}
                            className={`${inputClasses} [color-scheme:dark]`}
                        />
                    </div>

                    {state?.success === false && (
                        <p className="text-xs text-rose-400">{t.invalid}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={pending}
                            className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-50"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition hover:bg-purple-500 active:scale-95 disabled:opacity-50"
                        >
                            {pending ? "…" : t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
