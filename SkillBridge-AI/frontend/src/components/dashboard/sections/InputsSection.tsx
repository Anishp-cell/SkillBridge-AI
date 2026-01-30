"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { motion } from "framer-motion";
import { UserOnboarding } from "@/types";

interface InputsSectionProps {
    onComplete: (data: any) => void;
    initialData?: UserOnboarding | null;
    isLoading?: boolean;
}

export const InputsSection = ({ onComplete, initialData, isLoading = false }: InputsSectionProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        skills: [] as string[],
        interests: [] as string[],
        goals: "",
        currentLevel: "beginner",
        weekly_hours: 10,
        duration_weeks: 16,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                skills: initialData.skills || [],
                interests: initialData.interests || [],
                goals: initialData.goals || "",
                currentLevel: initialData.currentLevel || "beginner",
                weekly_hours: initialData.weekly_hours || 10,
                duration_weeks: initialData.duration_weeks || 16,
            });
        }
    }, [initialData]);
    const [skillInput, setSkillInput] = useState("");
    const [interestInput, setInterestInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();

    const addSkill = () => {
        if (skillInput && !formData.skills.includes(skillInput)) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput("");
        }
    };

    const addInterest = () => {
        if (interestInput && !formData.interests.includes(interestInput)) {
            setFormData({ ...formData, interests: [...formData.interests, interestInput] });
            setInterestInput("");
        }
    };

    const handleSubmit = async () => {
        try {
            // Optional: Save to backend here if needed using /api/v1/onboarding
            // const token = await user?.getIdToken();
            // await fetch(...) 

            // Pass data up to parent
            onComplete(formData);
        } catch (e) {
            console.error(e);
        }
    };

    // Helper to calculate realistic ranges and labels
    const getWorkloadLabel = (hours: number) => {
        if (hours <= 5) return "Light Check-in";
        if (hours <= 15) return "Steady Part-Time";
        if (hours <= 30) return "Serious Commitment";
        if (hours <= 40) return "Full-Time Job";
        return "⚠️ Burnout Risk";
    };

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                    Profile Setup
                </h1>
                <p className="text-zinc-500 font-medium">
                    Tell us about your background and goals to personalize your AI journey.
                </p>
            </header>

            <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= i
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                        }`}
                                >
                                    {i}
                                </div>
                                <div className={`h-1.5 w-full mt-4 rounded-full transition-all duration-700 ${step > i ? "bg-blue-600" : "bg-zinc-100 dark:bg-zinc-800"}`} />
                            </div>
                        ))}
                    </div>
                    <motion.h2
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-zinc-900 dark:text-white"
                    >
                        {step === 1 && "What are your skills?"}
                        {step === 2 && "What are you interested in?"}
                        {step === 3 && "What are your goals?"}
                        {step === 4 && "Commitment & Duration"}
                    </motion.h2>
                    <p className="text-sm text-zinc-500 mt-2">
                        {step === 1 && "Tell us what you already know so we can skip the basics."}
                        {step === 2 && "This helps our AI recommend the most relevant domains for you."}
                        {step === 3 && "Where do you see yourself in the next few years?"}
                        {step === 4 && "Set a realistic weekly schedule—consistent small steps beat burnout."}
                    </p>
                </div>

                <div className="min-h-[200px]">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="flex-1 px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    placeholder="e.g. Python, React, Design"
                                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill: string) => (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        key={skill}
                                        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-900/30"
                                    >
                                        {skill}
                                        <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skill) })} className="hover:text-red-500 transition-colors">×</button>
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                    className="flex-1 px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    placeholder="e.g. AI, Web Dev, Finance"
                                    onKeyPress={(e) => e.key === "Enter" && addInterest()}
                                />
                                <button
                                    onClick={addInterest}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest: string) => (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        key={interest}
                                        className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-100 dark:border-green-900/30"
                                    >
                                        {interest}
                                        <button onClick={() => setFormData({ ...formData, interests: formData.interests.filter((i: string) => i !== interest) })} className="hover:text-red-500 transition-colors">×</button>
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="relative">
                                <textarea
                                    value={formData.goals}
                                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                    className="w-full h-40 px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none"
                                    placeholder="Tell us about your career goals..."
                                />
                                <div className="absolute top-4 right-4 group">
                                    <span className="cursor-help text-zinc-400 text-xl">ⓘ</span>
                                    <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-zinc-900 text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl border border-zinc-800 leading-relaxed">
                                        <span className="font-black text-blue-400 block mb-1 uppercase tracking-widest">Why we ask</span>
                                        This helps the AI understand the &quot;Why&quot; behind your journey to provide more motivating milestones.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">
                                    Current Experience Level
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({ ...formData, currentLevel: level })}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border ${formData.currentLevel === level
                                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-blue-500"
                                                }`}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            {/* Realistic Weekly Commitment */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-4">
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">
                                        Weekly Study Commitment
                                    </label>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-blue-600 tabular-nums">{formData.weekly_hours}</span>
                                        <span className="text-zinc-400 text-sm ml-1 font-bold">hrs</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="2"
                                    max="50"
                                    step="1"
                                    value={formData.weekly_hours}
                                    onChange={(e) => setFormData({ ...formData, weekly_hours: parseInt(e.target.value) })}
                                    className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <span>2h</span>
                                    <span>25h</span>
                                    <span>50h (Max)</span>
                                </div>
                                <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors
                                    ${formData.weekly_hours > 40 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {formData.weekly_hours > 40 ? '⚠️' : '💡'} {getWorkloadLabel(formData.weekly_hours)}
                                </div>
                            </div>

                            {/* Realistic Duration (Semesters) */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">
                                        Roadmap Duration (Weeks)
                                    </label>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-purple-600 tabular-nums">{formData.duration_weeks}</span>
                                        <span className="text-zinc-400 text-sm ml-1 font-bold">weeks</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="4"
                                    max="24"
                                    step="1"
                                    value={formData.duration_weeks}
                                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                                    className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500 transition-all"
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <span>4w (Quick)</span>
                                    <span>16w (Semester)</span>
                                    <span>24w (Deep Dive)</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-lg">
                                    <span className="font-bold text-zinc-400">Pro Tip:</span> University semesters typically run 14-16 weeks. We recommend sticking to this range to match your academic cycle.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="mt-16 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-8 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold transition-colors"
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={(step === 2 && formData.interests.length === 0)}
                            className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
                        >
                            Next Step →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || formData.weekly_hours <= 0 || formData.duration_weeks <= 0}
                            className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
                        >
                            {isLoading ? "Saving..." : "Complete Setup →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
