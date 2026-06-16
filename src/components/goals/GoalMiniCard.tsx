import Link from "next/link";
import { GOAL_THEMES, goalProgress, goalReached } from "./goalTheme";
import { formatCurrency } from "@/lib/format";
import type { GoalDTO } from "@/services/goalService";

interface GoalMiniCardProps {
    goal: GoalDTO;
    lang: string;
    locale: string;
    currency: string;
}

/**
 * Version compacte d'un objectif pour le tableau de bord : anneau de
 * progression + nom + montants. Toute la carte mène à la page Objectifs.
 */
export default function GoalMiniCard({ goal, lang, locale, currency }: GoalMiniCardProps) {
    const theme = GOAL_THEMES[goal.type];
    const progress = goalProgress(goal);
    const reached = goalReached(goal);
    const color = reached ? "#10b981" : theme.color;
    const pct = Math.round(progress * 100);

    const R = 20;
    const CIRC = 2 * Math.PI * R;

    return (
        <Link
            href={`/${lang}/goals`}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-4 shadow-xl transition-colors hover:border-purple-500/30"
        >
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{ background: `linear-gradient(90deg, ${color}99 0%, ${color}22 100%)` }}
            />

            {/* Anneau + pictogramme du thème */}
            <div className="relative h-14 w-14 shrink-0">
                <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
                    <circle cx="24" cy="24" r={R} fill="none" stroke="#27272a" strokeWidth="4" />
                    <circle
                        cx="24" cy="24" r={R} fill="none"
                        stroke={color} strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-5 w-5" style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        {theme.icon}
                    </svg>
                </div>
            </div>

            {/* Nom + montants */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    {goal.pinned && (
                        <svg className="h-3 w-3 shrink-0 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    )}
                    <p className="truncate text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {goal.name}
                    </p>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-300">
                        {formatCurrency(goal.savedAmount, locale, currency)}
                    </span>{" "}
                    / {formatCurrency(goal.targetAmount, locale, currency)}
                </p>
                <div className="mt-2 h-1 w-full rounded-full bg-zinc-800/80">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                    />
                </div>
            </div>

            {/* Pourcentage */}
            <span className="shrink-0 text-base font-extrabold" style={{ color }}>
                {pct}%
            </span>
        </Link>
    );
}
