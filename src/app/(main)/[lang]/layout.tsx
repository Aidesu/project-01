// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary } from "@/lib/i18n/dictionaries";
import AuthProvider from "@/components/providers/AuthProvider";
import AppLayout from "@/components/layouts/AppLayout";
import "../../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "StatEco",
    description: "Application bancaire",
};

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <html
            lang={lang}
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body
                key={lang}
                className="min-h-full flex flex-col bg-black text-white"
            >
                <AuthProvider>
                    <AppLayout lang={lang} dict={dict}>
                        {children}
                    </AppLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
