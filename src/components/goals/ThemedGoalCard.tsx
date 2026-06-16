"use client";

import GoalActions from "./GoalActions";
import { goalProgress, goalReached, GOAL_THEMES } from "./goalTheme";
import type { GoalCardProps } from "./GoalCard";
import { formatCurrency, interpolate } from "@/lib/format";

interface ThemedGoalCardProps extends Omit<GoalCardProps, "userName" | "lang"> {
    /** Zone visuelle thématique (jauge, batterie, maison…) */
    visual: React.ReactNode;
    /** Ligne de statut amusante ("En charge…", "En construction"…) */
    status?: string;
}

/**
 * Gabarit commun des cartes d'objectif thématiques : visuel ludique à
 * gauche, informations + actions à droite. Même hauteur que le billet
 * d'embarquement pour une grille homogène.
 */
export default function ThemedGoalCard({
    goal,
    locale,
    currency,
    dict,
    visual,
    status,
    onEdit,
    onDelete,
    onContribute,
    onTogglePin,
}: ThemedGoalCardProps) {
    const t = dict.goals.card;
    const theme = GOAL_THEMES[goal.type];
    const progress = goalProgress(goal);
    const reached = goalReached(goal);

    return (
        <div className="relative flex h-60 w-full gap-5 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-5 shadow-xl">
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{ background: `linear-gradient(90deg, ${theme.color}99 0%, ${theme.color}22 100%)` }}
            />
            <div
                className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
                style={{ background: `${theme.color}0f` }}
            />

            {/* Zone visuelle thématique */}
            <div className="relative z-10 flex w-36 shrink-0 items-center justify-center">
                {visual}
            </div>

            {/* Informations + actions */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <span
                            className="flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            style={{
                                color: theme.color,
                                borderColor: `${theme.color}33`,
                                background: `${theme.color}14`,
                            }}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                {theme.icon}
                            </svg>
                            {dict.goals.types[goal.type]}
                        </span>
                        <span className="flex items-center gap-1">
                            {goal.pinned && (
                                <svg className="h-3.5 w-3.5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                            )}
                            <GoalActions
                                pinLabel={goal.pinned ? dict.goals.unpinAction : dict.goals.pinAction}
                                editLabel={dict.goals.editAction}
                                deleteLabel={dict.goals.deleteAction}
                                onTogglePin={onTogglePin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </span>
                    </div>
                    <h3 className="mt-2 truncate text-base font-bold text-white">{goal.name}</h3>
                </div>

                <div>
                    <p className="text-xl font-extrabold text-white leading-none">
                        {formatCurrency(goal.savedAmount, locale, currency)}
                        <span className="ml-1.5 text-xs font-medium text-zinc-500">
                            {t.of} {formatCurrency(goal.targetAmount, locale, currency)}
                        </span>
                    </p>
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-zinc-800/80">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${Math.round(progress * 100)}%`,
                                background: reached ? "#10b981" : theme.color,
                            }}
                        />
                    </div>
                    <p
                        className="mt-1.5 text-[11px] font-medium"
                        style={{ color: reached ? "#34d399" : `${theme.color}cc` }}
                    >
                        {status ??
                            (reached
                                ? t.reached
                                : interpolate(t.toGo, {
                                      amount: formatCurrency(
                                          goal.targetAmount - goal.savedAmount,
                                          locale,
                                          currency,
                                      ),
                                  }))}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onContribute}
                    className="flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors"
                    style={{
                        color: theme.color,
                        borderColor: `${theme.color}33`,
                        background: `${theme.color}14`,
                    }}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {dict.goals.contribute}
                </button>
            </div>
        </div>
    );
}
