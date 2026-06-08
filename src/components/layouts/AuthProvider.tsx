// components/layouts/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
    lang: string;
    dict: any; // Remplace `any` par le type de ton dictionnaire
}

export default function AuthProvider({
    children,
    lang,
    dict,
}: AuthProviderProps) {
    return (
        <SessionProvider>
            <Header />
            <div className="flex flex-1">
                <Sidebar lang={lang} dict={dict.sideBar} />
                <main className="flex-1 ml-[14%] mt-[2rem] p-8">
                    {children}
                </main>
            </div>
        </SessionProvider>
    );
}
