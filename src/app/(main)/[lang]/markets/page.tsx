import { getDictionary } from "@/lib/i18n/dictionaries";
import { getMarketAssets } from "@/services/marketService";
import MarketList from "@/components/markets/MarketList";

interface PageProps {
    params: Promise<{ lang: string }>;
}

const LOCALE_MAP: Record<string, string> = {
    fr: "fr-FR",
    ja: "ja-JP",
    en: "en-US",
};

export default async function MarketsPage({ params }: PageProps) {
    const { lang } = await params;
    const [dict, assets] = await Promise.all([getDictionary(lang), getMarketAssets()]);
    const locale = LOCALE_MAP[lang] ?? "en-US";
    const m = dict.markets;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">{m.title}</h1>
                <p className="text-sm text-zinc-500 mt-0.5">{m.subtitle}</p>
            </div>

            {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800/80 bg-[#0d0d11] px-6 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                        <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <p className="max-w-sm text-sm text-zinc-500">{m.loadError}</p>
                </div>
            ) : (
                <MarketList assets={assets} lang={lang} locale={locale} dict={dict} />
            )}
        </div>
    );
}
