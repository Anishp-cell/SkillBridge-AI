"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBarSection() {
  const [activeTab, setActiveTab] = useState<"generic" | "skillbridge">("generic");
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-switch between tabs every 7 seconds unless the user clicks
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "generic" ? "skillbridge" : "generic"));
    }, 7000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleTabClick = (tab: "generic" | "skillbridge") => {
    setAutoPlay(false);
    setActiveTab(tab);
  };

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5 bg-black">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-5 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <span className="text-sm">🔍</span>
            <span className="text-purple-400 text-xs font-mono font-bold uppercase tracking-[0.2em]">
              The Search Dilemma
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Stop Asking the Internet.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Ask Your Syllabus.
            </span>
          </h2>

          <p className="text-zinc-400 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Generic internet advice gives you 100 conflicting opinions. SkillBridge uses what you're already learning in college to build a personalized bridge to industry.
          </p>
        </div>

        {/* Interactive Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
            <button
              onClick={() => handleTabClick("generic")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "generic"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>🌐</span>
              <span>1. Normal Internet Search</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                Panic
              </span>
            </button>

            <button
              onClick={() => handleTabClick("skillbridge")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "skillbridge"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>⚡</span>
              <span>2. SkillBridge AI Search</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40">
                Clarity
              </span>
            </button>
          </div>
        </div>

        {/* Animated Container */}
        <AnimatePresence mode="wait">
          {activeTab === "generic" ? (
            <motion.div
              key="generic"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Fake Google Search Input */}
              <div className="rounded-2xl border border-red-500/30 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl flex items-center gap-4">
                <span className="text-xl">🔍</span>
                <div className="flex-1 font-mono text-sm md:text-base text-red-300">
                  how to become a software engineer from college in 2026?
                </div>
                <span className="text-xs font-mono text-zinc-500 hidden sm:inline">2,410,000 results</span>
              </div>

              {/* Confusing Generic Results */}
              <div className="space-y-3">
                {[
                  {
                    source: "Reddit r/csMajors",
                    badge: "Contradiction",
                    text: "You must grind 500 LeetCode hards, master 4 frameworks, and have 3 unpaid internships before sophomore year or you're doomed.",
                    color: "border-red-500/20 bg-red-950/15 text-red-300",
                  },
                  {
                    source: "YouTube Tech Influencer",
                    badge: "Hype / Panic",
                    text: "Why Python is DEAD in 2026! Stop learning your college coursework right now and switch to Rust & Mojo immediately.",
                    color: "border-orange-500/20 bg-orange-950/15 text-orange-300",
                  },
                  {
                    source: "Tech Medium Post",
                    badge: "Overwhelm",
                    text: "The 2026 Ultimate Guide: Learn React, Next.js, Angular, Svelte, Vue, Node, Go, Rust, AWS, GCP, and Kubernetes simultaneously.",
                    color: "border-amber-500/20 bg-amber-950/15 text-amber-300",
                  },
                  {
                    source: "Twitter / X Post",
                    badge: "Existential",
                    text: "AI is already writing 95% of software. If you're studying computer science in college, drop out and do something else.",
                    color: "border-red-500/20 bg-red-950/15 text-red-300",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-4 rounded-xl border ${item.color} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-zinc-400">{item.source}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-red-500/30 bg-red-950/40 text-red-400">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-zinc-300 font-light">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Generic Footer Alert */}
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-center text-xs md:text-sm font-mono text-red-400">
                ⚠️ <span className="font-bold">The Problem:</span> 0% aware of your university syllabus. 100% generic noise. Leaves you feeling behind before you even start.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="skillbridge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* SkillBridge Intelligent Search Bar */}
              <div className="rounded-2xl border border-blue-500/50 bg-blue-950/30 p-5 shadow-[0_0_35px_rgba(59,130,246,0.2)] backdrop-blur-xl flex items-center gap-4">
                <span className="text-xl">⚡</span>
                <div className="flex-1 font-mono text-sm md:text-base text-blue-300">
                  <span className="text-white font-bold">University Syllabus PDF (Sem 4)</span> + Target:{" "}
                  <span className="text-sky-400 font-bold">Software Engineer</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ✓ Gap Calculated
                </span>
              </div>

              {/* Two Column Intelligent Breakdown */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* College Knowledge */}
                <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-950/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                      Already in Your Syllabus (55%)
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">No Restarting</span>
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> OOP & Inheritance (CS102)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Relational DBMS & SQL (CS204)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Data Structures & Algorithms (CS201)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Computer Networks & Sockets (CS301)
                    </li>
                  </ul>
                </div>

                {/* Missing Gap */}
                <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                      Industry Gap to Bridge (45%)
                    </span>
                    <span className="text-xs font-mono text-purple-400 font-bold">SkillBridge Target</span>
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">⚡</span> Production REST APIs & FastAPI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">⚡</span> Docker Containerization & Microservices
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">⚡</span> Automated CI/CD & GitHub Testing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">⚡</span> Full-Stack Project Portfolio
                    </li>
                  </ul>
                </div>
              </div>

              {/* 8-Week Personalized Roadmap Card */}
              <div className="p-6 rounded-2xl border border-blue-500/30 bg-zinc-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                    Your Tailored 8-Week Blueprint
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Weeks 1–2:</span>
                    <p className="text-zinc-300">Connect College OOP & DBMS to live REST API endpoints.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Weeks 3–4:</span>
                    <p className="text-zinc-300">Build production CRUD backend with JWT authentication.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Weeks 5–6:</span>
                    <p className="text-zinc-300">Containerize your app with Docker and deploy to Cloud Run.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Weeks 7–8:</span>
                    <p className="text-zinc-300">Sync with Google Sheets, optimize ATS resume, and mock test.</p>
                  </div>
                </div>
              </div>

              {/* SkillBridge Footer Alert */}
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/30 text-center text-xs md:text-sm font-mono text-blue-300">
                ✨ <span className="font-bold">The Difference:</span> We credit you for what you already studied in college. No restarting from zero. Just close the missing gap.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
