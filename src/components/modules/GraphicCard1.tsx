interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function ChartCard({
    title,
    subtitle,
    children,
}: ChartCardProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl w-full">
            {/* Header de la carte */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-gray-400">{subtitle}</p>
                    )}
                </div>
                {/* Petit badge ou bouton pour faire "détaillé" */}
                <button className="text-xs font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-sm border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                    Export
                </button>
            </div>

            {/* Conteneur du graphique */}
            <div className="relative w-full h-[400px]">{children}</div>
        </div>
    );
}
