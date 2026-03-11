"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/AuthContext";
import { StatsCard } from "../widgets/StatsCard";
import { ActivityGrid } from "../widgets/ActivityGrid";
import { ProgressChart } from "../widgets/ProgressChart";
import { QuizCard } from "../widgets/QuizCard";

// -----------------------
// Mock Data Generators
// -----------------------

function generateActivityData() {
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        // Simulate realistic study patterns
        const dayOfWeek = date.getDay();
        const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
        const rand = Math.random();
        let minutes = 0;
        if (i < 90) {
            // Last 3 months: more active
            if (isWeekday) {
                minutes = rand > 0.2 ? Math.floor(rand * 120 + 15) : 0;
            } else {
                minutes = rand > 0.5 ? Math.floor(rand * 60) : 0;
            }
        } else if (i < 200) {
            // 3-7 months ago: moderate
            minutes = rand > 0.5 ? Math.floor(rand * 80) : 0;
        } else {
            // Older: sparse
            minutes = rand > 0.8 ? Math.floor(rand * 40) : 0;
        }
        data.push({ date: dateStr, minutes });
    }
    return data;
}

function generateWeeklyProgress(totalWeeks: number) {
    const data = [];
    let score = 10;
    for (let w = 1; w <= totalWeeks; w++) {
        score = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 15 - 3)));
        data.push({ week: w, score });
    }
    return data;
}

const MOCK_QUIZZES = [
    { id: "1", topic: "Python Fundamentals", questions: 10, score: 9, total: 10, difficulty: "Easy" as const, completedAt: "2026-03-10" },
    { id: "2", topic: "Data Structures & Algorithms", questions: 15, score: 11, total: 15, difficulty: "Medium" as const, completedAt: "2026-03-08" },
    { id: "3", topic: "Machine Learning Basics", questions: 12, score: 7, total: 12, difficulty: "Medium" as const, completedAt: "2026-03-05" },
    { id: "4", topic: "Deep Learning & Neural Nets", questions: 10, difficulty: "Hard" as const },
    { id: "5", topic: "Linear Algebra for ML", questions: 8, score: 6, total: 8, difficulty: "Easy" as const, completedAt: "2026-03-01" },
    { id: "6", topic: "Statistics & Probability", questions: 12, difficulty: "Medium" as const },
];

const MOCK_SKILLS = [
    { name: "Python", level: 85 },
    { name: "Statistics", level: 70 },
    { name: "Linear Algebra", level: 55 },
    { name: "Machine Learning", level: 40 },
    { name: "Data Visualization", level: 65 },
    { name: "SQL", level: 50 },
];

// -----------------------
// Tab Types
// -----------------------
type DashboardTab = "overview" | "progress" | "activity";

const tabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "progress", label: "Progress", icon: "📈" },
    { id: "activity", label: "Activity", icon: "⚡" },
];

// -----------------------
// Component
// -----------------------
export const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const { user } = useAuth();

    // Memoize mock data so it doesn't regenerate on each render
    const activityData = useMemo(() => generateActivityData(), []);
    const weeklyProgress = useMemo(() => generateWeeklyProgress(12), []);

    const completedQuizzes = MOCK_QUIZZES.filter(q => q.score !== undefined);
    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score! / q.total!) * 100, 0) / completedQuizzes.length)
        : 0;
    const highestScore = completedQuizzes.length > 0
        ? Math.round(Math.max(...completedQuizzes.map(q => (q.score! / q.total!) * 100)))
        : 0;

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Student";

    return (
        <div className="max-w-6xl mx-auto">
            {/* ===== PROFILE HEADER ===== */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 rounded-[2rem] shadow-2xl shadow-blue-500/20 mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/10">
                        👤
                    </div>
                    <div>
                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            Dashboard
                        </p>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            {displayName}
                        </h1>
                        <p className="text-blue-200 text-sm font-medium mt-0.5">
                            Keep building — every day counts.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ===== STATS CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatsCard icon="📅" label="Weeks Completed" value={weeklyProgress.length} color="blue" delay={0.1} />
                <StatsCard icon="💬" label="Quizzes Taken" value={completedQuizzes.length} color="purple" delay={0.15} />
                <StatsCard icon="📊" label="Average Score" value={avgScore} suffix="%" color="green" delay={0.2} />
                <StatsCard icon="🏆" label="Highest Score" value={highestScore} suffix="%" color="amber" delay={0.25} />
            </div>

            {/* ===== TAB BAR ===== */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl w-fit mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? "text-blue-600"
                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="dashboard-tab"
                                className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm -z-10"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ===== TAB CONTENT ===== */}
            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Skills */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                                    🛠 My Skills
                                </h3>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {MOCK_SKILLS.length} skills tracked
                                </span>
                            </div>
                            <div className="space-y-4">
                                {MOCK_SKILLS.map((skill, i) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4"
                                    >
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 w-36 truncate">
                                            {skill.name}
                                        </span>
                                        <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-zinc-500 w-10 text-right tabular-nums">
                                            {skill.level}%
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Quizzes */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                                    🧠 Quizzes
                                </h3>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {completedQuizzes.length} / {MOCK_QUIZZES.length} completed
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MOCK_QUIZZES.map((quiz, i) => (
                                    <QuizCard
                                        key={quiz.id}
                                        quiz={quiz}
                                        delay={i * 0.05}
                                        onStart={(id) => console.log("Start quiz:", id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "progress" && (
                    <motion.div
                        key="progress"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <ProgressChart data={weeklyProgress} />

                        {/* Quiz Score Breakdown */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mb-6">
                                Quiz Score History
                            </h3>
                            {completedQuizzes.length > 0 ? (
                                <div className="space-y-3">
                                    {completedQuizzes.map((q, i) => {
                                        const pct = Math.round((q.score! / q.total!) * 100);
                                        return (
                                            <motion.div
                                                key={q.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                                                        pct >= 80
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                                            : pct >= 50
                                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                                            : "bg-red-100 dark:bg-red-900/30 text-red-600"
                                                    }`}>
                                                        {pct}%
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                                            {q.topic}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 font-medium">
                                                            {q.score}/{q.total} correct · {q.completedAt && new Date(q.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 max-w-[120px] h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden ml-4">
                                                    <motion.div
                                                        className={`h-full rounded-full ${
                                                            pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
                                                        }`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                                    />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-400 italic">No quizzes completed yet. Start one from the Overview tab!</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === "activity" && (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <ActivityGrid data={activityData} />

                        {/* Streak & stats summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-center">
                                <p className="text-3xl font-black text-blue-600 mb-1">🔥 14</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Current Streak
                                </p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-center">
                                <p className="text-3xl font-black text-green-600 mb-1">🏅 28</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Longest Streak
                                </p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-center">
                                <p className="text-3xl font-black text-purple-600 mb-1">📚 {Math.round(activityData.reduce((s, d) => s + d.minutes, 0) / 60)}h</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Total Study Hours
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
