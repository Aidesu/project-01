// components/layouts/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { useState } from "react";

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

    // Récupération ultra-fiable de la langue active via les paramètres du routeur
    const currentLang = (params?.lang as string) || "en";

    const handleLanguageChange = (newLang: string) => {
        if (!pathname) return;

        const segments = pathname.split("/");
        // Les segments d'un pathname commençant par "/" ont un élément vide en premier [0]
        // Le code langue se trouve donc à l'index [1]
        segments[1] = newLang;

        setIsOpen(false);
        router.push(segments.join("/"));
    };

    return (
        <div className="relative inline-block text-left mr-8 z-50">
            {/* Bouton épuré style SaaS moderne */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all"
            >
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="uppercase">{currentLang}</span>
                <svg
                    className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-32 rounded-lg bg-zinc-950 border border-zinc-800 shadow-2xl z-20 overflow-hidden">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors hover:bg-purple-950/30 ${
                                    currentLang === lang.code
                                        ? "text-purple-400 font-bold bg-purple-950/10"
                                        : "text-zinc-400"
                                }`}
                            >
                                <span>{lang.label}</span>
                                <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                                    {lang.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
