// components/layouts/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { updateLocale } from "@/app/actions/auth";

const languages = [
    { code: "en", name: "EN", label: "English" },
    { code: "fr", name: "FR", label: "Français" },
    { code: "ja", name: "JA", label: "日本語" },
];

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [, startPersist] = useTransition();

    // Récupération ultra-fiable de la langue active via les paramètres du routeur
    const currentLang = (params?.lang as string) || "en";

    const handleLanguageChange = (newLang: string) => {
        if (!pathname) return;

        const segments = pathname.split("/");
        // Les segments d'un pathname commençant par "/" ont un élément vide en premier [0]
        // Le code langue se trouve donc à l'index [1]
        segments[1] = newLang;

        setIsOpen(false);
        // Persiste la préférence (User.locale) pour les prochaines connexions.
        startPersist(async () => {
            await updateLocale(newLang);
        });
        router.push(segments.join("/"));
    };

    return (
        <div className="relative inline-block text-left z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-lg border bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold tracking-wider transition-all ${
                    isOpen
                        ? "border-purple-500/40 text-white"
                        : "border-zinc-800 text-zinc-300 hover:border-purple-500/40 hover:text-white"
                }`}
            >
                {/* Globe */}
                <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span className="uppercase">{currentLang}</span>
                <svg
                    className={`h-3 w-3 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
                        {languages.map((lang) => {
                            const active = currentLang === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-purple-950/30 ${
                                        active
                                            ? "bg-purple-950/10 font-semibold text-purple-300"
                                            : "text-zinc-400"
                                    }`}
                                >
                                    <span>{lang.label}</span>
                                    {active ? (
                                        <svg className="h-3.5 w-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    ) : (
                                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                                            {lang.name}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
