"use client";

import { ReactNode } from "react";

interface ConfirmModalProps {
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    /** "warning" (ambre, écrasement) ou "danger" (rouge, suppression). */
    variant?: "warning" | "danger";
    pending?: boolean;
}

export default function ConfirmModal({
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    variant = "warning",
    pending = false,
}: ConfirmModalProps) {
    const isDanger = variant === "danger";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
            onClick={onCancel}
        >
            <div
                className="animate-modal-in relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icône */}
                <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${
                        isDanger
                            ? "bg-red-500/10 border-red-500/20"
                            : "bg-amber-500/10 border-amber-500/20"
                    }`}
                >
                    {isDanger ? (
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    )}
                </div>

                {/* Titre + description */}
                <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
                <div className="text-sm text-zinc-400 leading-relaxed mb-6">{description}</div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={pending}
                        className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={pending}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg transition active:scale-95 disabled:opacity-50 ${
                            isDanger
                                ? "bg-red-600 hover:bg-red-500 shadow-red-900/40"
                                : "bg-purple-600 hover:bg-purple-500 shadow-purple-900/40"
                        }`}
                    >
                        {pending ? "…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
