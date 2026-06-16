/** Mini-courbe de tendance pour les lignes de la liste des marchés. */

interface SparklineProps {
    values: number[];
}

export default function Sparkline({ values }: SparklineProps) {
    if (values.length < 2) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const points = values
        .map((v, i) => {
            const x = (i / (values.length - 1)) * 100;
            // 4 % de marge verticale pour que le trait ne touche pas les bords
            const y = 4 + (1 - (v - min) / span) * 92;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

    const up = values[values.length - 1] >= values[0];

    return (
        <svg
            className="h-8 w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={points}
                fill="none"
                stroke={up ? "#10b981" : "#f43f5e"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
