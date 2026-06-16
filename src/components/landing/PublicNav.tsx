import Link from "next/link";
import Logo from "@/components/layouts/Logo";

interface PublicNavProps {
    isLoggedIn: boolean;
    /** Destination du tableau de bord (locale de l'utilisateur) */
    dashHref: string;
}

/**
 * Navigation des pages publiques : logo, liens, et CTA adaptés à l'état de
 * connexion (Dashboard si connecté, sinon Connexion / Inscription).
 */
export default function PublicNav({ isLoggedIn, dashHref }: PublicNavProps) {
    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-900/80 bg-[#0a0a0a]/75 backdrop-blur-md">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
                <div className="flex items-center gap-8">
                    <Logo href="/" />

                    <div className="hidden items-center gap-6 sm:flex">
                        <Link
                            href="/#features"
                            className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="/about"
                            className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            À propos
                        </Link>
                        <Link
                            href="/terms"
                            className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            Conditions
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <Link
                            href={dashHref}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-500"
                        >
                            Tableau de bord
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-300 transition hover:text-white"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-purple-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-500"
                            >
                                S&apos;inscrire
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
