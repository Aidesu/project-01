/** Squelette de la page marchés pendant le chargement des cours. */
export default function MarketsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-7 w-40 rounded-md bg-zinc-900" />
                <div className="h-4 w-72 rounded-md bg-zinc-900/70" />
            </div>
            <div className="flex items-center justify-between gap-3">
                <div className="h-9 w-full max-w-xs rounded-lg bg-zinc-900" />
                <div className="flex gap-1.5">
                    <div className="h-8 w-20 rounded-lg bg-zinc-900" />
                    <div className="h-8 w-20 rounded-lg bg-zinc-900" />
                    <div className="h-8 w-20 rounded-lg bg-zinc-900" />
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11]">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-zinc-900 px-4 py-3.5 last:border-b-0">
                        <div className="h-9 w-9 rounded-full bg-zinc-900" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 w-32 rounded bg-zinc-900" />
                            <div className="h-2.5 w-16 rounded bg-zinc-900/70" />
                        </div>
                        <div className="h-3.5 w-20 rounded bg-zinc-900" />
                    </div>
                ))}
            </div>
        </div>
    );
}
