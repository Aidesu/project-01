/**
 * Aperçu stylisé du dashboard (100 % CSS/SVG, aucun JS) : cadre navigateur,
 * mini sidebar, carte héro « reste à dépenser », cartes KPI et graphique
 * barres empilées + ligne de revenus. Reflète fidèlement le vrai tableau
 * de bord : mêmes KPI, mêmes couleurs, même lecture (écart barre/ligne =
 * reste à vivre). Données factices mais cohérentes entre elles.
 */

// Mois courant : 4 250 − 1 980 − 890 − 850 = 530 € restants
const KPIS = [
    { label: "Revenus", value: "4 250 €", color: "#10b981", width: "w-12" },
    { label: "Fixes", value: "1 980 €", color: "#f97316", width: "w-12" },
    { label: "Variables", value: "890 €", color: "#3b82f6", width: "w-10" },
    { label: "Épargne", value: "850 €", color: "#a855f7", width: "w-10" },
];

// Répartition du revenu dans la barre du héro (mêmes montants, en %)
const HERO_SEGMENTS = [
    { color: "#f97316", width: "46.6%" }, // fixes
    { color: "#3b82f6", width: "20.9%" }, // variables
    { color: "#a855f7", width: "20%" },   // épargne
    { color: "#10b981", width: "12.5%" }, // restant
];

// Hauteurs (% du graphique) : [fixes, variables, épargne, revenus].
// Les revenus passent toujours au-dessus de la pile — l'écart se lit
// comme le reste à vivre, exactement comme sur le vrai graphique.
const MONTHS: { label: string; bars: [number, number, number]; income: number }[] = [
    { label: "Jan", bars: [33, 15, 12], income: 72 },
    { label: "Fév", bars: [33, 19, 12], income: 74 },
    { label: "Mar", bars: [31, 13, 13], income: 68 },
    { label: "Avr", bars: [33, 17, 15], income: 76 },
    { label: "Mai", bars: [31, 21, 13], income: 78 },
    { label: "Juin", bars: [33, 15, 17], income: 82 },
];

// Points de la ligne de revenus, en coordonnées % du graphique
const LINE_POINTS = MONTHS.map(({ income }, i) => ({
    x: ((i + 0.5) / MONTHS.length) * 100,
    y: 100 - income,
}));

const LEGEND = [
    ["#10b981", "Revenus"],
    ["#f97316", "Fixes"],
    ["#3b82f6", "Variables"],
    ["#a855f7", "Épargne"],
];

