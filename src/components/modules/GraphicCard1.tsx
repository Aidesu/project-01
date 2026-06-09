interface GraphicCard1Props {
    title: string;
    subtitle?: string;
    exportLabel?: string;
    children: React.ReactNode;
}

export default function GraphicCard1({
    title,
    subtitle,
    exportLabel = "Export",
    children,
}: GraphicCard1Props) {
    return (
        <div className="relative flex flex-col bg-[#0d0d11] border border-zinc-800/80 rounded-xl shadow-xl w-full overflow-hidden">
            {/* Ligne d'accent violet en haut */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{
                    background:
                        "linear-gradient(90deg, #7c3aed99 0%, #a855f722 100%)",
                }}
            />

            {/* Glow ambiant */}
            <div
                className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
                style={{ background: "rgba(124,58,237,0.06)" }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between px-5 pt-5 pb-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs text-zinc-500">{subtitle}</p>
                    )}
                </div>

                <button className="flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-1 text-[11px] font-semibold text-purple-400 transition-colors hover:bg-purple-500/15 hover:border-purple-500/35">
                    <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>
                    {exportLabel}
                </button>
            </div>

            {/* Zone graphique */}
            <div className="relative z-10 w-full flex-1 px-3 pb-4">
                {children}
            </div>
        </div>
    );
}
