import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "StatEco — Connexion",
    description: "Application bancaire",
};

/**
 * Root layout du groupe (auth) : coquille minimale, centrée, SANS Header ni Sidebar.
 * Volontairement distincte du layout dashboard pour que les pages de connexion
 * n'héritent jamais de l'interface applicative.
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="fr"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full bg-black text-white">
                <main className="flex min-h-screen items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-xl">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
