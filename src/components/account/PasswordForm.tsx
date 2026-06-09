"use client";

import { useActionState } from "react";
import { changePassword, type AuthFormState } from "@/app/actions/auth";

export default function PasswordForm({ dict }: { dict: any }) {
    const a = dict.account;
    const [state, action, pending] = useActionState<AuthFormState, FormData>(
        changePassword,
        undefined,
    );

    const inputClass =
        "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors placeholder-zinc-600";

    return (
        <form action={action}>
            <div className="px-5 py-5 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">{a.currentPassword}</label>
                    <input name="currentPassword" type="password" autoComplete="current-password" className={inputClass} />
                    {state?.errors?.currentPassword && (
                        <p className="mt-1 text-[11px] text-red-400">{state.errors.currentPassword[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">{a.newPassword}</label>
                        <input name="newPassword" type="password" autoComplete="new-password" className={inputClass} />
                        {state?.errors?.newPassword && (
                            <ul className="mt-1 space-y-0.5">
                                {state.errors.newPassword.map((e) => (
                                    <li key={e} className="text-[11px] text-red-400">• {e}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">{a.confirmPassword}</label>
                        <input name="confirmPassword" type="password" autoComplete="new-password" className={inputClass} />
                        {state?.errors?.confirmPassword && (
                            <p className="mt-1 text-[11px] text-red-400">{state.errors.confirmPassword[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800/60">
                {state?.success ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {a.saved}
                    </span>
                ) : state?.message ? (
                    <span className="text-xs text-red-400">{state.message}</span>
                ) : <span />}

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg border border-zinc-700 hover:border-zinc-500 bg-transparent disabled:opacity-50 px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition"
                >
                    {pending ? "…" : a.updatePassword}
                </button>
            </div>
        </form>
    );
}
