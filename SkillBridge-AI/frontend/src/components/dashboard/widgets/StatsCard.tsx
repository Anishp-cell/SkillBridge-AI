"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsCardProps {
    icon: string;
    label: string;
    value: number;
    suffix?: string;
    color?: "blue" | "green" | "purple" | "amber";
    delay?: number;
}

const colorMap = {
    blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-100 dark:border-blue-900/30",
        text: "text-blue-600",
        icon: "bg-blue-100 dark:bg-blue-900/30",
    },
    green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-100 dark:border-green-900/30",
        text: "text-green-600",
        icon: "bg-green-100 dark:bg-green-900/30",
    },
    purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-100 dark:border-purple-900/30",
        text: "text-purple-600",
        icon: "bg-purple-100 dark:bg-purple-900/30",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-100 dark:border-amber-900/30",
        text: "text-amber-600",
        icon: "bg-amber-100 dark:bg-amber-900/30",
    },
};

export const StatsCard = ({
    icon,
    label,
    value,
    suffix = "",
    color = "blue",
    delay = 0,
}: StatsCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const colors = colorMap[color];

    useEffect(() => {
        const duration = 1200;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.round(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`p-6 rounded-2xl border ${colors.bg} ${colors.border} relative overflow-hidden group hover:scale-[1.02] transition-transform`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center text-2xl shadow-inner`}>
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className={`text-3xl font-black ${colors.text} tracking-tight tabular-nums`}>
                    {displayValue}{suffix}
                </p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {label}
                </p>
            </div>
            {/* Subtle decorative glow */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${colors.icon} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`} />
        </motion.div>
    );
};
