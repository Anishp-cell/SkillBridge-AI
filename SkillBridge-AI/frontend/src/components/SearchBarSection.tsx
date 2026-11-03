"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface QueryItem {
  text: string;
  tag: string;
}

const QUERIES = [
  {
    text: "how to get a software engineering job in 2026 with AI",
    badge: "Market Panic",
    results: [
      { text: "Learn 10+ AI frameworks & DevOps simultaneously", tag: "Overload" },
      { text: "Grind 500 LeetCode problems every semester", tag: "Extreme" },
      { text: "\"Junior SWE is dead, give up now\"", tag: "Panic" },
    ],
  },
  {
    text: "which tech stack should I learn in college to get hired",
    badge: "Conflicting Roadmaps",
    results: [
      { text: "\"Learn MERN! Wait, MERN is dead — learn Rust\"", tag: "Contradiction" },
      { text: "\"Only DSA matters\" vs \"Only full-stack matters\"", tag: "Confusion" },
      { text: "Result: 5 started roadmaps, 0 finished skills", tag: "Paralysis" },
    ],
  },
  {
    text: "how to use my college syllabus to get industry ready for SWE",
    badge: "SkillBridge Match",
  },
];

export default function SearchBarSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { margin: "0px 0px -80px 0px", once: true });

  const [phase, setPhase] = useState<"idle" | "typing" | "results" | "sb_typing" | "sb_done">("idle");
  const [queryIndex, setQueryIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStarted = useRef(false);

  const clearAllTimeouts = () => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
  };

  // Cleanup only on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Auto-flip from College Disconnect (crosses) to SkillBridge Solution (ticks)
  useEffect(() => {
    if (phase === "sb_done" && showResults) {
      setIsFlipped(false);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setIsFlipped(true);
      }, 2600);
    }
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [phase, showResults]);

  const typeQuery = useCallback((qi: number) => {
    clearAllTimeouts();

    // Query 2: Transition to SkillBridge query
    if (qi >= 2) {
      setTypedText("");
      setShowResults(false);
      setQueryIndex(2);
      setPhase("sb_typing");

      const sbQuery = QUERIES[2].text;
      let charIdx = 0;

      const typeCharSb = () => {
        if (charIdx <= sbQuery.length) {
          setTypedText(sbQuery.slice(0, charIdx));
          charIdx++;
          const t = setTimeout(typeCharSb, 26);
          timeouts.current.push(t);
        } else {
          const t1 = setTimeout(() => {
            setShowResults(true);
            setPhase("sb_done");
          }, 250);
          timeouts.current.push(t1);
        }
      };

      typeCharSb();
      return;
    }

    // Queries 0 and 1: Google panic & confusion
    const currentQ = QUERIES[qi];
    setTypedText("");
    setShowResults(false);
    setQueryIndex(qi);
    setPhase("typing");

    let charIdx = 0;
    const typeChar = () => {
      if (charIdx <= currentQ.text.length) {
        setTypedText(currentQ.text.slice(0, charIdx));
        charIdx++;
        const t = setTimeout(typeChar, 28);
        timeouts.current.push(t);
      } else {
        // Show results
        const t1 = setTimeout(() => setShowResults(true), 200);
        // Pause 3 seconds so the student can easily read, then advance to next query
        const t2 = setTimeout(() => {
          setShowResults(false);
          const t3 = setTimeout(() => typeQuery(qi + 1), 350);
          timeouts.current.push(t3);
        }, 3200);
        timeouts.current.push(t1, t2);
      }
    };

    typeChar();
  }, []);

  // Autoplay as soon as the section scrolls into view
  useEffect(() => {
    if (isInView && !hasStarted.current) {
      hasStarted.current = true;
      const t = setTimeout(() => {
        typeQuery(0);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isInView, typeQuery]);

  const handleReplay = () => {
    clearAllTimeouts();
    setIsFlipped(false);
    setTypedText("");
    setShowResults(false);
    setQueryIndex(0);
    typeQuery(0);
  };

  const isSb = phase === "sb_typing" || phase === "sb_done";

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden border-t border-white/5 bg-black">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header (Centered, Clean, No extra boxes) */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
            Lost Between College Lectures{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_18px_rgba(59,130,246,0.3)]">
              and Internet Noise.
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            The problem isn&apos;t what you study in college — it&apos;s that nobody tells you what to focus on from each semester, when to learn it, and how it connects to your goal.
          </p>
        </div>

        {/* Automatic Search Bar (No boxes or timer lines above) */}
        <div className="relative">
          <div
            className={`flex items-center gap-3.5 rounded-2xl border px-5 sm:px-6 py-4.5 mb-5 shadow-2xl transition-all duration-500 min-h-[72px] ${
              isSb
                ? "border-blue-500/50 bg-blue-950/20 shadow-[0_0_35px_rgba(59,130,246,0.18)]"
                : queryIndex === 0 && phase !== "idle"
                ? "border-red-500/30 bg-zinc-950/90 shadow-[0_0_30px_rgba(239,68,68,0.12)]"
                : queryIndex === 1
                ? "border-amber-500/30 bg-zinc-950/90 shadow-[0_0_30px_rgba(245,158,11,0.12)]"
                : "border-white/10 bg-zinc-950/80"
            }`}
          >
            <span className="text-xl flex-shrink-0">🔍</span>

            <div className="flex-1 font-mono text-xs sm:text-sm md:text-base text-zinc-100 flex items-center min-w-0">
              <span className={isSb ? "text-blue-300 font-semibold" : "text-zinc-200"}>
                {typedText}
              </span>
              <span className="inline-block w-1.5 h-4 sm:h-5 ml-1 bg-blue-400 align-middle animate-pulse" />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {isSb ? (
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-blue-500/40 bg-blue-950/50 text-blue-300">
                  SkillBridge Match
                </span>
              ) : (
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                    queryIndex === 0
                      ? "border-red-500/30 bg-red-950/40 text-red-300"
                      : "border-amber-500/30 bg-amber-950/40 text-amber-300"
                  }`}
                >
                  {QUERIES[queryIndex]?.badge || "Google Search"}
                </span>
              )}
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {/* Panic & Confusion Results for Queries 0 & 1 */}
            {showResults && !isSb && (
              <motion.div
                key={`query-${queryIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-2 mb-6"
              >
                {QUERIES[queryIndex]?.results?.map((item: QueryItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-4 sm:px-5 py-3 rounded-xl border text-xs sm:text-sm font-mono flex items-center justify-between gap-3 ${
                      queryIndex === 0
                        ? "border-red-500/20 bg-red-950/20 text-red-300"
                        : "border-amber-500/20 bg-amber-950/20 text-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={queryIndex === 0 ? "text-red-400 font-bold" : "text-amber-400 font-bold"}>
                        ✕
                      </span>
                      <span className="truncate">{item.text}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-white/10 bg-black/50 text-zinc-400 flex-shrink-0">
                      {item.tag}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Final SkillBridge Answer (Query 2) - Sequential Fade (Purple Fades Away, Blue Fades In, No Overlap) */}
            {phase === "sb_done" && showResults && (
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="college-disconnect"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="p-6 sm:p-7 rounded-2xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                    >
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-purple-500/15">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                          <span className="text-purple-300 text-xs font-bold uppercase tracking-wider font-mono">
                            The College Disconnect
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-purple-400/90 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
                          Where Students Get Stuck
                        </span>
                      </div>

                      <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 font-light">
                        <li className="flex items-center gap-3">
                          <span className="text-purple-400 text-sm font-mono font-bold">✕</span>
                          <span>FY, SY, TY subjects scattered without context</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-purple-400 text-sm font-mono font-bold">✕</span>
                          <span>Unsure what matters for your career goal</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-purple-400 text-sm font-mono font-bold">✕</span>
                          <span>Stuck between passing exams or burning out</span>
                        </li>
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skillbridge-solution"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="p-6 sm:p-7 rounded-2xl border border-blue-500/40 bg-blue-950/25 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.18)]"
                    >
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-blue-500/20">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
                          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider font-mono">
                            The SkillBridge Solution
                          </span>
                        </div>
                        <span className="text-emerald-400 text-[11px] font-mono font-semibold bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">
                          ✓ Syllabus Connected
                        </span>
                      </div>

                      <ul className="space-y-3 text-xs sm:text-sm text-zinc-100 font-light">
                        <li className="flex items-center gap-3">
                          <span className="text-blue-400 font-bold text-sm">✓</span>
                          <span>Connects your current semester to your goal</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-blue-400 font-bold text-sm">✓</span>
                          <span>Credits what you study — no starting from zero</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-blue-400 font-bold text-sm">✓</span>
                          <span>Bridges only the missing practical gap</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>

          {/* Replay Button */}
          <div className="flex justify-center items-center min-h-[36px]">
            {phase === "sb_done" && (
              <button
                onClick={handleReplay}
                className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-4 py-2 rounded-full border border-white/5 hover:border-white/20 bg-white/[0.02]"
              >
                <span>↺</span> Replay Search Story
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
