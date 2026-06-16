/**
 * Pastille d'un actif : logo distant pour les cryptos (CoinGecko),
 * monogramme coloré déterministe pour les actions (pas de logos libres).
 */

const PALETTE = ["#a855f7", "#3b82f6", "#10b981", "#f97316", "#06b6d4", "#f59e0b", "#f43f5e"];

function colorFor(symbol: string): string {
    const hash = [...symbol].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return PALETTE[hash % PALETTE.length];
}

interface AssetIconProps {
    symbol: string;
    image: string | null;
    size?: "md" | "lg";
    /** Texte du monogramme (défaut : 2 premières lettres du symbole). */
    label?: string;
}

export default function AssetIcon({ symbol, image, size = "md", label }: AssetIconProps) {
    const dim = size === "lg" ? "h-11 w-11" : "h-9 w-9";

    if (image) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={image}
                alt=""
                className={`${dim} shrink-0 rounded-full bg-zinc-900 object-contain`}
                loading="lazy"
            />
        );
    }

    const color = colorFor(symbol);
    return (
        <span
            className={`${dim} flex shrink-0 items-center justify-center rounded-full font-bold ${size === "lg" ? "text-sm" : "text-[11px]"}`}
            style={{ background: `${color}1f`, border: `1px solid ${color}40`, color }}
        >
            {label ?? symbol.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
        </span>
    );
}
