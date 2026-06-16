import Link from "next/link";

interface LogoProps {
    lang?: string;
    /** Destination personnalisée (ex: "/" sur les pages publiques) */
    href?: string;
    /** Affiche uniquement le pictogramme (usage futur : sidebar repliée) */
    compact?: boolean;
}

/**
 * Logo StatEko : tuile violette unie portant une courbe de progression qui
 * monte vers un point — l'objectif. Marque plate, sans dégradé ni reflet.
 * Décliné dans `src/app/icon.svg` (favicon) ; garder les deux synchronisés.
 */
export default function Logo({ lang, href, compact = false }: LogoProps) {
    return (
        <Link
            href={href ?? `/${lang ?? "en"}`}
            className="group flex items-center gap-2.5 select-none"
            aria-label="StatEko"
        >
            {/* Pictogramme */}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 ring-1 ring-inset ring-white/15 transition-colors group-hover:bg-purple-500">
                <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M5 16.5L9.6 11l3.6 3.2L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="19" cy="7.5" r="2" fill="currentColor" />
                </svg>
            </span>

            {/* Wordmark */}
            {!compact && (
                <span className="text-[17px] font-semibold tracking-tight text-white leading-none">
                    Stat<span className="text-purple-400">Eko</span>
                </span>
            )}
        </Link>
    );
}
