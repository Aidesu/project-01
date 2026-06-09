"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    lang: string;
    dict: any;
    user: { name: string | null; email: string | null } | null;
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

export default function Sidebar({ lang, dict, user }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === `/${lang}`) return pathname === path;
        return pathname.startsWith(path);
    };

    const navLinkClasses = (path: string) => `
        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
        ${
            isActive(path)
                ? "bg-purple-500/10 text-purple-400 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-2/3 before:w-[3px] before:bg-purple-500 before:rounded-r-md"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        }
    `;

    const initials = getInitials(user?.name ?? null, user?.email ?? null);
    const displayName = user?.name ?? user?.email?.split("@")[0] ?? "—";
    const displayEmail = user?.email ?? "";

    return (
        <aside className="w-[14%] h-screen fixed bg-black top-0 left-0 bg-[#0a0a0a] border-r border-zinc-900 flex flex-col z-0">
            <nav className="flex-1 pt-8 px-3 py-6 space-y-8 overflow-y-auto">
                {/* Section principale */}
                <div>
                    <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        {dict?.menuTitle || "Main Menu"}
                    </h3>
                    <div className="space-y-1">
                        <Link href={`/${lang}`} className={navLinkClasses(`/${lang}`)}>
                            <svg className="w-4 h-4 mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            {dict?.mainBoard || "Dashboard"}
                        </Link>
                    </div>
                </div>

                {/* Section Finance */}
                <div>
                    <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        {dict?.financeTitle || "Finance"}
                    </h3>
                    <div className="space-y-1">
                        <Link href={`/${lang}/budgets`} className={navLinkClasses(`/${lang}/budgets`)}>
                            <svg className="w-4 h-4 mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                            </svg>
                            {dict?.budgets || "Budgets"}
                        </Link>
                        <Link href={`/${lang}/analytics`} className={navLinkClasses(`/${lang}/analytics`)}>
                            <svg className="w-4 h-4 mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            {dict?.analytics || "Analytics"}
                        </Link>
                        <Link href={`/${lang}/markets`} className={navLinkClasses(`/${lang}/markets`)}>
                            <svg className="w-4 h-4 mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                            </svg>
                            {dict?.markets || "Markets"}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Footer — profil utilisateur */}
            <div className="p-3 border-t border-zinc-900">
                <Link
                    href={`/${lang}/accounts`}
                    className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors group ${
                        isActive(`/${lang}/accounts`)
                            ? "bg-purple-500/10 border border-purple-500/20"
                            : "hover:bg-zinc-800/60 border border-transparent"
                    }`}
                >
                    {/* Avatar avec initiales */}
                    <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-[11px] font-bold border border-purple-500/30">
                            {initials}
                        </div>
                        {/* Point de statut connecté */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]" />
                    </div>

                    {/* Nom + email */}
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-zinc-200 truncate leading-tight group-hover:text-white transition-colors">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-zinc-600 truncate leading-tight">
                            {displayEmail}
                        </p>
                    </div>

                    {/* Chevron */}
                    <svg className="w-3 h-3 text-zinc-600 flex-shrink-0 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </div>
        </aside>
    );
}
