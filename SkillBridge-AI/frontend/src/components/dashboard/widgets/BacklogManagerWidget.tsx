"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BacklogPlan {
    subject: string;
    weeks: {
        weekNumber: number;
        focus: string;
        tasks: string[];
    }[];
    revisionTopics: {
        topic: string;
        importance: "High" | "Medium";
    }[];
}

export const BacklogManagerWidget = () => {
    const [subject, setSubject] = useState("");
    const [weeksAvailable, setWeeksAvailable] = useState(4);
    const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
    const [resourcesFile, setResourcesFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<BacklogPlan | null>(null);

    const handleGenerate = async () => {
        if (!subject.trim() || !syllabusFile || !resourcesFile) return;

        setIsGenerating(true);
        setPlan(null);

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("weeks_available", weeksAvailable.toString());
            formData.append("syllabus_file", syllabusFile);
            formData.append("resources_file", resourcesFile);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/backlog/plan`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to generate backlog plan.");
            }

            const data = await response.json();
            setPlan(data);
        } catch (error) {
            console.error(error);
            alert("Error generating backlog plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">
                📚 Backlog Crash Course
            </h3>

            {!plan && !isGenerating && (
                <div className="space-y-6">
                    <p className="text-sm text-zinc-500 font-medium">
                        Have a backlog subject? Generate a highly optimized, no-fluff revision plan to clear it before limits expire.
                    </p>

                    <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                            Subject Name
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Applied Mathematics II"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-4 focus:ring-purple-500/10 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">
                                Weeks until exam
                            </label>
                            <span className="text-lg font-black text-purple-600">{weeksAvailable} w</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={weeksAvailable}
                            onChange={(e) => setWeeksAvailable(parseInt(e.target.value))}
                            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Upload Syllabus (PDF)
                            </label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Upload Resources (PDF)
                            </label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setResourcesFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!subject.trim() || !syllabusFile || !resourcesFile}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-black uppercase tracking-wider disabled:opacity-50 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Generate Rescue Plan
                    </button>
                </div>
            )}

            {isGenerating && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-medium animate-pulse">Designing crash course...</p>
                </div>
            )}

            {plan && !isGenerating && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
                        <h4 className="font-black text-purple-900 dark:text-purple-300 text-lg">{plan.subject}</h4>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-1">{weeksAvailable} Week Sprint</p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                        {plan.weeks.map((week, i) => (
                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                                    W{week.weekNumber}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                    <h5 className="font-bold text-zinc-900 dark:text-white mb-2">{week.focus}</h5>
                                    <ul className="space-y-1">
                                        {week.tasks.map((task, j) => (
                                            <li key={j} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-2">
                                                <span className="text-purple-500">▹</span> {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cheat Sheet Topics */}
                    <div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight mb-4">🎯 High-Yield Revision Topics</h4>
                        <div className="flex flex-wrap gap-2">
                            {plan.revisionTopics.map((topic, i) => (
                                <span key={i} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                                    topic.importance === 'High' 
                                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
                                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                                }`}>
                                    {topic.topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { setPlan(null); setSubject(""); setSyllabusFile(null); setResourcesFile(null); }}
                        className="w-full py-3 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Plan Another Subject
                    </button>
                </motion.div>
            )}
        </div>
    );
};
