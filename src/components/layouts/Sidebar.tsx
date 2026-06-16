"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface SidebarProps {
    lang: string;
    dict: Dictionary["sideBar"];
    user: { name: string | null; email: string | null } | null;
    /** Drawer mobile : ouvert / fermé (sans effet ≥ lg, toujours visible) */
    open?: boolean;
    onClose?: () => void;
}

function getInitials(name: string | null, email: string | null): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "??";
}

export default function Sidebar({ lang, dict, user, open = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === `/${lang}`) return pathname === path;
        return pathname.startsWith(path);
    };

    const navLinkClasses = (path: string) => `
        group/link relative flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
        ${
            isActive(path)
                ? "bg-purple-500/10 text-purple-300 border border-purple-500/15 shadow-[inset_0_1px_0_rgba(168,85,247,0.08)] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-2/3 before:w-[3px] before:bg-purple-500 before:rounded-r-md before:shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                : "text-zinc-400 border border-transparent hover:bg-zinc-900/70 hover:text-zinc-100"
        }
    `;

    const iconClasses = (path: string) =>
        `w-4 h-4 mr-2.5 shrink-0 transition-colors ${
            isActive(path) ? "text-purple-400" : "text-zinc-500 group-hover/link:text-zinc-300"
        }`;

    const initials = getInitials(user?.name ?? null, user?.email ?? null);
    const displayName = user?.name ?? user?.email?.split("@")[0] ?? "—";
    const displayEmail = user?.email ?? "";

    return (
        <>
            {/* Backdrop mobile : ferme le drawer au clic */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-zinc-900 bg-[#0a0a0a] transition-transform duration-200 ease-out lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
            {/* ── Logo ───────────────────────────────────────────────────── */}
            <div className="relative flex h-14 shrink-0 items-center border-b border-zinc-900 px-5">
                <Logo lang={lang} />
                {/* Lueur discrète sous le logo */}
                <div
                    className="pointer-events-none absolute -bottom-10 left-0 right-0 h-10"
                    style={{
                        background:
                            "radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.07) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* ── Navigation (un clic sur un lien referme le drawer mobile) ── */}
            <nav className="flex-1 overflow-y-auto px-3 pt-6 pb-4 space-y-7" onClick={onClose}>
                {/* Section principale */}
                <div>
                    <h3 className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.14em] mb-2">
                        {dict?.menuTitle || "Main Menu"}
                    </h3>
                    <div className="space-y-1">
                        <Link href={`/${lang}`} className={navLinkClasses(`/${lang}`)}>
                            <svg className={iconClasses(`/${lang}`)} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            {dict?.mainBoard || "Dashboard"}
                        </Link>
                    </div>
                </div>

                {/* Section Finance */}
                <div>
                    <h3 className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.14em] mb-2">
                        {dict?.financeTitle || "Finance"}
                    </h3>
                    <div className="space-y-1">
                        <Link href={`/${lang}/budgets`} className={navLinkClasses(`/${lang}/budgets`)}>
                            <svg className={iconClasses(`/${lang}/budgets`)} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                            </svg>
                            {dict?.budgets || "Budgets"}
                        </Link>
                        <Link href={`/${lang}/goals`} className={navLinkClasses(`/${lang}/goals`)}>
                            <svg className={iconClasses(`/${lang}/goals`)} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                            </svg>
                            {dict?.goals || "Goals"}
                        </Link>
                        <Link href={`/${lang}/analytics`} className={navLinkClasses(`/${lang}/analytics`)}>
                            <svg className={iconClasses(`/${lang}/analytics`)} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            {dict?.analytics || "Analytics"}
                        </Link>
                        <Link href={`/${lang}/markets`} className={navLinkClasses(`/${lang}/markets`)}>
                            <svg className={iconClasses(`/${lang}/markets`)} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                            </svg>
                            {dict?.markets || "Markets"}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Footer : profil utilisateur ────────────────────────────── */}
            <div className="shrink-0 border-t border-zinc-900 p-3">
                <Link
                    href={`/${lang}/accounts`}
                    onClick={onClose}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        isActive(`/${lang}/accounts`)
                            ? "bg-purple-500/10 border border-purple-500/20"
                            : "border border-transparent hover:bg-zinc-900/70"
                    }`}
                >
                    {/* Avatar avec initiales */}
                    <div className="relative flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-600 to-purple-800 text-[11px] font-bold text-white">
                            {initials}
                        </div>
                        {/* Point de statut connecté */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-500" />
                    </div>

                    {/* Nom + email */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold leading-tight text-zinc-200 transition-colors group-hover:text-white">
                            {displayName}
                        </p>
                        <p className="truncate text-[10px] leading-tight text-zinc-600">
                            {displayEmail}
                        </p>
                    </div>

                    {/* Chevron */}
                    <svg className="h-3 w-3 flex-shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </div>
            </aside>
        </>
    );
}
