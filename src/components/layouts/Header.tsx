"use client";
// components/layouts/Header.tsx
import LanguageSwitcher from "./LanguageSwitcher";
import { logout } from "@/app/actions/auth";

export default function Header() {
    return (
        <header className="h-[3rem] w-full fixed px-5 border-b border-zinc-900 z-40 flex items-center justify-between bg-black">
            <h1 className="font-bold text-3xl tracking-tight text-white select-none">
                Stat
                <span className="font-light text-purple-500 tracking-wide ml-px">
                    Eko
                </span>
                <span className="inline-block w-2 h-2 ml-1 bg-purple-400 rounded-full animate-pulse" />
            </h1>

            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <form action={logout}>
                    <button
                        type="submit"
                        className="rounded-lg border border-white/10 px-3 py-1 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Déconnexion
                    </button>
                </form>
            </div>
        </header>
    );
}
