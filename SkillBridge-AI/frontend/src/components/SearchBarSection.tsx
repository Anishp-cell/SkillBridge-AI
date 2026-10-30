"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const QUERIES = [
  { text: "how to learn programming", speed: 60 },
  { text: "best programming language for beginners", speed: 50 },
  { text: "python vs javascript 2024", speed: 45 },
  { text: "is coding even worth it", speed: 35 },
  { text: "why am I so behind everyone else", speed: 25 },
];

const RESULTS: Record<number, string[]> = {
  0: ["r/learnprogramming • Start with Python or JS", "freeCodeCamp – Full Curriculum", "roadmap.sh – Developer Roadmaps", "Coursera – CS for Everyone"],
  1: ["Python is great for beginners! But wait...", "Actually, JavaScript is essential...", "No, start with C to understand memory...", "Scratch is the real beginner language..."],
  2: ["Python vs JS: The Ultimate 2024 Guide", "Why I switched from Python to JS", "Why I switched from JS to Python", "Both are wrong, learn TypeScript first"],
  3: ["YES: 5 reasons coding is the future", "NO: AI will replace all programmers by 2025", "MAYBE: It depends on your context", "HARD TRUTH: Most people quit after week 2"],
  4: ["You're NOT behind. Here's why...", "Actually, you might be. Here's the truth.", "Everyone feels behind. But you especially.", "This is a sign you need to understand more"],
};

const SB_ROADMAP_LINES = ["1. Python Fundamentals (Week 1–2)", "2. Data Structures (Week 3–4)", "3. Backend with FastAPI (Week 5–6)", "4. Databases + SQL (Week 7)", "5. Final Project + Portfolio (Week 8)"];

export default function SearchBarSection() {
  const [phase, setPhase] = useState<"idle" | "typing" | "sb" | "done">("idle");
  const [queryIndex, setQueryIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [sbLine, setSbLine] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20% 0px" });

  const clear = () => timeouts.current.forEach(clearTimeout);

  const typeQuery = useCallback((qi: number) => {
    if (qi >= QUERIES.length) {
      // Transition to SkillBridge
      const t = setTimeout(() => {
        setTypedText("");
        setShowResults(false);
        setQueryIndex(-1);
        setPhase("sb");
        const sbQ = "your syllabus + your goal";
        let i = 0;
        const typeCharSb = () => {
          if (i <= sbQ.length) {
            setTypedText(sbQ.slice(0, i));
            i++;
            const t2 = setTimeout(typeCharSb, 40);
            timeouts.current.push(t2);
          } else {
            const t3 = setTimeout(() => { setShowResults(true); setPhase("done"); }, 600);
            timeouts.current.push(t3);
          }
        };
        typeCharSb();
      }, 800);
      timeouts.current.push(t);
      return;
    }

    const q = QUERIES[qi];
    setTypedText("");
    setShowResults(false);
    setQueryIndex(qi);

    let i = 0;
    const typeChar = () => {
      if (i <= q.text.length) {
        setTypedText(q.text.slice(0, i));
        i++;
        const t = setTimeout(typeChar, q.speed);
        timeouts.current.push(t);
      } else {
        // Show results, pause, then next
        const t1 = setTimeout(() => setShowResults(true), 200);
        const t2 = setTimeout(() => {
          setShowResults(false);
          const t3 = setTimeout(() => typeQuery(qi + 1), 300);
          timeouts.current.push(t3);
        }, 1800);
        timeouts.current.push(t1, t2);
      }
    };
    typeChar();
  }, []);

  const start = useCallback(() => { clear(); setPhase("typing"); typeQuery(0); }, [typeQuery]);
  const reset = () => { clear(); setTypedText(""); setShowResults(false); setQueryIndex(0); setSbLine(0); start(); };

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => {
        start();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isInView, start]);

  const isChaos = phase === "typing";
  const isSb = phase === "sb" || phase === "done";

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6">
            <span className="text-base">🔍</span>
            <span className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">The Search That Never Ends</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            One search leads to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">despair.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light">Watch a student's search history spiral into existential crisis.</p>
        </motion.div>

        {/* Search UI */}
        <div className="relative">
          {/* Search Bar */}
          <div className={`flex items-center gap-3 rounded-2xl border px-6 py-4 mb-6 shadow-2xl transition-all duration-500 ${isSb ? 'border-blue-500/50 bg-blue-950/20 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-zinc-950/80'}`}>
            <span className="text-xl">{isSb ? "🔵" : "🔍"}</span>
            <span className={`flex-1 font-mono text-lg tracking-wide min-h-[1.5rem] ${isSb ? "text-blue-300" : isChaos && queryIndex >= 3 ? "text-red-400" : "text-white"}`}>
              {typedText}
              {(phase === "typing" || phase === "sb") && <span className="animate-pulse">|</span>}
            </span>
            {isSb && phase === "sb" && <span className="text-blue-400 text-sm font-mono animate-pulse">Searching...</span>}
            {phase === "done" && <span className="text-green-400 text-sm font-mono">✓ Found</span>}
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {showResults && phase !== "done" && (
              <motion.div key={queryIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 mb-6">
                {(RESULTS[queryIndex] ?? []).map((r, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className={`px-5 py-3 rounded-xl border border-white/5 text-sm font-mono ${queryIndex >= 3 ? "text-red-400/80 bg-red-950/10" : "text-zinc-400 bg-zinc-900/40"}`}
                  >
                    {r}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* SkillBridge Result */}
            {phase === "done" && showResults && (
              <motion.div key="sb-result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-blue-500/40 bg-blue-950/20 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">SkillBridge — Your Personalized Roadmap</span>
                </div>
                <div className="space-y-3">
                  {SB_ROADMAP_LINES.map((line, i) => (
                    <motion.div
                      key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-4 text-sm text-white font-mono"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      {line}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="flex justify-center mt-8 gap-4 min-h-[48px]">
            {phase === "done" && (
              <button onClick={reset} className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors font-mono">↺ replay</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
