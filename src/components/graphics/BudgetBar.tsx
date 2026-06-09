"use client";

import { useEffect, useRef } from "react";
// On utilise l'instance optimisée et configurée depuis ton dossier lib
import echarts from "@/lib/echarts";

interface BudgetBarProps {
    data: { name: string; value: number; itemStyle: { color: string } }[];
}

export default function BudgetBar({ data }: BudgetBarProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    // Fonction utilitaire pour transformer un HEX en RGBA proprement pour les dégradés pro
    const hexToRgba = (hex: string, alpha: number) => {
        const cleanHex = hex.replace("#", "");
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    useEffect(() => {
        if (!chartRef.current) return;

        const myChart = echarts.init(chartRef.current);

        // Application des dégradés
        const processedData = data.map((item) => {
            const baseColor = item.itemStyle?.color || "#3b82f6";
            return {
                ...item,
                itemStyle: {
                    // Même dégradé vertical haut de gamme, mais optimisé pour le Tree-Shaking
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: baseColor }, // Couleur pure en haut
                            { offset: 1, color: hexToRgba(baseColor, 0.12) }, // Estompement élégant en bas
                        ],
                    },
                    borderRadius: [6, 6, 0, 0], // Coins stricts
                },
            };
        });

        const option = {
            backgroundColor: "transparent",
            grid: {
                left: "4%",
                right: "4%",
                top: "20%",
                bottom: "4%",
                containLabel: false,
            },
            xAxis: {
                type: "category",
                data: processedData.map((d) => d.name),
                axisLine: {
                    show: true,
                    lineStyle: { color: "#18181b" },
                },
                axisTick: { show: false },
                axisLabel: {
                    color: "#71717a",
                    fontSize: 12,
                    fontWeight: "600",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    margin: 14,
                },
            },
            yAxis: {
                type: "value",
                show: false,
            },
            series: [
                {
                    type: "bar",
                    barWidth: "48%",
                    data: processedData,

                    showBackground: true,
                    backgroundStyle: {
                        color: "rgba(24, 24, 27, 0.35)",
                        borderRadius: [6, 6, 0, 0],
                    },

                    emphasis: {
                        itemStyle: {
                            opacity: 0.9,
                        },
                    },

                    label: {
                        show: true,
                        position: "top",
                        distance: 10,
                        // On utilise une fonction pour calculer dynamiquement le pourcentage
                        formatter: (params: any) => {
                            // 1. Calculer le total de tous les budgets du graphe
                            const total = data.reduce(
                                (acc, item) => acc + item.value,
                                0,
                            );

                            // 2. Calculer le pourcentage
                            const percent =
                                total > 0
                                    ? ((params.value / total) * 100).toFixed(0)
                                    : 0;

                            // 3. Retourner le texte final (Valeur + Pourcentage)
                            return `${params.value}\n{percent|${percent}%}`;
                        },
                        // Stylisation du pourcentage pour qu'il soit plus discret que la valeur
                        rich: {
                            percent: {
                                color: "#a1a1aa", // Couleur gris clair
                                fontSize: 10,
                                padding: [4, 0, 0, 0],
                            },
                        },
                        color: "#f4f4f5",
                        fontSize: 12,
                        fontWeight: "700",
                    },
                },
            ],
        };

        myChart.setOption(option);

        const handleResize = () => myChart.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            myChart.dispose();
        };
    }, [data]);

    return <div ref={chartRef} className="w-full h-full" />;
}
