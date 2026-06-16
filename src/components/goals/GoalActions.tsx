"use client";

import { useState } from "react";

interface GoalActionsProps {
    pinLabel: string;
    editLabel: string;
    deleteLabel: string;
    onTogglePin: () => void;
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
}

/** Menu kebab (épingler / modifier / supprimer) commun à toutes les cartes d'objectif. */
export default function GoalActions({
    pinLabel,
    editLabel,
    deleteLabel,
    onTogglePin,
    onEdit,
    onDelete,
    className = "",
}: GoalActionsProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`p-1.5 rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-purple-400 focus:outline-none ${
                    open ? "text-purple-400 bg-zinc-800/80" : ""
                }`}
            >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-40 rounded-lg bg-zinc-950 border border-zinc-800 shadow-xl z-20 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => { onTogglePin(); setOpen(false); }}
                            className="w-full px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 hover:text-purple-400 transition-colors text-left"
                        >
                            {pinLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => { onEdit(); setOpen(false); }}
                            className="w-full px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 hover:text-purple-400 transition-colors text-left border-t border-zinc-900"
                        >
                            {editLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => { onDelete(); setOpen(false); }}
                            className="w-full px-3 py-2 text-[11px] text-red-400 hover:bg-red-950/20 transition-colors text-left border-t border-zinc-900"
                        >
                            {deleteLabel}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
