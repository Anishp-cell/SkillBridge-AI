"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface BulletSuggestion {
    section: string;
    suggestion: string;
}

interface ResumeAnalysisResult {
    atsScore: number;
    missingKeywords: string[];
    bulletSuggestions: BulletSuggestion[];
}

export const ResumeAnalyzerWidget = () => {
    const [file, setFile] = useState<File | null>(null);
    const [targetDomain, setTargetDomain] = useState("machine_learning_engineer");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setResult(null);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("target_domain", targetDomain);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/analyze`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Failed to analyze resume.");
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Error analyzing resume. Please check console.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">
                📄 AI Resume Analyzer
            </h3>

            {!result && !isAnalyzing && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                            Target Job Domain
                        </label>
                        <select
                            value={targetDomain}
                            onChange={(e) => setTargetDomain(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
                        >
                            <option value="machine_learning_engineer">Machine Learning Engineer</option>
                            <option value="data_analyst">Data Analyst</option>
                            <option value="backend_developer">Backend Developer</option>
                            <option value="full_stack_developer">Full Stack Developer</option>
                            <option value="cybersecurity_engineer">Cybersecurity Engineer</option>
                            <option value="cloud_devops_engineer">Cloud / DevOps Engineer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                            Upload Resume (PDF)
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!file}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider disabled:opacity-50 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Analyze ATS Score
                    </button>
                </div>
            )}

            {isAnalyzing && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-medium animate-pulse">Scanning keywords & formatting...</p>
                </div>
            )}

            {result && !isAnalyzing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* ATS Score Row */}
                    <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" fill="none" className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="6" />
                                <motion.circle
                                    cx="32" cy="32" r="28" fill="none"
                                    className={result.atsScore >= 75 ? "stroke-green-500" : result.atsScore >= 50 ? "stroke-amber-500" : "stroke-red-500"}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 28}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                    animate={{ strokeDashoffset: (2 * Math.PI * 28) * (1 - result.atsScore / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <span className="absolute text-2xl font-black text-zinc-900 dark:text-white">{result.atsScore}</span>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">ATS Match Score</h4>
                            <p className="text-sm text-zinc-500">{result.atsScore >= 75 ? "Looking good! Ready to apply." : "Needs targeted improvement."}</p>
                        </div>
                    </div>

                    {/* Missing Keywords */}
                    <div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight mb-3">⚠️ Missing Critical Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.length > 0 ? (
                                result.missingKeywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-100 dark:border-red-900/30">
                                        + {kw}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-green-600 font-medium">All critical keywords found!</span>
                            )}
                        </div>
                    </div>

                    {/* Bullet Suggestions */}
                    <div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight mb-3">💡 Resume Polish Suggestions</h4>
                        <div className="space-y-3">
                            {result.bulletSuggestions.map((sug, i) => (
                                <div key={i} className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 block mb-1">{sug.section}</span>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{sug.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { setResult(null); setFile(null); }}
                        className="w-full py-3 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Scan Another Resume
                    </button>
                </motion.div>
            )}
        </div>
    );
};
