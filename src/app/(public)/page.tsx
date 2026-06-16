import Link from "next/link";
import DashboardPreview from "@/components/landing/DashboardPreview";
import { getCurrentUser } from "@/lib/dal";

const FEATURES = [
    {
        title: "Budgets mensuels",
        description:
            "Saisissez revenus, dépenses fixes, variables et épargne en quelques minutes. Le mois suivant se pré-remplit tout seul.",
        color: "#f97316",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        ),
    },
    {
        title: "Objectifs qui motivent",
        description:
            "Un voyage devient une carte d'embarquement, une voiture un compteur de vitesse. Épinglez vos favoris sur le tableau de bord.",
        color: "#a855f7",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        ),
    },
    {
        title: "Analyse & insights",
        description:
            "Score de santé budgétaire, règle 50/30/20, taux d'épargne et points clés générés automatiquement à partir de vos données.",
        color: "#3b82f6",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        ),
    },
    {
        title: "Reste à dépenser, en un coup d'œil",
        description:
            "Le tableau de bord répond à la seule question qui compte : combien me reste-t-il ce mois-ci ? Le reste suit naturellement.",
        color: "#10b981",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        ),
    },
    {
        title: "Multilingue & multidevise",
        description:
            "Français, anglais, japonais — et vos montants dans votre devise. L'interface s'adapte à vous, pas l'inverse.",
        color: "#06b6d4",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        ),
    },
    {
        title: "Vos données protégées",
        description:
            "Sessions sécurisées, accès vérifiés côté serveur à chaque requête. Vos finances ne regardent que vous.",
        color: "#f59e0b",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        ),
    },
];

export default async function LandingPage() {
    const user = await getCurrentUser();
    const isLoggedIn = !!user;
    const dashHref = `/${user?.locale ?? "en"}`;

    return (
        <>
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Grille de fond masquée en radial */}
                <div
                    className="bg-grid pointer-events-none absolute inset-0"
                    style={{
                        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
                    }}
                />
                {/* Halo violet supérieur */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
                    style={{
                        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)",
                    }}
                />

                <div className="relative mx-auto max-w-6xl px-5 pt-24 pb-20 text-center sm:pt-32">
                    {/* Badge */}
                    <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                        Gestion de budget personnelle
                    </div>

                    {/* Titre */}
                    <h1 className="animate-fade-up anim-delay-100 mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
                        Maîtrisez votre budget,{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                            atteignez vos objectifs
                        </span>
                        .
                    </h1>

                    {/* Sous-titre */}
                    <p className="animate-fade-up anim-delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                        StatEko réunit budgets mensuels, objectifs d&apos;épargne et analyses
                        dans un tableau de bord clair. Sobre, rapide, et pensé pour que
                        chaque euro trouve sa place.
                    </p>

                    {/* CTA */}
                    <div className="animate-fade-up anim-delay-300 mt-9 flex flex-wrap items-center justify-center gap-3">
                        {isLoggedIn ? (
                            <Link
                                href={dashHref}
                                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition hover:bg-purple-500"
                            >
                                Accéder au tableau de bord
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition hover:bg-purple-500"
                                >
                                    Commencer gratuitement
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/login"
                                    className="rounded-lg border border-zinc-800 bg-[#0d0d11] px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500/40 hover:text-white"
                                >
                                    Se connecter
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Aperçu du produit */}
                    <div className="animate-fade-up anim-delay-400 mt-16">
                        <DashboardPreview />
                    </div>
                </div>
            </section>

            {/* ── Fonctionnalités ────────────────────────────────────────── */}
            <section id="features" className="relative border-t border-zinc-900">
                <div className="mx-auto max-w-6xl px-5 py-20">
                    <div className="mb-12 max-w-xl">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Tout ce qu&apos;il faut.{" "}
                            <span className="text-zinc-500">Rien de superflu.</span>
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                            Chaque écran répond à une question précise sur votre argent —
                            sans tableur, sans friction, sans bruit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d11] p-5 transition-colors duration-200 hover:border-zinc-700"
                            >
                                <div
                                    className="absolute top-0 left-0 right-0 h-[2px]"
                                    style={{ background: `linear-gradient(90deg, ${feature.color}99 0%, ${feature.color}22 100%)` }}
                                />
                                <div
                                    className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{ background: `${feature.color}14` }}
                                />
                                <div
                                    className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border"
                                    style={{
                                        background: `${feature.color}14`,
                                        borderColor: `${feature.color}33`,
                                        color: feature.color,
                                    }}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-100">{feature.title}</h3>
                                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA final ──────────────────────────────────────────────── */}
            <section className="border-t border-zinc-900">
                <div className="mx-auto max-w-6xl px-5 py-20">
                    <div
                        className="relative overflow-hidden rounded-2xl border border-purple-500/20 px-6 py-14 text-center"
                        style={{
                            background:
                                "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(124,58,237,0.16) 0%, rgba(13,13,17,1) 70%)",
                        }}
                    >
                        <h2 className="mx-auto max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
                            Votre prochain objectif commence par un premier budget.
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
                            Création de compte en moins d&apos;une minute. Gratuit.
                        </p>
                        <div className="mt-8">
                            <Link
                                href={isLoggedIn ? dashHref : "/register"}
                                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition hover:bg-purple-500"
                            >
                                {isLoggedIn ? "Ouvrir mon tableau de bord" : "Créer mon compte"}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
