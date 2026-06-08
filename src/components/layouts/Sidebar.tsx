"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    lang: string;
    dict: any;
}

export default function Sidebar({ lang, dict }: SidebarProps) {
    const pathname = usePathname();

    // Fonction qui vérifie si le lien actuel correspond à l'URL de la page
    const isActive = (path: string) => {
        // Pour le dashboard (racine), on veut une correspondance exacte
        if (path === `/${lang}`) {
            return pathname === path;
        }
        // Pour les autres pages, on vérifie si l'URL commence par le chemin (utile pour les sous-pages)
        return pathname.startsWith(path);
    };

    // Fonction pour générer les classes CSS dynamiquement (Actif vs Inactif)
    const navLinkClasses = (path: string) => `
        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
        ${
            isActive(path)
                ? "bg-purple-500/10 text-purple-400 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-2/3 before:w-[3px] before:bg-purple-500 before:rounded-r-md"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        }
    `;

    return (
        <aside className="w-[14%] h-screen fixed bg-black top-0 left-0 bg-[#0a0a0a] border-r border-zinc-900 flex flex-col z-0">
            {/* 2. Navigation principale */}
            <nav className="flex-1 pt-8 px-3 py-6 space-y-8 overflow-y-auto">
                {/* Section Overview */}
                <div>
                    <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Menu Principal
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href={`/${lang}`}
                            className={navLinkClasses(`/${lang}`)}
                        >
                            {dict?.mainBoard || "Dashboard"}
                        </Link>
                        <Link
                            href={`/${lang}/analytics`}
                            className={navLinkClasses(`/${lang}/analytics`)}
                        >
                            {dict?.analytics || "Analytics"}
                        </Link>
                    </div>
                </div>

                {/* Section Finance */}
                <div>
                    <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Finance
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href={`/${lang}/budgets`}
                            className={navLinkClasses(`/${lang}/budgets`)}
                        >
                            {dict?.budgets || "Budgets"}
                        </Link>
                        <Link
                            href={`/${lang}/accounts`}
                            className={navLinkClasses(`/${lang}/accounts`)}
                        >
                            {dict?.account || "Accounts"}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 3. Footer de la Sidebar (Optionnel : Profil ou Paramètres) */}
            <div className="p-4 border-t border-zinc-900">
                <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-zinc-800/50 transition-colors text-left">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm border border-purple-500/30">
                        ERP
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-200">
                            Mode Pro
                        </p>
                        <p className="text-xs text-zinc-500">Connecté</p>
                    </div>
                </button>
            </div>
        </aside>
    );
}
