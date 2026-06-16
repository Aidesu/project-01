"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import GraphicCard1 from "@/components/modules/GraphicCard1";
import { formatCurrency } from "@/lib/format";
import type { DistributionPoint } from "@/services/budgetService";
import type { MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface DashboardChartsProps {
    months: MonthlyPoint[];
    distribution: DistributionPoint[];
    lang: string;
    locale: string;
    currency: string;
    dict: Dictionary;
}

/**
 * Vue mensuelle : dépenses empilées (fixes / variables / épargne) avec la
 * ligne de revenus par-dessus — l'écart entre le sommet des barres et la
 * ligne se lit directement comme le reste à vivre du mois.
 */
function EvolutionChart({
    months,
    lang,
    locale,
    currency,
    dict,
}: Pick<DashboardChartsProps, "months" | "lang" | "locale" | "currency" | "dict">) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || months.length === 0) return;
        const chart = echarts.init(ref.current);

        const labels = months.map(({ month, year }) =>
            new Intl.DateTimeFormat(lang, { month: "short" }).format(
                new Date(year, month - 1, 1),
            ),
        );

        const names = {
            income: dict.dashboard?.income ?? "Income",
            fixed: dict.dashboard?.fixed ?? "Fixed",
            variable: dict.dashboard?.variable ?? "Variable",
            savings: dict.dashboard?.savings ?? "Savings",
            remaining: dict.remaining ?? "Remaining",
        };

        const fmt = (v: number) => formatCurrency(v, locale, currency);

        chart.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                textStyle: { color: "#f4f4f5", fontSize: 12 },
                axisPointer: { type: "shadow" },
                // Tooltip enrichi : toutes les composantes + reste à vivre calculé
                formatter: (params: { dataIndex: number }[]) => {
                    const m = months[params[0].dataIndex];
                    if (!m) return "";
                    const row = (color: string, name: string, value: number, bold = false) =>
                        `<div style="display:flex;justify-content:space-between;gap:16px;${bold ? "font-weight:700;" : ""}">
                            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;"></span>${name}</span>
                            <span>${fmt(value)}</span>
                        </div>`;
                    return `
                        <div style="font-weight:700;margin-bottom:6px;text-transform:capitalize;">
                            ${new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(new Date(m.year, m.month - 1, 1))}
                        </div>
                        ${row("#10b981", names.income, m.income)}
                        ${row("#f97316", names.fixed, m.fixed)}
                        ${row("#3b82f6", names.variable, m.variable)}
                        ${row("#a855f7", names.savings, m.savings)}
                        <div style="border-top:1px solid #27272a;margin:6px 0;"></div>
                        ${row(m.remaining >= 0 ? "#34d399" : "#f43f5e", names.remaining, m.remaining, true)}
                    `;
                },
            },
            legend: {
                data: [names.income, names.fixed, names.variable, names.savings],
                textStyle: { color: "#71717a", fontSize: 11 },
                top: 0,
                icon: "circle",
                itemWidth: 8,
                itemHeight: 8,
            },
            grid: { left: 0, right: 8, top: 32, bottom: 0, containLabel: true },
            xAxis: {
                type: "category",
                data: labels,
                axisLabel: { color: "#52525b", fontSize: 11 },
                axisLine: { lineStyle: { color: "#27272a" } },
                axisTick: { show: false },
            },
            yAxis: {
                type: "value",
                axisLabel: { color: "#52525b", fontSize: 11 },
                splitLine: { lineStyle: { color: "#18181b", type: "dashed" } },
                axisLine: { show: false },
            },
            series: [
                {
                    name: names.fixed,
                    type: "bar",
                    stack: "alloc",
                    barMaxWidth: 44,
                    barCategoryGap: "28%",
                    data: months.map((m) => m.fixed),
                    itemStyle: { color: "#f97316" },
                    emphasis: { focus: "series" },
                },
                {
                    name: names.variable,
                    type: "bar",
                    stack: "alloc",
                    barMaxWidth: 44,
                    barCategoryGap: "28%",
                    data: months.map((m) => m.variable),
                    itemStyle: { color: "#3b82f6" },
                    emphasis: { focus: "series" },
                },
                {
                    name: names.savings,
                    type: "bar",
                    stack: "alloc",
                    barMaxWidth: 44,
                    barCategoryGap: "28%",
                    data: months.map((m) => m.savings),
                    itemStyle: { color: "#a855f7", borderRadius: [3, 3, 0, 0] },
                    emphasis: { focus: "series" },
                },
                {
                    name: names.income,
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 7,
                    z: 10,
                    data: months.map((m) => m.income),
                    lineStyle: { width: 2.5, color: "#10b981" },
                    itemStyle: {
                        color: "#10b981",
                        borderColor: "#0d0d11",
                        borderWidth: 2,
                    },
                    emphasis: { focus: "series" },
                },
            ],
        });

        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    }, [months, lang, locale, currency, dict]);

    if (months.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-zinc-600">{dict.dashboard?.noDataYet ?? "No data"}</p>
            </div>
        );
    }

    return <div ref={ref} className="w-full h-full" />;
}

function DistributionChart({ distribution, dict }: Pick<DashboardChartsProps, "distribution" | "dict">) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || distribution.length === 0) return;
        const chart = echarts.init(ref.current);

        const COLORS: Record<string, string> = {
            fixed: "#f97316",
            variable: "#3b82f6",
            savings: "#a855f7",
        };

        const data = distribution.map((d) => ({
            name: dict.dashboard?.[d.key] ?? d.key,
            value: d.value,
            itemStyle: { color: COLORS[d.key] ?? "#71717a" },
        }));

        chart.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                textStyle: { color: "#f4f4f5", fontSize: 12 },
                formatter: "{b}: {c} ({d}%)",
            },
            legend: {
                orient: "horizontal",
                bottom: 0,
                textStyle: { color: "#71717a", fontSize: 11 },
                icon: "circle",
                itemWidth: 8,
                itemHeight: 8,
            },
            series: [{
                type: "pie",
                radius: ["48%", "72%"],
                center: ["50%", "44%"],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 6, borderColor: "#09090b", borderWidth: 3 },
                label: { show: false },
                emphasis: {
                    itemStyle: { shadowBlur: 12, shadowColor: "rgba(168,85,247,0.4)" },
                },
                data,
            }],
        });

        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    }, [distribution, dict]);

    if (distribution.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-zinc-600">{dict.dashboard?.noDataYet ?? "No data"}</p>
            </div>
        );
    }

    return <div ref={ref} className="w-full h-full" />;
}

export default function DashboardCharts({
    months,
    distribution,
    lang,
    locale,
    currency,
    dict,
}: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="flex h-[22rem] xl:col-span-2">
                <GraphicCard1
                    title={dict.dashboard?.analysisTitle}
                    subtitle={dict.dashboard?.analysisSubtitle}
                    exportLabel={dict.graphicCard?.export}
                >
                    <EvolutionChart
                        months={months}
                        lang={lang}
                        locale={locale}
                        currency={currency}
                        dict={dict}
                    />
                </GraphicCard1>
            </div>

            <div className="flex h-[22rem]">
                <GraphicCard1
                    title={dict.dashboard?.distributionTitle}
                    subtitle={dict.dashboard?.distributionSubtitle}
                    exportLabel={dict.graphicCard?.export}
                >
                    <DistributionChart distribution={distribution} dict={dict} />
                </GraphicCard1>
            </div>
        </div>
    );
}
