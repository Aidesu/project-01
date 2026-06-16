export type AccentColor = "purple" | "emerald" | "blue" | "orange" | "rose";

const ACCENTS: Record<AccentColor, string> = {
    purple: "#a855f7",
    emerald: "#10b981",
    blue: "#3b82f6",
    orange: "#f97316",
    rose: "#f43f5e",
};

interface AnalyticsCardProps {
    title: string;
    subtitle?: string;
    accent?: AccentColor;
    /** Contenu optionnel aligné à droite du header (badge, bouton…) */
    headerRight?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

/**
 * Carte de base des composants d'analyse — même langage visuel que
 * GraphicCard1 (ligne d'accent, glow) mais sans bouton Export imposé.
 */
export default function AnalyticsCard({
    title,
    subtitle,
    accent = "purple",
    headerRight,
    className = "",
    children,
}: AnalyticsCardProps) {
    const color = ACCENTS[accent];

    return (
        <div
            className={`relative flex flex-col bg-[#0d0d11] border border-zinc-800/80 rounded-xl shadow-xl w-full overflow-hidden ${className}`}
        >
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{
                    background: `linear-gradient(90deg, ${color}99 0%, ${color}22 100%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
                style={{ background: `${color}0f` }}
            />

            <div className="relative z-10 flex items-start justify-between gap-3 px-5 pt-5 pb-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
                </div>
                {headerRight}
            </div>

            <div className="relative z-10 flex-1 px-5 pb-5">{children}</div>
        </div>
    );
}
