import { formatCurrency } from "@/lib/format";

export type ColorTheme = "purple" | "emerald" | "blue" | "orange";
export type StatIcon = "income" | "fixed" | "variable" | "savings";

interface StatCardProps {
    name: string;
    amount: number;
    colorTheme?: ColorTheme;
    locale?: string;
    currency?: string;
    /** Icône représentative de la métrique (cohérence visuelle du dashboard) */
    icon?: StatIcon;
    /** % de variation vs mois précédent (ex: 12.5 ou -8.3). null = pas de donnée. */
    trend?: number | null;
    /** Légende affichée sous la tendance (ex: "vs mois précédent") */
    trendLabel?: string;
    /** true si une hausse est une bonne nouvelle (revenus, épargne) */
    trendUpIsGood?: boolean;
}

const THEMES: Record<ColorTheme, {
    accent: string;
    glow: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    hover: string;
}> = {
    emerald: {
        accent: "#10b981",
        glow: "rgba(16,185,129,0.08)",
        iconBg: "bg-emerald-500/10",
        iconBorder: "border-emerald-500/20",
        iconText: "text-emerald-400",
        hover: "hover:border-emerald-500/25",
    },
    orange: {
        accent: "#f97316",
        glow: "rgba(249,115,22,0.08)",
        iconBg: "bg-orange-500/10",
        iconBorder: "border-orange-500/20",
        iconText: "text-orange-400",
        hover: "hover:border-orange-500/25",
    },
    blue: {
        accent: "#3b82f6",
        glow: "rgba(59,130,246,0.08)",
        iconBg: "bg-blue-500/10",
        iconBorder: "border-blue-500/20",
        iconText: "text-blue-400",
        hover: "hover:border-blue-500/25",
    },
    purple: {
        accent: "#a855f7",
        glow: "rgba(168,85,247,0.08)",
        iconBg: "bg-purple-500/10",
        iconBorder: "border-purple-500/20",
        iconText: "text-purple-400",
        hover: "hover:border-purple-500/25",
    },
};

/** Pictogrammes heroicons (outline) par métrique. */
const ICONS: Record<StatIcon, React.ReactNode> = {
    income: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    ),
    fixed: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    ),
    variable: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    ),
    savings: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    ),
};

export default function StatCard({
    name,
    amount,
    colorTheme = "purple",
    locale = "en-US",
    currency = "USD",
    icon = "income",
    trend,
    trendLabel,
    trendUpIsGood = true,
}: StatCardProps) {
    const t = THEMES[colorTheme];

    const trendUp = trend !== null && trend !== undefined && trend >= 0;
    const trendAbs = trend !== null && trend !== undefined ? Math.abs(trend) : null;
    const trendGood = trendUp === trendUpIsGood;

    return (
        <div
            className={`relative w-full flex flex-col bg-[#0d0d11] border border-zinc-800/80 rounded-xl shadow-xl overflow-hidden transition-colors duration-200 ${t.hover}`}
        >
            {/* Ligne d'accent couleur en haut */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{
                    background: `linear-gradient(90deg, ${t.accent}99 0%, ${t.accent}22 100%)`,
                }}
            />

            {/* Glow de fond en haut à droite */}
            <div
                className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl"
                style={{ background: t.glow }}
            />

            <div className="relative z-10 p-5">
                {/* Icône + nom */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className={`flex items-center justify-center w-9 h-9 rounded-lg ${t.iconBg} border ${t.iconBorder}`}
                    >
                        <svg
                            className={`w-4 h-4 ${t.iconText}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                        >
                            {ICONS[icon]}
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-zinc-400 tracking-wide uppercase leading-tight">
                        {name}
                    </p>
                </div>

                {/* Montant + tendance */}
                <div className="flex items-end justify-between gap-2">
                    <p className="text-2xl font-extrabold text-white tracking-tight leading-none">
                        {formatCurrency(amount, locale, currency)}
                    </p>

                    {trendAbs !== null && (
                        <span className="flex flex-col items-end mb-0.5">
                            <span
                                className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                                    trendGood ? "text-emerald-400" : "text-rose-400"
                                }`}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    {trendUp ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                                    )}
                                </svg>
                                {trendAbs.toFixed(1)}%
                            </span>
                            {trendLabel && (
                                <span className="text-[10px] text-zinc-600 font-medium">
                                    {trendLabel}
                                </span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
