/** Squelette de la vue détail d'un actif pendant le chargement du graphique. */
export default function AssetLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-3.5 w-20 rounded bg-zinc-900" />
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 rounded-full bg-zinc-900" />
                    <div className="space-y-2">
                        <div className="h-5 w-36 rounded bg-zinc-900" />
                        <div className="h-3 w-24 rounded bg-zinc-900/70" />
                    </div>
                </div>
                <div className="h-9 w-36 rounded bg-zinc-900" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[4.25rem] rounded-xl border border-zinc-800/80 bg-zinc-900/40" />
                ))}
            </div>
            <div className="h-[30rem] rounded-xl border border-zinc-800/80 bg-zinc-900/40" />
        </div>
    );
}
