import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "StatEko — À propos",
    description: "Pourquoi StatEko existe : rendre la gestion de budget claire, motivante et accessible.",
};

const VALUES = [
    {
        title: "Clarté",
        description:
            "Un chiffre bien présenté vaut mieux que dix tableaux. Chaque écran répond à une question précise : combien me reste-t-il ? Où va mon argent ? Suis-je sur la bonne voie ?",
        color: "#3b82f6",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        ),
    },
    {
        title: "Motivation",
        description:
            "Épargner est un effort de longue haleine. Nous transformons chaque objectif en expérience visuelle — billet d'embarquement, compteur, batterie — pour que la progression donne envie de continuer.",
        color: "#a855f7",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        ),
    },
    {
        title: "Confidentialité",
        description:
            "Vos finances ne regardent que vous. Sessions sécurisées, vérification des accès côté serveur à chaque requête, aucune revente de données.",
        color: "#10b981",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        ),
    },
];

export default function AboutPage() {
    return (
        <div className="relative overflow-hidden">
            {/* Halo discret */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
                style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-3xl px-5 py-20">
                {/* ── En-tête ────────────────────────────────────────────── */}
                <div className="animate-fade-up text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                        À propos
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        L&apos;argent est un outil.{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Pas une source de stress.
                        </span>
                    </h1>
                </div>

                {/* ── Mission ────────────────────────────────────────────── */}
                <div className="animate-fade-up anim-delay-100 mt-10 space-y-4 text-[15px] leading-relaxed text-zinc-400">
                    <p>
                        StatEko est né d&apos;un constat simple : la plupart des outils de
                        gestion de budget sont soit des tableurs austères, soit des
                        applications surchargées qui en font trop. Entre les deux, il
                        manquait un produit <span className="text-zinc-200">sobre, rapide et motivant</span> —
                        qui montre l&apos;essentiel et s&apos;efface ensuite.
                    </p>
                    <p>
                        Notre conviction : on ne tient pas un budget par discipline, on le
                        tient parce qu&apos;on <span className="text-zinc-200">voit où on va</span>. C&apos;est pourquoi
                        chaque fonctionnalité de StatEko — du reste à dépenser affiché en
                        grand jusqu&apos;aux objectifs en forme de carte d&apos;embarquement — est
                        pensée pour rendre la progression visible et concrète.
                    </p>
                </div>

                {/* ── Valeurs ────────────────────────────────────────────── */}
                <div className="animate-fade-up anim-delay-200 mt-14 space-y-4">
                    {VALUES.map((value) => (
                        <div
                            key={value.title}
                            className="relative flex gap-5 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-5"
                        >
                            <div
                                className="absolute top-0 left-0 bottom-0 w-[2px]"
                                style={{ background: `linear-gradient(180deg, ${value.color}99 0%, ${value.color}22 100%)` }}
                            />
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                                style={{
                                    background: `${value.color}14`,
                                    borderColor: `${value.color}33`,
                                    color: value.color,
                                }}
                            >
                                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    {value.icon}
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-100">{value.title}</h2>
                                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA ────────────────────────────────────────────────── */}
                <div className="animate-fade-up anim-delay-300 mt-14 text-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition hover:bg-purple-500"
                    >
                        Rejoindre StatEko
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
