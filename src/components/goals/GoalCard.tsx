"use client";

import BoardingPassCard from "./BoardingPassCard";
import ThemedGoalCard from "./ThemedGoalCard";
import { goalProgress, goalReached, GOAL_THEMES } from "./goalTheme";
import { interpolate } from "@/lib/format";
import type { GoalDTO } from "@/services/goalService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export interface GoalCardProps {
    goal: GoalDTO;
    userName: string | null;
    lang: string;
    locale: string;
    currency: string;
    dict: Dictionary;
    onEdit: () => void;
    onDelete: () => void;
    onContribute: () => void;
    onTogglePin: () => void;
}

/* ── Visuels thématiques ──────────────────────────────────────────────── */

/** Compteur de vitesse (voiture) : l'aiguille monte avec la progression. */
function Speedometer({ progress, reached }: { progress: number; reached: boolean }) {
    const R = 46;
    const HALF = Math.PI * R;
    const angle = -90 + progress * 180;
    const color = reached ? "#10b981" : "#f97316";

    return (
        <svg viewBox="0 0 120 78" className="w-full">
            <path d={`M 14 70 A ${R} ${R} 0 0 1 106 70`} fill="none" stroke="#27272a" strokeWidth="9" strokeLinecap="round" />
            <path
                d={`M 14 70 A ${R} ${R} 0 0 1 106 70`}
                fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
                strokeDasharray={HALF} strokeDashoffset={HALF * (1 - progress)}
            />
            {/* Graduations */}
            {[0, 45, 90, 135, 180].map((a) => {
                const rad = ((a - 180) * Math.PI) / 180;
                const x1 = 60 + Math.cos(rad) * 34;
                const y1 = 70 + Math.sin(rad) * 34;
                const x2 = 60 + Math.cos(rad) * 38;
                const y2 = 70 + Math.sin(rad) * 38;
                return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#52525b" strokeWidth="1.5" />;
            })}
            {/* Aiguille */}
            <g transform={`rotate(${angle}, 60, 70)`}>
                <line x1="60" y1="70" x2="60" y2="34" stroke="#f4f4f5" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle cx="60" cy="70" r="4" fill="#f4f4f5" />
            <text x="60" y="60" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
                {Math.round(progress * 100)}%
            </text>
        </svg>
    );
}

/** Batterie (high-tech) : se remplit segment par segment. */
function Battery({ progress, reached }: { progress: number; reached: boolean }) {
    const cells = 5;
    const filled = Math.round(progress * cells);
    const color = reached ? "#10b981" : "#3b82f6";

    return (
        <div className="flex w-full flex-col items-center gap-2">
            <div className="relative w-full max-w-[8.5rem]">
                <div className="flex h-14 w-full gap-1 rounded-lg border-2 border-zinc-600 p-1">
                    {Array.from({ length: cells }).map((_, i) => (
                        <div
                            key={i}
                            className="h-full flex-1 rounded-[3px] transition-colors"
                            style={{
                                background: i < filled ? color : "#27272a",
                                boxShadow: i < filled ? `0 0 8px ${color}66` : undefined,
                            }}
                        />
                    ))}
                </div>
                {/* Borne de la batterie */}
                <div className="absolute -right-1.5 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-r-md bg-zinc-600" />
                {/* Éclair de charge */}
                {!reached && (
                    <svg
                        className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.9)]"
                        fill="currentColor" viewBox="0 0 24 24"
                    >
                        <path d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" />
                    </svg>
                )}
            </div>
            <p className="text-lg font-extrabold" style={{ color }}>
                {Math.round(progress * 100)}%
            </p>
        </div>
    );
}

/** Maison (logement) : se remplit du sol au toit. */
function House({ progress, reached }: { progress: number; reached: boolean }) {
    const color = reached ? "#10b981" : "#f59e0b";
    // Maison entre y=10 (faîte) et y=84 (sol)
    const fillHeight = 74 * progress;

    return (
        <svg viewBox="0 0 100 90" className="w-full max-w-[8rem]">
            <defs>
                <clipPath id={`house-clip-${Math.round(progress * 100)}`}>
                    <rect x="0" y={84 - fillHeight} width="100" height={fillHeight} />
                </clipPath>
            </defs>
            {/* Silhouette pleine (fond) */}
            <path
                d="M50 10 L92 44 L80 44 L80 84 L20 84 L20 44 L8 44 Z"
                fill="#1b1b20"
                stroke="#3f3f46"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Remplissage par le bas */}
            <path
                d="M50 10 L92 44 L80 44 L80 84 L20 84 L20 44 L8 44 Z"
                fill={color}
                opacity="0.85"
                clipPath={`url(#house-clip-${Math.round(progress * 100)})`}
            />
            {/* Porte */}
            <rect x="43" y="62" width="14" height="22" rx="2" fill="#0d0d11" opacity="0.65" />
            <text x="50" y="50" textAnchor="middle" fill="#fafafa" fontSize="13" fontWeight="800">
                {Math.round(progress * 100)}%
            </text>
        </svg>
    );
}

