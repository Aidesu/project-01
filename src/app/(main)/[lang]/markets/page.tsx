import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function MarketsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">{dict.sideBar.markets}</h1>
            <p className="text-sm text-zinc-500">{dict.comingSoon}</p>
        </div>
    );
}
