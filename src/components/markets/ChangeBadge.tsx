/** Badge de variation (%) : émeraude à la hausse, rose à la baisse. */

interface ChangeBadgeProps {
    value: number | null;
    locale: string;
}

export default function ChangeBadge({ value, locale }: ChangeBadgeProps) {
    if (value === null) {
        return <span className="text-xs text-zinc-600">—</span>;
    }

    const up = value >= 0;
    const formatted = `${up ? "+" : ""}${new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)}%`;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                up
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
        >
            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                {up ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                )}
            </svg>
            {formatted}
        </span>
    );
}
