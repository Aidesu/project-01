"use client";

import React, { useState } from "react";

interface GraphicCard2Props {
    month: string;
    year: string | number;
    children: React.ReactNode;
    isCurrent?: boolean;
    onModify?: () => void;
    onDelete?: () => void;
    trend?: {
        value: string;
        label: string;
        type: "up" | "down";
    };
}

export default function GraphicCard2({
    month,
    year,
    children,
    isCurrent = false,
    onModify,
    onDelete,
    trend,
}: GraphicCard2Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const card = (
        <div
            className={`flex flex-col rounded-xl shadow-xl w-full h-[320px] relative ${
                isCurrent
                    ? "bg-[#0f0b1a]"
                    : "bg-[#0d0d11] border border-zinc-800/80"
            }`}
        >
            {/* Top Bar : Aligné aux deux extrémités de la ligne */}
            <div className="flex justify-between items-center pt-3 px-4 select-none">
                {/* À GAUCHE : Badge de tendance moderne */}
                {trend ? (
                    <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-tight ${
                            trend.type === "up"
                                ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10"
                                : "text-rose-400 bg-rose-500/5 border border-rose-500/10"
                        }`}
                    >
                        {/* Flèche directionnelle en SVG fin */}
                        {trend.type === "up" ? (
                            <svg
                                className="w-3 h-3 text-emerald-400 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-3 h-3 text-rose-400 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
                                />
                            </svg>
                        )}
                        <span>
                            {trend.value} {trend.label}
                        </span>
                    </div>
                ) : (
                    // Spacer invisible pour maintenir l'année à droite si pas de trend
                    <div />
                )}

                {/* À DROITE : badge "Ce mois" + année */}
                <div className="flex items-center gap-2">
                    {isCurrent && (
                        <span className="rounded-full bg-purple-600/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300 tracking-wider uppercase">
                            Ce mois
                        </span>
                    )}
                    <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-wider">
                        {year}
                    </span>
                </div>
            </div>

            {/* Zone du graphique (Hauteur fixe pour ECharts) */}
            <div className="w-full h-[210px] px-2 relative">{children}</div>

            {/* Footer Bar */}
            <div className="flex justify-between items-center bg-zinc-950/50 border-t border-zinc-800/60 px-4 py-3 mt-auto rounded-b-xl">
                <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">
                    {month}
                </h3>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-md text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-purple-400 focus:outline-none ${
                            isMenuOpen ? "text-purple-400 bg-zinc-900" : ""
                        }`}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 bottom-full mb-1.5 w-32 rounded-lg bg-zinc-950 border border-zinc-800 shadow-xl z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        if (onModify) onModify();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 hover:text-purple-400 transition-colors text-left"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => {
                                        if (onDelete) onDelete();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] text-red-400 hover:bg-red-950/20 transition-colors text-left border-t border-zinc-900"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    if (!isCurrent) return card;

    // Gradient border : wrapper avec padding 1px, background gradient → inner card par-dessus.
    return (
        <div
            className="rounded-xl w-full h-[320px] relative"
            style={{
                padding: "1px",
                background:
                    "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #3b1d6e 80%, #1e1333 100%)",
                boxShadow: "0 0 32px 0 rgba(124,58,237,0.18)",
            }}
        >
            {/* Glow ambiant derrière la carte */}
            <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
                }}
            />
            {card}
        </div>
    );
}
