"use client";

import Link from "next/link";
import { useActionState } from "react";

import { register, type AuthFormState } from "@/app/actions/auth";

export default function RegisterPage() {
    const [state, action, pending] = useActionState<AuthFormState, FormData>(
        register,
        undefined,
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Créer un compte</h1>
                <p className="text-sm text-zinc-400">
                    Quelques secondes suffisent pour démarrer.
                </p>
            </div>

            {state?.message && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
                >
                    {state.message}
                </p>
            )}

            <form action={action} className="space-y-4" noValidate>
                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">
                        Nom
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-white/30"
                    />
                    {state?.errors?.name && (
                        <p className="text-xs text-red-400">
                            {state.errors.name[0]}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-white/30"
                    />
                    {state?.errors?.email && (
                        <p className="text-xs text-red-400">
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-white/30"
                    />
                    {state?.errors?.password ? (
                        <ul className="space-y-0.5 text-xs text-red-400">
                            {state.errors.password.map((err) => (
                                <li key={err}>• {err}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-zinc-500">
                            8 caractères min., avec lettre, chiffre et caractère
                            spécial.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                    {pending ? "Création…" : "Créer mon compte"}
                </button>
            </form>

            <p className="text-center text-sm text-zinc-400">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-white underline">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}
