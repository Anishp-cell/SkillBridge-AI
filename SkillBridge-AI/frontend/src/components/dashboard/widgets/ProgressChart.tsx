"use client";

import { motion } from "framer-motion";

interface DataPoint {
    week: number;
    score: number;
}

interface ProgressChartProps {
    data: DataPoint[];
    height?: number;
}

export const ProgressChart = ({ data, height = 220 }: ProgressChartProps) => {
    if (data.length === 0) return null;

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 700;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxScore = 100;
    const maxWeek = Math.max(...data.map(d => d.week), 1);

    const points = data.map(d => ({
        x: padding.left + (d.week / maxWeek) * chartW,
        y: padding.top + chartH - (d.score / maxScore) * chartH,
    }));

    // Build SVG path
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    // Area fill path (line + close to bottom)
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    // Y-axis grid lines
    const yTicks = [0, 25, 50, 75, 100];
    const xTicks = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0 || i === data.length - 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                        Weekly Progress
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        Completion score per week
                    </p>
                </div>
                {data.length > 0 && (
                    <div className="text-right">
                        <p className="text-2xl font-black text-blue-600 tabular-nums">
                            {data[data.length - 1].score}%
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Latest
                        </p>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full min-w-[500px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                            <stop offset="100%" stopColor="rgb(37, 99, 235)" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {yTicks.map(tick => {
                        const y = padding.top + chartH - (tick / maxScore) * chartH;
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    className="stroke-zinc-100 dark:stroke-zinc-800"
                                    strokeWidth={1}
                                />
                                <text
                                    x={padding.left - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-zinc-400 text-[10px] font-bold"
                                >
                                    {tick}%
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {xTicks.map(d => {
                        const x = padding.left + (d.week / maxWeek) * chartW;
                        return (
                            <text
                                key={d.week}
                                x={x}
                                y={height - 6}
                                textAnchor="middle"
                                className="fill-zinc-400 text-[10px] font-bold"
                            >
                                W{d.week}
                            </text>
                        );
                    })}

                    {/* Area fill */}
                    <motion.path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Data points */}
                    {points.map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={4}
                            className="fill-blue-600 stroke-white dark:stroke-zinc-900"
                            strokeWidth={2}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                        />
                    ))}
                </svg>
            </div>
        </motion.div>
    );
};
