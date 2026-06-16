"use client";

import GoalActions from "./GoalActions";
import { goalProgress, goalReached } from "./goalTheme";
import type { GoalCardProps } from "./GoalCard";
import { formatCurrency, interpolate } from "@/lib/format";

/** Numéro de vol stable dérivé de l'id de l'objectif (pur décorum). */
function flightNumber(id: string): string {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 900;
    return `SV-${h + 100}`;
}

/**
 * Objectif « Voyage » : carte d'embarquement. Le trajet d'épargne est
 * représenté comme un vol — l'avion avance sur la ligne au fil des dépôts.
 */
export default function BoardingPassCard({
    goal,
    userName,
    lang,
    locale,
    currency,
    dict,
    onEdit,
    onDelete,
    onContribute,
    onTogglePin,
}: GoalCardProps) {
    const t = dict.goals.card;
    const progress = goalProgress(goal);
    const pct = Math.round(progress * 100);
    const reached = goalReached(goal);

    const dateLabel = goal.targetDate
        ? new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric" })
              .format(new Date(`${goal.targetDate}T00:00:00`))
        : "—";

    return (
        <div className="relative flex h-60 w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-[#11101c] shadow-xl">
            {/* Liseré « compagnie aérienne » */}
            <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #7c3aed22 100%)" }}
            />

            {/* ── Partie principale du billet ───────────────────────────── */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-4 pr-5">
                {/* En-tête compagnie */}
                <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-purple-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        {t.boardingPass}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-zinc-500">
                        {goal.pinned && (
                            <svg className="h-3 w-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        )}
                        {t.flight} {flightNumber(goal.id)}
                    </span>
                </div>

                {/* Trajet : épargne → destination */}
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[9px] font-semibold tracking-widest text-zinc-500">{t.from}</p>
                        <p className="text-lg font-extrabold uppercase tracking-tight text-white truncate">
                            {t.savingsAccount}
                        </p>
                        <p className="text-[11px] font-semibold text-purple-300">
                            {formatCurrency(goal.savedAmount, locale, currency)}
                        </p>
                    </div>
                    <div className="min-w-0 text-right">
                        <p className="text-[9px] font-semibold tracking-widest text-zinc-500">{t.to}</p>
                        <p className="text-lg font-extrabold uppercase tracking-tight text-white truncate">
                            {goal.name}
                        </p>
                        <p className="text-[11px] font-semibold text-zinc-400">
                            {formatCurrency(goal.targetAmount, locale, currency)}
                        </p>
                    </div>
                </div>

                {/* Ligne de vol : l'avion avance avec la progression */}
                <div className="relative mx-1 h-5">
                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-zinc-700" />
                    <div
                        className="absolute top-1/2 left-0 border-t-2 border-purple-500"
                        style={{ width: `${pct}%` }}
                    />
                    {/* Avion positionné à la progression */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-purple-300"
                        style={{ left: `${pct}%` }}
                    >
                        <svg className="w-4 h-4 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]" fill="currentColor" viewBox="0 0 576 512">
                            <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L380.8 192l101.5 0z" />
                        </svg>
                    </div>
                    {/* Repère destination */}
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full ${reached ? "bg-emerald-400" : "bg-zinc-600"}`} />
                </div>

                {/* Pied : infos passager */}
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[9px] font-semibold tracking-widest text-zinc-500">{t.passenger}</p>
                        <p className="text-[11px] font-semibold uppercase text-zinc-200 truncate">
                            {userName ?? "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold tracking-widest text-zinc-500">{t.date}</p>
                        <p className="text-[11px] font-semibold uppercase text-zinc-200 whitespace-nowrap">{dateLabel}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold tracking-widest text-zinc-500">{t.gate}</p>
                        <p className="text-[11px] font-semibold text-zinc-200">{pct}%</p>
                    </div>
                    <p className={`text-[10px] font-semibold ${reached ? "text-emerald-400" : "text-purple-300/80"}`}>
                        {reached ? t.arrived : interpolate(t.cruising, { pct })}
                    </p>
                </div>
            </div>

            {/* ── Talon détachable ──────────────────────────────────────── */}
            <div className="relative flex w-32 shrink-0 flex-col items-center justify-between border-l-2 border-dashed border-zinc-700/80 bg-[#0d0c16] px-3 py-3">
                {/* Encoches de perforation */}
                <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#0a0a0a] border-b border-zinc-800/80" />
                <div className="absolute -left-2 -bottom-2 h-4 w-4 rounded-full bg-[#0a0a0a] border-t border-zinc-800/80" />

                <div className="flex w-full items-center justify-between">
                    <button
                        type="button"
                        onClick={onContribute}
                        title={dict.goals.contribute}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-purple-500/25 bg-purple-500/10 text-purple-300 transition hover:bg-purple-500/25"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    <GoalActions
                        pinLabel={goal.pinned ? dict.goals.unpinAction : dict.goals.pinAction}
                        editLabel={dict.goals.editAction}
                        deleteLabel={dict.goals.deleteAction}
                        onTogglePin={onTogglePin}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>

                <div className="text-center">
                    <p className={`text-2xl font-extrabold ${reached ? "text-emerald-400" : "text-white"}`}>
                        {pct}%
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
                        {reached
                            ? t.reached
                            : interpolate(t.toGo, {
                                  amount: formatCurrency(
                                      goal.targetAmount - goal.savedAmount,
                                      locale,
                                      currency,
                                  ),
                              })}
                    </p>
                </div>

                {/* Code-barres décoratif */}
                <div
                    className="h-8 w-full rounded-sm opacity-50"
                    style={{
                        background:
                            "repeating-linear-gradient(90deg, #e4e4e7 0px, #e4e4e7 2px, transparent 2px, transparent 4px, #e4e4e7 4px, #e4e4e7 7px, transparent 7px, transparent 9px)",
                    }}
                />
            </div>
        </div>
    );
}
