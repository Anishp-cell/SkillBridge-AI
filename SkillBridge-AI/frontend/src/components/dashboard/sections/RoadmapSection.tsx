"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { motion } from "framer-motion";
import { Roadmap, Phase } from "@/types";

interface RoadmapSectionProps {
    onComplete: () => void;
    onNext: () => void; // Added for compatibility with Dashboard logic, or alias to onComplete
    roadmapData: Roadmap | null;
    recommendation: any; // Type properly if possible
}

export const RoadmapSection = ({ onComplete, onNext, roadmapData, recommendation }: RoadmapSectionProps) => {
    const handleNext = onNext || onComplete;

    // roadmapData is passed from parent (DashboardPage) after syllabus upload
    // It contains the full roadmap structure from the backend

    if (!roadmapData) {
        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">Active Path</span>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                            {roadmapData?.domain || "Your Career Roadmap"}
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-medium flex items-center gap-6">
                        <span className="flex items-center gap-2">📅 <span className="text-zinc-900 dark:text-white font-bold">{roadmapData?.totalDurationWeeks} Weeks</span></span>
                        <span className="flex items-center gap-2">⏳ <span className="text-zinc-900 dark:text-white font-bold">{roadmapData?.weeklyHours}h/Week</span></span>
                        <span className="text-blue-600 font-bold">🎯 Industry Ready</span>
                    </p>
                </div>
                <button
                    onClick={handleNext}
                    className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    Proceed to Export →
                </button>
            </header>

            <div className="space-y-24 relative">
                {/* Vertical Line */}
                <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

                {(roadmapData?.phases || []).map((phase: Phase, pIndex: number) => (
                    <div key={pIndex} className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-12"
                        >
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black z-10 shadow-xl shadow-blue-500/30">
                                {pIndex + 1}
                            </div>
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                                {phase.phaseName}
                            </h2>
                        </motion.div>

                        <div className="space-y-12 ml-4 md:ml-12">
                            {phase.weeklyPlan.map((week, wIndex) => (
                                <motion.div
                                    key={wIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="group relative"
                                >
                                    {/* Connector dot */}
                                    <div className="absolute -left-[32px] top-10 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-zinc-50 dark:border-black group-hover:bg-blue-600 transition-colors hidden md:block" />

                                    <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                            <div>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Week {week.week}</p>
                                                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                                    {week.topic}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {week.skillsCovered.map(skill => (
                                                    <span key={skill} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-black rounded-full uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Weekly Deliverable</h4>
                                                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                                                        {week.deliverable}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Learning Resources</h4>
                                                <div className="grid gap-3">
                                                    {week.learning_resources.map((res, rIndex) => (
                                                        <a
                                                            key={rIndex}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-blue-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group/res shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-2xl">{res.type === 'video' ? '📺' : '📖'}</span>
                                                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover/res:text-blue-600 truncate max-w-[180px]">
                                                                    {res.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-blue-600 opacity-0 group-hover/res:opacity-100 transition-all translate-x-[-10px] group-hover/res:translate-x-0">→</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
