import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import PublicNav from "@/components/landing/PublicNav";
import PublicFooter from "@/components/landing/PublicFooter";
import { getCurrentUser } from "@/lib/dal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "StatEko — Maîtrisez votre budget",
    description:
        "Budgets mensuels, objectifs d'épargne et analyses claires dans un tableau de bord moderne. Gratuit, multilingue, multidevise.",
};

/**
 * Layout du groupe (public) : landing, à-propos, conditions.
 * Coquille distincte de l'ERP — nav publique + footer, pas de sidebar.
 * Les CTA s'adaptent à l'état de connexion (lecture seule, jamais de redirect).
 */
export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    const dashHref = `/${user?.locale ?? "en"}`;

    return (
        <html
            lang="fr"
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <body className="min-h-screen bg-[#0a0a0a] text-white">
                <PublicNav isLoggedIn={!!user} dashHref={dashHref} />
                <main className="pt-14">{children}</main>
                <PublicFooter />
            </body>
        </html>
    );
}
