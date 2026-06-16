"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import AnalyticsCard from "./AnalyticsCard";
import type { MonthlyPoint } from "@/services/analyticsService";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface ChartProps {
    months: MonthlyPoint[];
    lang: string;
    dict: Dictionary;
}

const TOOLTIP = {
    backgroundColor: "#09090b",
    borderColor: "#27272a",
    textStyle: { color: "#f4f4f5", fontSize: 12 },
};

function monthLabels(months: MonthlyPoint[], lang: string): string[] {
    return months.map(({ month, year }) =>
        new Intl.DateTimeFormat(lang, { month: "short" }).format(
            new Date(year, month - 1, 1),
        ),
    );
}

/** Flux de trésorerie : revenus / dépenses / épargne en courbes lissées (aires). */
export function CashflowChart({ months, lang, dict }: ChartProps) {
    const ref = useRef<HTMLDivElement>(null);
    const t = dict.analytics.cashflow;

    useEffect(() => {
        if (!ref.current || months.length === 0) return;
        const chart = echarts.init(ref.current);

        const series = [
            { name: t.income, key: "income" as const, color: "#10b981" },
            { name: t.expenses, key: "expenses" as const, color: "#f97316" },
            { name: t.savings, key: "savings" as const, color: "#a855f7" },
        ];

        chart.setOption({
            backgroundColor: "transparent",
            tooltip: { trigger: "axis", ...TOOLTIP },
            legend: {
                data: series.map((s) => s.name),
                textStyle: { color: "#71717a", fontSize: 11 },
                top: 0,
                icon: "circle",
                itemWidth: 8,
                itemHeight: 8,
            },
            grid: { left: 0, right: 8, top: 32, bottom: 0, containLabel: true },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: monthLabels(months, lang),
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
            series: series.map((s) => ({
                name: s.name,
                type: "line",
                smooth: true,
                showSymbol: false,
                data: months.map((m) => m[s.key]),
                lineStyle: { width: 2.5, color: s.color },
                itemStyle: { color: s.color },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `${s.color}33` },
                        { offset: 1, color: `${s.color}00` },
                    ]),
                },
            })),
        });

        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    }, [months, lang, t]);

    return (
        <AnalyticsCard title={t.title} subtitle={t.subtitle} accent="emerald" className="h-full">
            {months.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-zinc-600">{dict.analytics.noDataYet}</p>
                </div>
            ) : (
                <div ref={ref} className="h-64 w-full" />
            )}
        </AnalyticsCard>
    );
}

/** Taux d'épargne mensuel (%) avec ligne de référence à 20 %. */
export function SavingsRateChart({ months, lang, dict }: ChartProps) {
    const ref = useRef<HTMLDivElement>(null);
    const t = dict.analytics.savingsRateChart;

    useEffect(() => {
        if (!ref.current || months.length === 0) return;
        const chart = echarts.init(ref.current);

        chart.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                ...TOOLTIP,
                valueFormatter: (v: number | null) =>
                    v === null || v === undefined ? "—" : `${Number(v).toFixed(1)}%`,
            },
            grid: { left: 0, right: 8, top: 24, bottom: 0, containLabel: true },
            xAxis: {
                type: "category",
                data: monthLabels(months, lang),
                axisLabel: { color: "#52525b", fontSize: 11 },
                axisLine: { lineStyle: { color: "#27272a" } },
                axisTick: { show: false },
            },
            yAxis: {
                type: "value",
                axisLabel: { color: "#52525b", fontSize: 11, formatter: "{value}%" },
                splitLine: { lineStyle: { color: "#18181b", type: "dashed" } },
                axisLine: { show: false },
            },
            series: [{
                name: t.rate,
                type: "line",
                smooth: true,
                data: months.map((m) =>
                    m.savingsRate === null ? null : Number(m.savingsRate.toFixed(1)),
                ),
                lineStyle: { width: 2.5, color: "#a855f7" },
                itemStyle: { color: "#a855f7" },
                symbolSize: 6,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#a855f733" },
                        { offset: 1, color: "#a855f700" },
                    ]),
                },
                markLine: {
                    silent: true,
                    symbol: "none",
                    data: [{ yAxis: 20 }],
                    lineStyle: { color: "#10b981", type: "dashed", width: 1.5 },
                    label: {
                        formatter: t.target,
                        color: "#10b981",
                        fontSize: 10,
                        position: "insideEndTop",
                    },
                },
            }],
        });

        const resize = () => chart.resize();
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    }, [months, lang, t]);

    return (
        <AnalyticsCard title={t.title} subtitle={t.subtitle} accent="purple" className="h-full">
            {months.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-zinc-600">{dict.analytics.noDataYet}</p>
                </div>
            ) : (
                <div ref={ref} className="h-64 w-full" />
            )}
        </AnalyticsCard>
    );
}
