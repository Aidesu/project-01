import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

type Serie = {
    name: string;
    data: number[];
};

export default function StackedLine() {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const [data, setData] = useState<Serie[]>([]);

    // FIX 1: fetch UNE seule fois
    useEffect(() => {
        fetch("/data/year.json")
            .then((res) => res.json())
            .then(setData);
    }, []);

    // INIT chart UNE seule fois
    useEffect(() => {
        if (!chartRef.current) return;

        chartInstance.current = echarts.init(chartRef.current);

        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    // UPDATE chart quand data change
    useEffect(() => {
        if (!chartInstance.current || data.length === 0) return;

        const myChart = chartInstance.current;

        const option = {
            // 1. Tooltip sombre et propre
            tooltip: {
                trigger: "axis",
                backgroundColor: "#111827", // gray-900
                borderColor: "#374151", // gray-700
                textStyle: { color: "#ffffff" },
            },
            // 2. Légende alignée et discrète
            legend: {
                data: [
                    "Email",
                    "Union Ads",
                    "Video Ads",
                    "Direct",
                    "Search Engine",
                ],
                textStyle: { color: "#9ca3af" }, // gray-400
                top: "0%",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                top: "15%", // Un peu plus d'espace en haut
                containLabel: true,
            },
            // 3. Axes épurés (sans lignes encombrantes)
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                axisLine: { show: false }, // On cache la ligne de base
                axisTick: { show: false }, // On cache les petits traits
                axisLabel: { color: "#6b7280" }, // gray-500
            },
            yAxis: {
                type: "value",
                axisLine: { show: false },
                splitLine: {
                    lineStyle: { color: "#1f2937" }, // Ligne de grille très sombre
                },
                axisLabel: { color: "#6b7280" },
            },
            // 4. Séries avec lissage et dégradés
            series: data.map((item) => ({
                name: item.name,
                type: "line",
                stack: "Total",
                smooth: true, // Courbes arrondies
                showSymbol: false, // On cache les points sur la courbe
                areaStyle: {
                    // Effet dégradé moderne
                    opacity: 0.3,
                },
                lineStyle: { width: 3 },
                data: item.data,
            })),
        };

        myChart.setOption(option);
    }, [data]);

    return <div ref={chartRef} style={{ width: "100%", height: "300px" }} />;
}
