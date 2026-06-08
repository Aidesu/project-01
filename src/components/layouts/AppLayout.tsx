// components/layouts/AppLayout.tsx
"use client"; // ⚠️ OBLIGATOIRE

import Header from "./Header";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    lang: string;
    dict: any;
}

export default function AppLayout({ children, lang, dict }: AppLayoutProps) {
    return (
        <>
            <Header />
            <div className="flex flex-1">
                <Sidebar lang={lang} dict={dict.sideBar} />
                <main className="flex-1 ml-[14%] mt-[2rem] p-8">
                    {children}
                </main>
            </div>
        </>
    );
}
