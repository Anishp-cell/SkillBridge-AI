"use client";

import { motion } from "framer-motion";

interface QuizData {
    id: string;
    topic: string;
    questions: number;
    score?: number;
    total?: number;
    difficulty: "Easy" | "Medium" | "Hard";
    completedAt?: string;
}

interface QuizCardProps {
    quiz: QuizData;
    onStart?: (id: string) => void;
    delay?: number;
}

const difficultyColors = {
    Easy: {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-600",
        border: "border-green-200 dark:border-green-900/30",
    },
    Medium: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-600",
        border: "border-amber-200 dark:border-amber-900/30",
    },
    Hard: {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600",
        border: "border-red-200 dark:border-red-900/30",
    },
};

function ScoreRing({ score, total }: { score: number; total: number }) {
    const percentage = (score / total) * 100;
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 80) return "stroke-green-500";
        if (percentage >= 50) return "stroke-amber-500";
        return "stroke-red-500";
    };

    return (
        <div className="relative w-[68px] h-[68px] flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    className="stroke-zinc-100 dark:stroke-zinc-800"
                    strokeWidth="4"
                />
                <motion.circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    className={getColor()}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
            </svg>
            <span className="absolute text-sm font-black text-zinc-900 dark:text-white tabular-nums">
                {Math.round(percentage)}%
            </span>
        </div>
    );
}

export const QuizCard = ({ quiz, onStart, delay = 0 }: QuizCardProps) => {
    const isCompleted = quiz.score !== undefined && quiz.total !== undefined;
    const diff = difficultyColors[quiz.difficulty];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow group"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${diff.bg} ${diff.text} ${diff.border}`}>
                            {quiz.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {quiz.questions} Qs
                        </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight truncate">
                        {quiz.topic}
                    </h4>
                    {isCompleted && quiz.completedAt && (
                        <p className="text-[10px] text-zinc-400 font-medium mt-1">
                            Completed {new Date(quiz.completedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                    )}
                </div>

                {isCompleted ? (
                    <ScoreRing score={quiz.score!} total={quiz.total!} />
                ) : (
                    <button
                        onClick={() => onStart?.(quiz.id)}
                        className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                    >
                        Start
                    </button>
                )}
            </div>
        </motion.div>
    );
};
