"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface AppLayoutProps {
    children: ReactNode;
    lang: string;
    dict: Dictionary;
    user: { name: string | null; email: string | null } | null;
}

/**
 * Structure de l'app : sidebar de 240px (drawer coulissant sous lg),
 * header translucide de 56px, contenu plafonné à 1600px pour rester
 * lisible sur les écrans ultrawide (21/9).
 */
export default function AppLayout({ children, lang, dict, user }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Sidebar
                lang={lang}
                dict={dict.sideBar}
                user={user}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <Header dict={dict} onMenuToggle={() => setSidebarOpen(true)} />
            <main className="pt-14 lg:ml-60">
                <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </>
    );
}
