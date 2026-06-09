"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login, type AuthFormState } from "@/app/actions/auth";

export default function LoginPage() {
    const [state, action, pending] = useActionState<AuthFormState, FormData>(
        login,
        undefined,
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Connexion</h1>
                <p className="text-sm text-zinc-400">
                    Accédez à votre tableau de bord StatEco.
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
                        autoComplete="current-password"
                        required
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-white/30"
                    />
                    {state?.errors?.password && (
                        <p className="text-xs text-red-400">
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                    {pending ? "Connexion…" : "Se connecter"}
                </button>
            </form>

            <p className="text-center text-sm text-zinc-400">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-white underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    );
}
