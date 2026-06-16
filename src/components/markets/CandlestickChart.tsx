"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { formatCompact, formatPrice } from "@/lib/format";
import type { Candle, ChartRange } from "@/services/marketService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const UP = "#10b981";
const DOWN = "#f43f5e";

interface CandlestickChartProps {
    candles: Candle[];
    range: ChartRange;
    locale: string;
    currency: string;
    dict: Dictionary;
    /** Cours de change : précision 4 décimales (tooltip et axe des prix). */
    forex?: boolean;
}

/** Format des libellés de date selon la granularité de la période. */
function dateFormats(range: ChartRange, locale: string) {
    const axis: Intl.DateTimeFormatOptions =
        range === "live"
            ? { hour: "2-digit", minute: "2-digit", second: "2-digit" }
            : range === "1d"
              ? { hour: "2-digit", minute: "2-digit" }
              : range === "5y" || range === "max"
                ? { month: "short", year: "2-digit" }
                : { day: "numeric", month: "short" };
    const tooltip: Intl.DateTimeFormatOptions =
        range === "live"
            ? { timeStyle: "medium" }
            : range === "1d"
              ? { dateStyle: "medium", timeStyle: "short" }
              : { dateStyle: "medium" };
    return {
        axis: new Intl.DateTimeFormat(locale, axis),
        tooltip: new Intl.DateTimeFormat(locale, tooltip),
    };
}

/**
 * Graphique boursier classique restylisé aux couleurs du site : chandeliers
 * (émeraude/rose) + volume en dessous, curseur en croix, zoom à la molette.
 * Le panneau de volume disparaît quand la source n'en fournit pas (repli
 * CoinGecko, mode live 5 s). L'instance ECharts persiste entre les mises à
 * jour de données — indispensable au mode live qui ajoute une bougie/5 s.
 */
export default function CandlestickChart({
    candles,
    range,
    locale,
    currency,
    dict,
    forex = false,
}: CandlestickChartProps) {
    const ref = useRef<HTMLDivElement>(null);
    const chartRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const chart = echarts.init(ref.current);
        chartRef.current = chart;
        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            chart.dispose();
            chartRef.current = null;
        };
    }, []);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || candles.length === 0) return;
        const m = dict.markets;
        const hasVolume = candles.some((c) => c.v > 0);

        const fmt = dateFormats(range, locale);
        const labels = candles.map((c) => fmt.axis.format(new Date(c.t)));
        const fmtP = (v: number) => formatPrice(v, locale, currency, forex);
        // L'axe des prix : compact pour les gros montants, précis pour le forex
        const fmtAxis = forex
            ? (v: number) =>
                  new Intl.NumberFormat(locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                  }).format(v)
            : (v: number) => formatCompact(v, locale);

        const xAxisBase = {
            type: "category" as const,
            data: labels,
            boundaryGap: true,
            axisLine: { lineStyle: { color: "#27272a" } },
            axisTick: { show: false },
        };
        const visibleAxisLabel = { color: "#52525b", fontSize: 10, hideOverlap: true };

        chart.setOption(
            {
                backgroundColor: "transparent",
                animation: false,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        lineStyle: { color: "#3f3f46", type: "dashed" },
                        crossStyle: { color: "#3f3f46" },
                        label: { backgroundColor: "#27272a", color: "#f4f4f5", fontSize: 10 },
                    },
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    textStyle: { color: "#f4f4f5", fontSize: 12 },
                    formatter: (params: { dataIndex: number }[]) => {
                        const c = candles[(Array.isArray(params) ? params[0] : params).dataIndex];
                        if (!c) return "";
                        const up = c.c >= c.o;
                        const row = (name: string, value: string, color = "#f4f4f5") =>
                            `<div style="display:flex;justify-content:space-between;gap:20px;">
                                <span style="color:#71717a;">${name}</span>
                                <span style="color:${color};font-weight:600;">${value}</span>
                            </div>`;
                        return `
                            <div style="font-weight:700;margin-bottom:6px;text-transform:capitalize;">
                                ${fmt.tooltip.format(new Date(c.t))}
                            </div>
                            ${row(m.open, fmtP(c.o))}
                            ${row(m.high, fmtP(c.h))}
                            ${row(m.low, fmtP(c.l))}
                            ${row(m.close, fmtP(c.c), up ? UP : DOWN)}
                            ${
                                hasVolume
                                    ? `<div style="border-top:1px solid #27272a;margin:6px 0;"></div>
                                       ${row(m.volume, formatCompact(c.v, locale))}`
                                    : ""
                            }
                        `;
                    },
                },
                axisPointer: { link: [{ xAxisIndex: "all" }] },
                grid: hasVolume
                    ? [
                          { left: 64, right: 12, top: 12, height: "60%" },
                          { left: 64, right: 12, top: "78%", height: "14%" },
                      ]
                    : [{ left: 64, right: 12, top: 12, bottom: 28 }],
                xAxis: hasVolume
                    ? [
                          { ...xAxisBase, gridIndex: 0, axisLabel: { show: false } },
                          { ...xAxisBase, gridIndex: 1, axisLabel: visibleAxisLabel },
                      ]
                    : [{ ...xAxisBase, gridIndex: 0, axisLabel: visibleAxisLabel }],
                yAxis: [
                    {
                        type: "value",
                        gridIndex: 0,
                        scale: true,
                        axisLabel: {
                            color: "#52525b",
                            fontSize: 10,
                            formatter: fmtAxis,
                        },
                        splitLine: { lineStyle: { color: "#18181b", type: "dashed" } },
                        axisLine: { show: false },
                    },
                    ...(hasVolume
                        ? [
                              {
                                  type: "value" as const,
                                  gridIndex: 1,
                                  scale: true,
                                  axisLabel: { show: false },
                                  splitLine: { show: false },
                                  axisLine: { show: false },
                                  axisTick: { show: false },
                              },
                          ]
                        : []),
                ],
                dataZoom: [
                    { type: "inside", xAxisIndex: hasVolume ? [0, 1] : [0], start: 0, end: 100 },
                ],
                series: [
                    {
                        type: "candlestick",
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        // Ordre ECharts : [ouverture, clôture, plus bas, plus haut]
                        data: candles.map((c) => [c.o, c.c, c.l, c.h]),
                        itemStyle: {
                            color: UP,
                            color0: DOWN,
                            borderColor: UP,
                            borderColor0: DOWN,
                        },
                    },
                    ...(hasVolume
                        ? [
                              {
                                  type: "bar" as const,
                                  xAxisIndex: 1,
                                  yAxisIndex: 1,
                                  barWidth: "55%",
                                  data: candles.map((c) => ({
                                      value: c.v,
                                      itemStyle: { color: c.c >= c.o ? `${UP}59` : `${DOWN}59` },
                                  })),
                              },
                          ]
                        : []),
                ],
            },
            { notMerge: true },
        );
    }, [candles, range, locale, currency, dict, forex]);

    return <div ref={ref} className="h-full w-full" />;
}
