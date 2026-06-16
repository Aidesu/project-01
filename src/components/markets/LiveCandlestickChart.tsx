"use client";

import { useEffect, useState } from "react";
import CandlestickChart from "./CandlestickChart";
import type { Candle } from "@/services/marketService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Une bougie toutes les 5 s, fenêtre glissante de 15 min. */
const TICK_MS = 5_000;
const MAX_CANDLES = 180;

interface LiveCandlestickChartProps {
    assetId: string;
    locale: string;
    currency: string;
    dict: Dictionary;
    forex?: boolean;
}

/**
 * Mode live : interroge `/api/markets/price` toutes les 5 s et construit les
 * bougies en mémoire — ouverture = clôture précédente, clôture = prix reçu.
 * Aucune API publique ne fournit d'historique à cette granularité : la série
 * démarre à l'ouverture de la page.
 */
export default function LiveCandlestickChart({
    assetId,
    locale,
    currency,
    dict,
    forex = false,
}: LiveCandlestickChartProps) {
    const [candles, setCandles] = useState<Candle[]>([]);

    useEffect(() => {
        let cancelled = false;

        const tick = async () => {
            try {
                const res = await fetch(
                    `/api/markets/price?id=${encodeURIComponent(assetId)}`,
                    { cache: "no-store" },
                );
                if (!res.ok || cancelled) return;
                const { price, t } = (await res.json()) as { price: number; t: number };
                setCandles((prev) => {
                    const o = prev.length > 0 ? prev[prev.length - 1].c : price;
                    const candle: Candle = {
                        t,
                        o,
                        h: Math.max(o, price),
                        l: Math.min(o, price),
                        c: price,
                        v: 0,
                    };
                    return [...prev, candle].slice(-MAX_CANDLES);
                });
            } catch {
                // Tick suivant dans 5 s — inutile de signaler un raté isolé
            }
        };

        tick();
        const interval = setInterval(tick, TICK_MS);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [assetId]);

    if (candles.length < 2) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="flex items-center gap-2 text-sm text-zinc-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {dict.markets.liveWaiting}
                </p>
            </div>
        );
    }

    return (
        <CandlestickChart
            candles={candles}
            range="live"
            locale={locale}
            currency={currency}
            dict={dict}
            forex={forex}
        />
    );
}
