"use client";

import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { logout } from "@/app/actions/auth";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface HeaderProps {
    dict: Dictionary;
    /** Ouvre le drawer de navigation sur mobile */
    onMenuToggle?: () => void;
}

/**
 * Header de la zone de contenu (à droite de la sidebar) : titre de la page
 * courante + sélecteur de langue + déconnexion. Fond translucide flouté.
 */
export default function Header({ dict, onMenuToggle }: HeaderProps) {
    const pathname = usePathname();

    // Titre contextuel dérivé du segment après la langue (/fr/budgets → "Budget")
    const segment = pathname.split("/")[2] ?? "";
    const titles: Record<string, string | undefined> = {
        "": dict.sideBar?.mainBoard,
        budgets: dict.sideBar?.budgets,
        goals: dict.sideBar?.goals,
        analytics: dict.sideBar?.analytics,
        markets: dict.sideBar?.markets,
        accounts: dict.sideBar?.account,
    };
    const title = titles[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
        <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-zinc-900 bg-[#0a0a0a]/80 px-4 backdrop-blur-md sm:px-6 lg:left-60">
            <div className="flex items-center gap-3 select-none">
                {/* Hamburger mobile */}
                <button
                    type="button"
                    onClick={onMenuToggle}
                    aria-label="Menu"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-purple-500/40 hover:text-white lg:hidden"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Fil d'Ariane minimal */}
                <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                    <span className="text-sm font-semibold tracking-tight text-zinc-100">
                        {title}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <LanguageSwitcher />

                <div className="h-5 w-px bg-zinc-800" />

                <form action={logout}>
                    <button
                        type="submit"
                        className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-300"
                    >
                        <svg className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        {dict.account?.logout ?? "Log out"}
                    </button>
                </form>
            </div>
        </header>
    );
}
