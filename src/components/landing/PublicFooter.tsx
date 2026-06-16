import Link from "next/link";
import Logo from "@/components/layouts/Logo";

/** Pied de page des pages publiques : sobre, liens essentiels. */
export default function PublicFooter() {
    return (
        <footer className="border-t border-zinc-900">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row">
                <div className="flex flex-col items-center gap-3 sm:items-start">
                    <Logo href="/" />
                    <p className="text-xs text-zinc-600">
                        © {new Date().getFullYear()} StatEko. Tous droits réservés.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/about" className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200">
                        À propos
                    </Link>
                    <Link href="/terms" className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200">
                        Conditions d&apos;utilisation
                    </Link>
                    <Link href="/login" className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200">
                        Connexion
                    </Link>
                </div>
            </div>
        </footer>
    );
}
