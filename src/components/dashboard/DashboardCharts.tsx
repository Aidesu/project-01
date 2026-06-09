"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import GraphicCard1 from "@/components/modules/GraphicCard1";
import type { EvolutionPoint, DistributionPoint } from "@/services/budgetService";

interface DashboardChartsProps {
    evolution: EvolutionPoint[];
    distribution: DistributionPoint[];
    lang: string;
    dict: any;
}

function EvolutionChart({ evolution, lang, dict }: Pick<DashboardChartsProps, "evolution" | "lang" | "dict">) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const chart = echarts.init(ref.current);

        const labels = evolution.map(({ month, year }) =>
            new Intl.DateTimeFormat(lang, { month: "short" }).format(
                new Date(year, month - 1, 1),
            ),
        );

        chart.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                textStyle: { color: "#f4f4f5", fontSize: 12 },
                axisPointer: { type: "shadow" },
            },
            legend: {
                data: [
                    dict.dashboard?.income ?? "Income",
                    dict.dashboard?.expenses ?? "Expenses",
                    dict.dashboard?.savings ?? "Savings",
                ],
                textStyle: { color: "#71717a", fontSize: 11 },
                top: 0,
                icon: "circle",
                itemWidth: 8,
                itemHeight: 8,
            },
            grid: { left: 0, right: 0, top: 32, bottom: 0, containLabel: true },
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
                    name: dict.dashboard?.income ?? "Income",
                    type: "bar",
                    barMaxWidth: 24,
                    data: evolution.map((e) => e.income),
                    itemStyle: { color: "#10b981", borderRadius: [4, 4, 0, 0] },
                },
                {
                    name: dict.dashboard?.expenses ?? "Expenses",
                    type: "bar",
                    barMaxWidth: 24,
                    data: evolution.map((e) => e.expenses),
                    itemStyle: { color: "#f97316", borderRadius: [4, 4, 0, 0] },
                },
                {
                    name: dict.dashboard?.savings ?? "Savings",
                    type: "bar",
                    barMaxWidth: 24,
                    data: evolution.map((e) => e.savings),
                    itemStyle: { color: "#a855f7", borderRadius: [4, 4, 0, 0] },
                },
            ],
        });

        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    }, [evolution, lang, dict]);

    if (evolution.length === 0) {
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

export default function DashboardCharts({ evolution, distribution, lang, dict }: DashboardChartsProps) {
    return (
        <div className="flex gap-4 h-[22rem]">
            <GraphicCard1
                title={dict.dashboard?.analysisTitle}
                subtitle={dict.dashboard?.analysisSubtitle}
                exportLabel={dict.graphicCard?.export}
            >
                <EvolutionChart evolution={evolution} lang={lang} dict={dict} />
            </GraphicCard1>

            <div className="w-72 flex-shrink-0">
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
