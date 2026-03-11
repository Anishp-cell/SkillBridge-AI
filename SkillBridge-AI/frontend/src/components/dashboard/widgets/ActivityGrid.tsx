"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ActivityDay {
    date: string;
    minutes: number;
}

interface ActivityGridProps {
    data: ActivityDay[];
}

function getIntensityClass(minutes: number): string {
    if (minutes === 0)
        return "bg-zinc-100 dark:bg-zinc-800";
    if (minutes < 30)
        return "bg-blue-200 dark:bg-blue-900/50";
    if (minutes < 60)
        return "bg-blue-400 dark:bg-blue-700";
    if (minutes < 120)
        return "bg-blue-500 dark:bg-blue-500";
    return "bg-blue-600 dark:bg-blue-400";
}

function getIntensityLabel(minutes: number): string {
    if (minutes === 0) return "No activity";
    if (minutes < 30) return "Light";
    if (minutes < 60) return "Moderate";
    if (minutes < 120) return "Active";
    return "Very Active";
}

// Generate 52 weeks × 7 days grid from data
function buildGrid(data: ActivityDay[]): ActivityDay[][] {
    const dataMap = new Map(data.map(d => [d.date, d.minutes]));
    const weeks: ActivityDay[][] = [];
    
    // Start from 364 days ago
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 363);
    
    // Align start to Sunday
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);
    
    let currentDate = new Date(start);
    
    while (currentDate <= today) {
        const week: ActivityDay[] = [];
        for (let day = 0; day < 7; day++) {
            const dateStr = currentDate.toISOString().split("T")[0];
            week.push({
                date: dateStr,
                minutes: dataMap.get(dateStr) || 0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }
    
    return weeks;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthLabels(weeks: ActivityDay[][]): { label: string; col: number }[] {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, i) => {
        const date = new Date(week[0].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
            labels.push({ label: MONTHS[month], col: i });
            lastMonth = month;
        }
    });
    
    return labels;
}

export const ActivityGrid = ({ data }: ActivityGridProps) => {
    const [tooltip, setTooltip] = useState<{
        text: string;
        x: number;
        y: number;
    } | null>(null);

    const weeks = buildGrid(data);
    const monthLabels = getMonthLabels(weeks);
    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

    const totalDays = data.filter(d => d.minutes > 0).length;
    const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                        Learning Activity
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        {totalDays} active days · {Math.round(totalMinutes / 60)} total hours
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Less</span>
                    {[0, 15, 45, 90, 150].map((min, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-sm ${getIntensityClass(min)}`}
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                    {/* Month labels */}
                    <div className="flex ml-8 mb-1">
                        {monthLabels.map((m, i) => (
                            <span
                                key={i}
                                className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider"
                                style={{
                                    position: "relative",
                                    left: `${m.col * 14}px`,
                                    marginRight: i < monthLabels.length - 1
                                        ? `${((monthLabels[i + 1]?.col || 0) - m.col) * 14 - 24}px`
                                        : 0,
                                }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-0">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[3px] mr-2 pt-0">
                            {dayLabels.map((label, i) => (
                                <div
                                    key={i}
                                    className="h-[11px] flex items-center text-[9px] font-bold text-zinc-400 w-6"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        <div className="flex gap-[3px] relative">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((day, di) => (
                                        <div
                                            key={`${wi}-${di}`}
                                            className={`w-[11px] h-[11px] rounded-sm ${getIntensityClass(day.minutes)} cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/50 hover:scale-150`}
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const formatted = new Date(day.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                });
                                                setTooltip({
                                                    text: `${formatted}: ${day.minutes}min (${getIntensityLabel(day.minutes)})`,
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top - 8,
                                                });
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </motion.div>
    );
};
