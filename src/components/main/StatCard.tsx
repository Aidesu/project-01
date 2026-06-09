export type ColorTheme = "purple" | "emerald" | "blue" | "orange";

interface StatCardProps {
    name: string;
    amount: number;
    colorTheme?: ColorTheme;
    locale?: string;
    /** % de variation vs mois précédent (ex: 12.5 ou -8.3). null = pas de donnée. */
    trend?: number | null;
}

const THEMES: Record<ColorTheme, {
    accent: string;
    glow: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    hover: string;
    line: string;
}> = {
    emerald: {
        accent: "#10b981",
        glow: "rgba(16,185,129,0.08)",
        iconBg: "bg-emerald-500/10",
        iconBorder: "border-emerald-500/20",
        iconText: "text-emerald-400",
        hover: "hover:border-emerald-500/25",
        line: "#10b981",
    },
    orange: {
        accent: "#f97316",
        glow: "rgba(249,115,22,0.08)",
        iconBg: "bg-orange-500/10",
        iconBorder: "border-orange-500/20",
        iconText: "text-orange-400",
        hover: "hover:border-orange-500/25",
        line: "#f97316",
    },
    blue: {
        accent: "#3b82f6",
        glow: "rgba(59,130,246,0.08)",
        iconBg: "bg-blue-500/10",
        iconBorder: "border-blue-500/20",
        iconText: "text-blue-400",
        hover: "hover:border-blue-500/25",
        line: "#3b82f6",
    },
    purple: {
        accent: "#a855f7",
        glow: "rgba(168,85,247,0.08)",
        iconBg: "bg-purple-500/10",
        iconBorder: "border-purple-500/20",
        iconText: "text-purple-400",
        hover: "hover:border-purple-500/25",
        line: "#a855f7",
    },
};

export default function StatCard({
    name,
    amount,
    colorTheme = "purple",
    locale = "en-US",
    trend,
}: StatCardProps) {
    const t = THEMES[colorTheme];

    const formattedAmount = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    const trendUp = trend !== null && trend !== undefined && trend >= 0;
    const trendAbs = trend !== null && trend !== undefined ? Math.abs(trend) : null;

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
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"
                            />
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-zinc-400 tracking-wide uppercase leading-tight">
                        {name}
                    </p>
                </div>

                {/* Montant + tendance */}
                <div className="flex items-end justify-between gap-2">
                    <p className="text-3xl font-extrabold text-white tracking-tight leading-none">
                        {formattedAmount}
                        <span className={`ml-1 text-base font-semibold ${t.iconText}`}>
                            $
                        </span>
                    </p>

                    {trendAbs !== null && (
                        <span
                            className={`flex items-center gap-0.5 text-[11px] font-semibold mb-0.5 ${
                                trendUp ? "text-emerald-400" : "text-rose-400"
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
                    )}
                </div>
            </div>
        </div>
    );
}
