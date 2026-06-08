"use client";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { useEffect, useRef, use, useState } from "react";
import * as echarts from "echarts";
import StatCard from "@/components/main/StatCard";
import Pie from "@/components/graphics/pie";
import StackedLine from "@/components/graphics/stackedLine";
import GraphicCard1 from "@/components/modules/GraphicCard1";

interface PageProps {
    params: Promise<{ lang: string }>;
}

const kpiData = [
    { name: "Total Income", amount: 552.56, colorTheme: "emerald" },
    { name: "Total Fixed Expenses", amount: 138.99, colorTheme: "orange" },
    { name: "Total Variable Expenses", amount: 0.0, colorTheme: "blue" },
    {
        name: "Total Savings / Investments",
        amount: 120.0,
        colorTheme: "purple",
    },
    { name: "Remaining", amount: 293.01, colorTheme: "purple" },
];

export default function Home({ params }: PageProps) {
    const { lang } = use(params);
    const [dict, setDict] = useState<any>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getDictionary(lang).then((data) => {
            setDict(data);
        });
    }, [lang]);

    useEffect(() => {
        if (!chartRef.current) return;

        const myChart = echarts.init(chartRef.current);

        const option = {
            title: { text: dict.welcome },
            tooltip: {},
            xAxis: {
                data: [
                    "Janvier",
                    "Fevrier",
                    "Mars",
                    "Avril",
                    "Mai",
                    "Juin",
                    "Juillet",
                    "Aout",
                    "Septembre",
                    "Octobre",
                    "Novembre",
                    "Decembre",
                ],
            },
            yAxis: {},
            series: [
                {
                    name: "sales",
                    type: "bar",
                    data: [
                        345, 202, 361, 104, 103, 202, 345, 202, 361, 104, 103,
                        202,
                    ],
                },
            ],
        };

        myChart.setOption(option);

        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            myChart.dispose();
        };
    });

    if (!dict) return <div>Loading...</div>;

    return (
        <div>
            <h1>{dict.welcome}</h1>
            <div className="flex gap-4 mb-6 justify-center">
                {kpiData.map((item, index) => (
                    <StatCard
                        key={index}
                        name={item.name}
                        amount={item.amount}
                        colorTheme={item.colorTheme}
                    />
                ))}
            </div>

            <div className="flex gap-4 mb-6 justify-center h-[25rem]">
                <GraphicCard1
                    title="Analyse Financière"
                    subtitle="Évolution de vos dépenses sur les 7 derniers jours"
                >
                    <StackedLine />
                </GraphicCard1>
                <GraphicCard1 title="Feur coubeh">
                    <Pie height={250} />
                </GraphicCard1>
            </div>
        </div>
    );
}
