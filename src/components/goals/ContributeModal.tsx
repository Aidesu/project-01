"use client";

import { useState, useTransition } from "react";
import { contributeToGoal } from "@/app/actions/goal";
import { interpolate } from "@/lib/format";
import type { GoalDTO } from "@/services/goalService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface ContributeModalProps {
    goal: GoalDTO;
    lang: string;
    dict: Dictionary;
    onClose: () => void;
}

/** Ajout rapide de fonds à un objectif. */
export default function ContributeModal({ goal, lang, dict, onClose }: ContributeModalProps) {
    const t = dict.goals.contributeModal;
    const [amount, setAmount] = useState("");
    const [pending, startTransition] = useTransition();

    const parsed = parseFloat(amount);
    const valid = Number.isFinite(parsed) && parsed > 0;

    const submit = () => {
        if (!valid) return;
        startTransition(async () => {
            await contributeToGoal(goal.id, parsed, lang);
            onClose();
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
        >
            <div
                className="animate-modal-in relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-base font-semibold text-white">
                    {interpolate(t.title, { name: goal.name })}
                </h2>

                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    {t.amount}
                </label>
                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                    placeholder="0.00"
                    className="mb-5 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-purple-500/50"
                />

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={pending}
                        className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-50"
                    >
                        {t.cancel}
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={pending || !valid}
                        className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition hover:bg-purple-500 active:scale-95 disabled:opacity-50"
                    >
                        {pending ? "…" : t.confirm}
                    </button>
                </div>
            </div>
        </div>
    );
}
