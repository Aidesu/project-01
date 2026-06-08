interface StatCardProps {
    name: string;
    amount: number;
}

export default function StatCard({ name, amount }: StatCardProps) {
    // Formatage propre du nombre (ajoute les virgules pour les milliers et force 2 décimales)
    const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return (
        <div className="w-full flex flex-col p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
            {/* Titre de la stat : discret pour laisser la place au chiffre */}
            <h3 className="text-sm font-medium text-gray-400 mb-3 tracking-wide">
                {name}
            </h3>

            {/* Montant : mis en valeur */}
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-purple-500">$</span>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                    {formattedAmount}
                </p>
            </div>
        </div>
    );
}
