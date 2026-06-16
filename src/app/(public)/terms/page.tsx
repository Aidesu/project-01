import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "StatEko — Conditions d'utilisation",
    description: "Conditions d'utilisation du service StatEko.",
};

const SECTIONS = [
    {
        title: "1. Objet",
        body: "Les présentes conditions encadrent l'utilisation de StatEko, application de gestion de budget personnelle permettant de saisir des budgets mensuels, de définir des objectifs d'épargne et de consulter des analyses générées à partir des données saisies. En créant un compte, vous acceptez ces conditions dans leur intégralité.",
    },
    {
        title: "2. Compte utilisateur",
        body: "La création d'un compte requiert une adresse e-mail valide et un mot de passe. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. Vous pouvez supprimer votre compte à tout moment depuis la page Compte ; cette suppression entraîne l'effacement définitif de vos données.",
    },
    {
        title: "3. Utilisation du service",
        body: "StatEko est destiné à un usage personnel et non commercial. Vous vous engagez à ne pas tenter de perturber le fonctionnement du service, d'accéder aux données d'autres utilisateurs ou d'utiliser le service à des fins illicites. Toute violation peut entraîner la suspension du compte.",
    },
    {
        title: "4. Données personnelles",
        body: "Les données saisies (budgets, objectifs, préférences) sont stockées de manière sécurisée et utilisées exclusivement pour fournir le service : affichage de vos tableaux de bord, calcul de vos analyses et personnalisation de l'interface (langue, devise). Elles ne sont ni revendues, ni partagées avec des tiers. Chaque accès aux données est vérifié côté serveur et limité à votre session authentifiée.",
    },
    {
        title: "5. Nature des informations fournies",
        body: "Les analyses, scores et insights proposés par StatEko sont fournis à titre purement informatif et pédagogique. Ils ne constituent en aucun cas un conseil financier, fiscal ou d'investissement. Pour toute décision financière importante, rapprochez-vous d'un professionnel qualifié.",
    },
    {
        title: "6. Disponibilité",
        body: "Nous nous efforçons de maintenir le service accessible en continu, sans toutefois garantir une disponibilité ininterrompue. Des interruptions ponctuelles peuvent survenir pour maintenance ou amélioration. Nous vous recommandons d'exporter régulièrement vos données (export CSV disponible dans l'onglet Analyse).",
    },
    {
        title: "7. Responsabilité",
        body: "StatEko est fourni « en l'état ». Dans les limites permises par la loi, nous déclinons toute responsabilité quant aux décisions prises sur la base des informations affichées par le service, ainsi qu'aux dommages indirects résultant de son utilisation ou de son indisponibilité.",
    },
    {
        title: "8. Modification des conditions",
        body: "Ces conditions peuvent évoluer pour refléter les changements du service ou des obligations légales. La date de dernière mise à jour figure en haut de cette page ; la poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.",
    },
];

export default function TermsPage() {
    return (
        <div className="relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[280px]"
                style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-3xl px-5 py-20">
                {/* ── En-tête ────────────────────────────────────────────── */}
                <div className="animate-fade-up">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                        Légal
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Conditions d&apos;utilisation
                    </h1>
                    <p className="mt-3 text-sm text-zinc-500">
                        Dernière mise à jour : 10 juin 2026
                    </p>
                </div>

                {/* ── Sections ───────────────────────────────────────────── */}
                <div className="animate-fade-up anim-delay-100 mt-12 space-y-10">
                    {SECTIONS.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-base font-semibold text-zinc-100">
                                {section.title}
                            </h2>
                            <p className="mt-2.5 text-[14px] leading-relaxed text-zinc-400">
                                {section.body}
                            </p>
                        </section>
                    ))}
                </div>

                {/* ── Contact ────────────────────────────────────────────── */}
                <div className="animate-fade-up anim-delay-200 mt-14 rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-5">
                    <h2 className="text-sm font-semibold text-zinc-100">Une question ?</h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                        Pour toute question relative à ces conditions ou à vos données,
                        consultez la page{" "}
                        <Link href="/about" className="text-purple-400 transition hover:text-purple-300">
                            À propos
                        </Link>{" "}
                        ou contactez-nous depuis votre espace.
                    </p>
                </div>
            </div>
        </div>
    );
}