export default function DashboardPreview() {
    return (
        <div className="relative mx-auto w-full max-w-3xl">
            {/* Halo violet derrière la fenêtre */}
            <div
                className="pointer-events-none absolute -inset-10 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 65%)",
                }}
            />

            {/* Fenêtre navigateur */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d11] shadow-2xl shadow-black/60">
                {/* Barre du navigateur */}
                <div className="flex items-center gap-3 border-b border-zinc-800/80 bg-[#0a0a0a] px-4 py-2.5">
                    <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <div className="mx-auto flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1 text-[10px] text-zinc-500">
                        <svg className="h-2.5 w-2.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                        stateko.app
                    </div>
                </div>

                <div className="flex">
                    {/* Mini sidebar */}
                    <div className="hidden w-32 shrink-0 flex-col gap-4 border-r border-zinc-900 bg-[#0a0a0a] p-3 sm:flex">
                        <div className="flex items-center gap-1.5 px-1">
                            <span className="flex h-4 w-4 items-center justify-center rounded bg-purple-600">
                                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 16.5L9.6 11l3.6 3.2L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="19" cy="7.5" r="2" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="text-[9px] font-bold text-white">
                                Stat<span className="text-purple-400">Eko</span>
                            </span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-1.5 text-[8px] font-medium text-purple-300">
                                Tableau de bord
                            </div>
                            {["Budget", "Objectifs", "Analyse"].map((item) => (
                                <div key={item} className="px-2 py-1.5 text-[8px] font-medium text-zinc-600">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 space-y-3 p-4">
                        {/* Carte héro « reste à dépenser » */}
                        <div className="relative overflow-hidden rounded-lg border border-purple-500/25 bg-[#120d1d] p-3">
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)",
                                }}
                            />
                            <div className="relative flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[7px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Reste à dépenser
                                        <span className="ml-1.5 font-medium normal-case tracking-normal text-zinc-600">
                                            Juin 2026
                                        </span>
                                    </p>
                                    <p className="mt-1 text-base font-extrabold leading-none tracking-tight text-white">
                                        530 €
                                    </p>
                                </div>
                                <span className="shrink-0 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-400">
                                    ↗ 4,2 % vs mois dernier
                                </span>
                            </div>
                            <div className="relative mt-2.5 flex h-1 w-full overflow-hidden rounded-full bg-zinc-800/80">
                                {HERO_SEGMENTS.map(({ color, width }) => (
                                    <div key={color} className="h-full" style={{ width, background: color }} />
                                ))}
                            </div>
                        </div>

                        {/* Cartes KPI */}
                        <div className="grid grid-cols-4 gap-2">
                            {KPIS.map((kpi) => (
                                <div
                                    key={kpi.label}
                                    className="relative overflow-hidden rounded-lg border border-zinc-800/80 bg-[#101015] p-2"
                                >
                                    <div
                                        className="absolute top-0 left-0 right-0 h-[1.5px]"
                                        style={{ background: `linear-gradient(90deg, ${kpi.color}99, transparent)` }}
                                    />
                                    <p className="text-[7px] font-semibold uppercase tracking-wide text-zinc-600">
                                        {kpi.label}
                                    </p>
                                    <p className="mt-1 text-[11px] font-extrabold text-white">{kpi.value}</p>
                                    <div className={`mt-1.5 h-0.5 ${kpi.width} rounded-full`} style={{ background: kpi.color }} />
                                </div>
                            ))}
                        </div>

                        {/* Graphique : barres empilées + ligne de revenus */}
                        <div className="relative overflow-hidden rounded-lg border border-zinc-800/80 bg-[#101015] p-3">
                            <div
                                className="absolute top-0 left-0 right-0 h-[1.5px]"
                                style={{ background: "linear-gradient(90deg, #a855f799, transparent)" }}
                            />
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-[8px] font-semibold text-zinc-300">Vue mensuelle</p>
                                <div className="flex gap-2">
                                    {LEGEND.map(([c, l]) => (
                                        <span key={l} className="flex items-center gap-1 text-[7px] text-zinc-600">
                                            <span className="h-1 w-1 rounded-full" style={{ background: c }} />
                                            {l}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-24">
                                {/* Barres empilées */}
                                <div className="flex h-full items-end justify-between gap-3 sm:gap-4">
                                    {MONTHS.map(({ label, bars: [fixed, variable, savings] }, i) => (
                                        <div
                                            key={label}
                                            className="animate-grow-bar flex h-full w-full flex-col-reverse"
                                            style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                                        >
                                            <div style={{ height: `${fixed}%`, background: "#f97316cc" }} />
                                            <div style={{ height: `${variable}%`, background: "#3b82f6cc" }} />
                                            <div className="rounded-t-sm" style={{ height: `${savings}%`, background: "#a855f7cc" }} />
                                        </div>
                                    ))}
                                </div>

                                {/* Ligne de revenus au-dessus de la pile, après la pousse des barres */}
                                <div
                                    className="animate-fade-up pointer-events-none absolute inset-0"
                                    style={{ animationDelay: "1.15s" }}
                                >
                                    <svg
                                        className="absolute inset-0 h-full w-full"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <polyline
                                            points={LINE_POINTS.map(({ x, y }) => `${x},${y}`).join(" ")}
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                    {LINE_POINTS.map(({ x, y }) => (
                                        <span
                                            key={x}
                                            className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#101015] bg-emerald-500"
                                            style={{ left: `${x}%`, top: `${y}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Libellés des mois */}
                            <div className="mt-1.5 flex justify-between gap-3 sm:gap-4">
                                {MONTHS.map(({ label }) => (
                                    <span key={label} className="w-full text-center text-[7px] text-zinc-600">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
