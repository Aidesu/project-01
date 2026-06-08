"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

export default function Pie({ height = 400 }: { height?: number }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/data/budget.json")
            .then((res) => res.json())
            .then(setData);
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const myChart = echarts.init(chartRef.current);

        const option = {
            tooltip: {
                trigger: "item",
                backgroundColor: "#111827", // gray-900
                borderColor: "#374151", // gray-700
                textStyle: { color: "#ffffff" },
            },
            legend: {
                top: "5%",
                left: "center",
                textStyle: { color: "#9ca3af" }, // gray-400
            },
            series: [
                {
                    name: "Depense",
                    type: "pie",
                    radius: ["45%", "70%"],
                    color: [
                        "#8b5cf6", // Purple-500
                        "#a78bfa", // Purple-400
                        "#c4b5fd", // Purple-300
                        "#ddd6fe", // Purple-200
                        "#ede9fe", // Purple-100
                        "#7c3aed", // Purple-600
                        "#5b21b6", // Purple-800
                    ],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: "#0f172a",
                        borderWidth: 4,
                    },
                    label: { show: false },
                    emphasis: {
                        label: { show: false },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: "rgba(139, 92, 246, 0.5)",
                        },
                    },
                    data,
                },
            ],
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: "100%", height }} />;
}
