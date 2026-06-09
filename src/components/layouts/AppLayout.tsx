"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    lang: string;
    dict: any;
    user: { name: string | null; email: string | null } | null;
}

export default function AppLayout({ children, lang, dict, user }: AppLayoutProps) {
    return (
        <>
            <Header />
            <div className="flex flex-1">
                <Sidebar lang={lang} dict={dict.sideBar} user={user} />
                <main className="flex-1 ml-[14%] mt-[2rem] p-8">
                    {children}
                </main>
            </div>
        </>
    );
}