/** Bouclier (fonds d'urgence) : la protection se construit par le bas. */
function Shield({ progress, reached }: { progress: number; reached: boolean }) {
    const color = "#10b981";
    const fillHeight = 20 * progress;

    return (
        <svg viewBox="0 0 24 24" className="w-full max-w-[7rem]">
            <defs>
                <clipPath id={`shield-clip-${Math.round(progress * 100)}`}>
                    <rect x="0" y={22 - fillHeight} width="24" height={fillHeight} />
                </clipPath>
            </defs>
            <path
                d="M12 2.25c-2.429 2.066-5.59 3.31-9 3.32v6.18c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62V5.57c-3.41-.01-6.571-1.254-9-3.32z"
                fill="#1b1b20" stroke="#3f3f46" strokeWidth="1" strokeLinejoin="round"
            />
            <path
                d="M12 2.25c-2.429 2.066-5.59 3.31-9 3.32v6.18c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62V5.57c-3.41-.01-6.571-1.254-9-3.32z"
                fill={color} opacity="0.8"
                clipPath={`url(#shield-clip-${Math.round(progress * 100)})`}
            />
            {reached ? (
                <path d="M8.5 12.5l2.5 2.5 4.5-5.5" fill="none" stroke="#fafafa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
                <text x="12" y="14" textAnchor="middle" fill="#fafafa" fontSize="5.5" fontWeight="800">
                    {Math.round(progress * 100)}%
                </text>
            )}
        </svg>
    );
}

/** Visuel générique : anneau de progression autour du pictogramme du thème. */
function RingIcon({ goal }: { goal: GoalDTO }) {
    const theme = GOAL_THEMES[goal.type];
    const progress = goalProgress(goal);
    const reached = goalReached(goal);
    const color = reached ? "#10b981" : theme.color;
    const R = 42;
    const CIRC = 2 * Math.PI * R;

    return (
        <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#27272a" strokeWidth="8" />
                <circle
                    cx="50" cy="50" r={R} fill="none"
                    stroke={color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <svg className="h-6 w-6" style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    {theme.icon}
                </svg>
                <span className="text-sm font-extrabold text-white">{Math.round(progress * 100)}%</span>
            </div>
        </div>
    );
}

/* ── Dispatcher ───────────────────────────────────────────────────────── */

/**
 * Carte d'objectif : chaque thème a son module visuel propre
 * (billet d'avion, compteur, batterie, maison, bouclier, anneau générique).
 */
export default function GoalCard(props: GoalCardProps) {
    const { goal, dict } = props;
    const t = dict.goals.card;
    const progress = goalProgress(goal);
    const reached = goalReached(goal);
    const pct = Math.round(progress * 100);

    switch (goal.type) {
        case "TRAVEL":
            return <BoardingPassCard {...props} />;
        case "CAR":
            return (
                <ThemedGoalCard
                    {...props}
                    visual={<Speedometer progress={progress} reached={reached} />}
                    status={reached ? t.arrived : interpolate(t.cruising, { pct })}
                />
            );
        case "TECH":
            return (
                <ThemedGoalCard
                    {...props}
                    visual={<Battery progress={progress} reached={reached} />}
                    status={reached ? t.fullyCharged : t.charging}
                />
            );
        case "HOME":
            return (
                <ThemedGoalCard
                    {...props}
                    visual={<House progress={progress} reached={reached} />}
                    status={reached ? t.moveInReady : t.underConstruction}
                />
            );
        case "EMERGENCY":
            return (
                <ThemedGoalCard
                    {...props}
                    visual={<Shield progress={progress} reached={reached} />}
                    status={reached ? t.protected : t.building}
                />
            );
        default:
            return <ThemedGoalCard {...props} visual={<RingIcon goal={goal} />} />;
    }
}
