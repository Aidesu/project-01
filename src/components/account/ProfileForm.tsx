"use client";

import { useActionState } from "react";
import { updateProfile, type AuthFormState } from "@/app/actions/auth";
import { CURRENCIES, LOCALES } from "@/lib/validation/auth";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface ProfileFormProps {
    dict: Dictionary;
    user: {
        name: string | null;
        email: string | null;
        currency: string | null;
        locale: string | null;
        incomeRange: string | null;
        savingsGoal: number | null;
    };
}

const LANG_LABELS: Record<string, string> = { en: "English", fr: "Français", ja: "日本語" };

export default function ProfileForm({ dict, user }: ProfileFormProps) {
    const a = dict.account;
    const [state, action, pending] = useActionState<AuthFormState, FormData>(
        updateProfile,
        undefined,
    );

    const inputClass =
        "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors placeholder-zinc-600";
    const selectClass = inputClass + " [color-scheme:dark]";

    const incomeRanges = a.incomeRanges as Record<string, string>;

    return (
        <form action={action} className="space-y-0">
            {/* Champ caché : locale précédente pour détecter un changement */}
            <input type="hidden" name="_prevLocale" value={user.locale ?? "en"} />

            {/* ── Informations personnelles ─────────────────────── */}
            <Section title={a.personalInfo}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={a.fullName} error={state?.errors?.name?.[0]}>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user.name ?? ""}
                            autoComplete="name"
                            className={inputClass}
                        />
                    </Field>
                    <Field label={a.email}>
                        <div className="relative">
                            <input
                                type="email"
                                value={user.email ?? ""}
                                readOnly
                                className={inputClass + " pr-8 cursor-not-allowed opacity-50"}
                            />
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-600">{a.emailReadonly}</p>
                    </Field>
                </div>
            </Section>

            {/* ── Préférences ───────────────────────────────────── */}
            <Section title={a.preferences} className="border-t border-zinc-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={a.currency} error={state?.errors?.currency?.[0]}>
                        <select name="currency" defaultValue={user.currency ?? "USD"} className={selectClass}>
                            {CURRENCIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label={a.language} error={state?.errors?.locale?.[0]}>
                        <select name="locale" defaultValue={user.locale ?? "en"} className={selectClass}>
                            {LOCALES.map((l) => (
                                <option key={l} value={l}>{LANG_LABELS[l]}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label={a.incomeRange}>
                        <select name="incomeRange" defaultValue={user.incomeRange ?? ""} className={selectClass}>
                            {Object.entries(incomeRanges).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label={a.savingsGoal} error={state?.errors?.savingsGoal?.[0]}>
                        <div className="relative">
                            <input
                                name="savingsGoal"
                                type="number"
                                min="0"
                                step="1"
                                defaultValue={user.savingsGoal ?? ""}
                                placeholder="0"
                                className={inputClass + " pr-8"}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">$</span>
                        </div>
                    </Field>
                </div>
            </Section>

            {/* ── Feedback + bouton ─────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800/60">
                {state?.success && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {a.saved}
                    </span>
                )}
                {state?.message && !state.success && (
                    <span className="text-xs text-red-400">{state.message}</span>
                )}
                {!state?.success && !state?.message && <span />}

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition shadow-lg shadow-purple-900/30"
                >
                    {pending ? "…" : a.saveChanges}
                </button>
            </div>
        </form>
    );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-5 py-5 ${className}`}>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">{title}</h3>
            {children}
        </div>
    );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
        </div>
    );
}
