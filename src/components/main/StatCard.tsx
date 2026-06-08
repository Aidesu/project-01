interface StatCardProps {
    name: string;
    amount: number;
    // Ajout d'un thème de couleur : 'purple', 'emerald', 'blue', ou 'orange'
    colorTheme?: "purple" | "emerald" | "blue" | "orange";
}

export default function StatCard({
    name,
    amount,
    colorTheme = "purple",
}: StatCardProps) {
    const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    // Dictionnaire des couleurs (Tailwind ne supporte pas la concaténation dynamique des classes)
    const themes = {
        purple: {
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            text: "text-purple-400",
            glow: "bg-purple-600/15",
        },
        emerald: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            glow: "bg-emerald-600/15",
        },
        blue: {
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            text: "text-blue-400",
            glow: "bg-blue-600/15",
        },
        orange: {
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            text: "text-orange-400",
            glow: "bg-orange-600/15",
        },
    };

    const style = themes[colorTheme];

    return (
        <div className="relative w-full flex flex-col px-5 py-4 rounded-2xl border border-gray-800/80 bg-gradient-to-br from-gray-900 to-[#130b1c] shadow-lg overflow-hidden">
            {/* Lueur personnalisée selon le thème */}
            <div
                className={`absolute -top-8 -right-8 w-32 h-32 ${style.glow} rounded-full blur-3xl pointer-events-none`}
            ></div>

            <div className="flex items-center gap-3 mb-4 z-10">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${style.bg} border ${style.border} ${style.text}`}
                >
                    <span className="w-10 h-10 flex justify-center items-center text-lg font-bold">
                        $
                    </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">
                    {name}
                </h3>
            </div>

            <div className="flex items-baseline z-10">
                <p className="text-3xl font-extrabold text-white tracking-tight">
                    {formattedAmount}
                </p>
            </div>
        </div>
    );
}
