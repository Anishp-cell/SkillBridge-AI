"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const professorLines = [
  "Polymorphism enables objects of different types to be treated uniformly.",
  "Encapsulation hides internal state and requires interaction via methods.",
  "Inheritance allows a class to acquire properties of another class.",
  "Abstraction exposes only essential features of an object.",
  "Design patterns provide reusable solutions to common problems.",
  "SOLID principles guide maintainable object-oriented design.",
];

const tutorialLines = [
  "Just think of polymorphism like a shape-shifter, LOL.",
  "Encapsulation = put stuff in a box and lock it.",
  "Inheritance is when the child class 'inherits' from mom class.",
  "Abstraction is basically... hiding stuff? Subscribe for part 2!",
  "We'll look at Design Patterns in the NEXT video → link below!",
  "SOLID? We'll cover that once you know the basics. Smash that like!",
];

const studentLines = [
  "poly... morphism? Is that Greek??",
  "encaps... encapsu... cap-su-la-tion ???",
  "ok so the child is the parent but also not?????",
  "abstract... meaning... not concrete... ???",
  "🌀🌀🌀 help 🌀🌀🌀",
  "why why why why why why",
];

const clearedLines = [
  "Polymorphism → one method, many behaviors.",
  "Encapsulation → bundle data + methods together.",
  "Inheritance → reuse parent class logic.",
  "Abstraction → expose only what's needed.",
  "Design Patterns → tried & tested solutions.",
  "SOLID Principles → clean code fundamentals.",
];

const LINE_DELAY = 800;

export default function NotebookSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (visibleLines >= professorLines.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY);
    return () => clearTimeout(t);
  }, [visibleLines, started]);

  const allFilled = visibleLines >= professorLines.length;

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-grid opacity-[0.015] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-base">📓</span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">The Notebook</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            What you <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">actually understood</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            Three columns. Two filled with confidence. One filled with despair.
          </p>
        </motion.div>

        {/* Notebook */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          {/* Notebook header */}
          <div className="grid grid-cols-3 border-b border-white/10">
            {["📖 Professor Said", "📺 Tutorial Said", cleared ? "✅ SkillBridge Understands" : "🧠 Student Understood"].map((col, i) => (
              <div
                key={i}
                className={`p-4 text-center text-xs font-bold uppercase tracking-[0.2em] border-r border-white/10 last:border-r-0 ${
                  i === 0 ? "text-blue-400" : i === 1 ? "text-purple-400" : cleared ? "text-green-400" : "text-red-400"
                }`}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Notebook lines */}
          <div className="grid grid-cols-3 min-h-[360px]">
            {/* Prof column */}
            <div className="border-r border-white/10 p-6 font-mono text-sm text-zinc-300 space-y-4">
              {professorLines.slice(0, visibleLines).map((line, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="leading-relaxed border-b border-white/5 pb-3">
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Tutorial column */}
            <div className="border-r border-white/10 p-6 font-mono text-sm text-zinc-300 space-y-4">
              {tutorialLines.slice(0, visibleLines).map((line, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="leading-relaxed border-b border-white/5 pb-3 text-purple-300/80">
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Student column */}
            <div className="p-6 font-mono text-sm space-y-4 relative">
              <AnimatePresence mode="wait">
                {!cleared ? (
                  <motion.div key="chaos" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {studentLines.slice(0, visibleLines).map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, rotate: (Math.random() - 0.5) * 4 }}
                        animate={{ opacity: 1, rotate: (Math.random() - 0.5) * 3 }}
                        className="leading-relaxed border-b border-red-900/30 pb-3 text-red-400/90"
                        style={{ transform: `rotate(${(i % 3 - 1) * 1.5}deg)` }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="clear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {clearedLines.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="leading-relaxed border-b border-green-900/30 pb-3 text-green-400"
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 flex items-center justify-center gap-4">
            {!started ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setStarted(true); setVisibleLines(1); }}
                className="px-8 py-3 bg-white text-black font-black rounded-full text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                Open Notebook
              </motion.button>
            ) : allFilled && !cleared ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCleared(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black rounded-full text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all"
              >
                Let SkillBridge Rewrite Column 3
              </motion.button>
            ) : cleared ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => { setCleared(false); setVisibleLines(0); setStarted(false); }}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/10"
              >
                Reset
              </motion.button>
            ) : (
              <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase animate-pulse">Writing...</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
