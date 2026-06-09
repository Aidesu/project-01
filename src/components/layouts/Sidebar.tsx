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
                            {dict?.mainBoard || "Dashboard"}
                        </Link>
                        <Link href={`/${lang}/analytics`} className={navLinkClasses(`/${lang}/analytics`)}>
                            {dict?.analytics || "Analytics"}
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
                            {dict?.budgets || "Budgets"}
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
