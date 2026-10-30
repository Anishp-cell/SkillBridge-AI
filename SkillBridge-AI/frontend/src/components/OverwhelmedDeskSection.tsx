"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OverwhelmedDeskSection() {
  const [phase, setPhase] = useState(0); // 0=clean, 1..8=chaos stages, 9=clearing
  const [hoveringSB, setHoveringSB] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  // Auto-advance chaos stages every 1.5s when started
  useEffect(() => {
    if (phase === 0 || phase >= 8 || isClearing) return;
    const t = setTimeout(() => setPhase((p) => p + 1), 1400);
    return () => clearTimeout(t);
  }, [phase, isClearing]);

  const handleSBHover = (entering: boolean) => {
    if (phase < 8) return;
    setHoveringSB(entering);
    if (entering) {
      setIsClearing(true);
      setTimeout(() => setCleared(true), 1800);
    }
  };

  const reset = () => { setPhase(0); setHoveringSB(false); setIsClearing(false); setCleared(false); };
  const start = () => setPhase(1);

  const tabs = Math.min(phase * 3, 18);
  const showCan = phase >= 3;
  const showStickies = phase >= 4;
  const showScribbles = phase >= 5;
  const showClock = phase >= 6;
  const showBookmarks = phase >= 7;
  const wobble = phase >= 6 && !isClearing;
  const chaosComplete = phase >= 8;

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 mb-6">
            <span className="text-base">🖥️</span>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">The Overwhelmed Desk</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            It started with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">one tab.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-light max-w-2xl mx-auto">
            Hover the SkillBridge logo on the laptop to clear the chaos.
          </p>
        </motion.div>

        {/* Desk Container */}
        <motion.div
          animate={wobble ? { rotate: [0, -0.4, 0.4, -0.3, 0.3, 0] } : { rotate: 0 }}
          transition={wobble ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
          className="relative w-full max-w-3xl mx-auto"
        >
          {/* Desk surface */}
          <div className="relative bg-zinc-900/60 border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-xl overflow-visible min-h-[480px]">

            {/* ── LAPTOP ── */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] w-72 z-10">
              {/* Screen */}
              <div className="w-full h-44 bg-zinc-950 rounded-t-xl border border-zinc-700 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                {/* Tab bar */}
                <div className="flex items-center gap-[2px] px-2 pt-2 pb-1 bg-zinc-900 overflow-hidden border-b border-zinc-800">
                  {!cleared && Array.from({ length: Math.min(tabs, 12) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: isClearing ? (i < tabs - phase * 0.5 ? "14px" : 0) : "14px", opacity: isClearing && i > tabs - 4 ? 0 : 1 }}
                      transition={{ delay: isClearing ? i * 0.06 : 0, duration: 0.3 }}
                      className={`h-4 rounded-sm flex-shrink-0 ${["bg-blue-600", "bg-red-600", "bg-green-600", "bg-purple-600", "bg-yellow-600"][i % 5]}`}
                    />
                  ))}
                  {cleared && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-4 bg-blue-900/40 rounded-sm text-[8px] text-blue-400 flex items-center px-1 font-mono">
                      SkillBridge Roadmap
                    </motion.div>
                  )}
                </div>

                {/* Screen content */}
                <div className={`absolute inset-x-0 bottom-0 top-9 flex items-center justify-center p-3 transition-all duration-700`}>
                  <AnimatePresence mode="wait">
                    {cleared ? (
                      <motion.div key="sb" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
                        <div className="text-green-400 font-mono text-[10px] space-y-1 text-left px-2">
                          {["→ Week 1: Python Basics", "→ Week 2: Data Structures", "→ Week 3: Build your API"].map((l, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />{l}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : phase === 0 ? (
                      <motion.p key="blank" className="text-zinc-700 text-xs font-mono">...</motion.p>
                    ) : showScribbles ? (
                      <motion.div key="chaos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/50 font-mono text-[9px] text-left space-y-0.5 w-full px-2">
                        {["ERR: Cannot read undefined", "TypeError @ main.js:247", "Promise rejected", "Uncaught ReferenceError", "Stack overflow detected"].slice(0, phase - 3).map((e, i) => (
                          <div key={i}>{e}</div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="working" className="text-zinc-600 text-[9px] font-mono text-center">working...</motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Laptop body */}
              <div className="w-full h-5 bg-zinc-800 rounded-b-lg border border-zinc-700 border-t-0 flex items-center justify-center relative">
                {/* SkillBridge logo on laptop — THE INTERACTIVE TRIGGER */}
                <motion.div
                  onMouseEnter={() => handleSBHover(true)}
                  onMouseLeave={() => handleSBHover(false)}
                  animate={chaosComplete ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                    chaosComplete ? 'text-blue-400 bg-blue-950/80 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-zinc-600 bg-zinc-900 border border-zinc-700'
                  }`}
                >
                  SkillBridge
                </motion.div>
              </div>
              {/* Trackpad */}
              <div className="mx-auto mt-1 w-16 h-9 bg-zinc-800 rounded-lg border border-zinc-700" />
            </div>

            {/* ── NOTEBOOK ── */}
            <motion.div
              animate={{ rotate: showScribbles ? -3 : 0 }}
              className="absolute left-8 bottom-12 w-28 h-36 bg-zinc-100 rounded-lg border border-zinc-300 shadow-lg overflow-hidden"
            >
              <div className="h-6 bg-red-400 w-full" />
              <div className="p-2 space-y-1.5">
                {Array.from({ length: Math.min(phase + 1, 7) }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full ${showScribbles && i > 3 ? 'bg-red-300' : 'bg-zinc-300'}`} style={{ width: `${60 + (i * 11) % 40}%` }} />
                ))}
              </div>
            </motion.div>

            {/* ── PENCIL ── */}
            <motion.div animate={{ rotate: showScribbles ? 45 : -10 }} className="absolute left-[160px] bottom-14 text-3xl select-none">✏️</motion.div>

            {/* ── STICKY NOTES ── */}
            <AnimatePresence>
              {showStickies && !cleared && [
                { text: "google this...", color: "bg-yellow-200", pos: "right-8 top-8", rot: 5 },
                { text: "read docs later", color: "bg-pink-200", pos: "right-28 top-16", rot: -7 },
                { text: "???", color: "bg-green-200", pos: "right-12 top-36", rot: 3 },
                { text: "ask on reddit", color: "bg-blue-200", pos: "left-44 top-6", rot: -4 },
              ].filter((_, i) => i < phase - 3).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: isClearing ? 0 : 1, y: isClearing ? -40 : 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ delay: isClearing ? i * 0.15 : 0 }}
                  className={`absolute ${s.pos} ${s.color} text-zinc-700 text-[9px] font-bold px-2 py-2 rounded shadow-md w-20 z-20`}
                  style={{ transform: `rotate(${s.rot}deg)` }}
                >
                  {s.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ── ENERGY DRINK ── */}
            <AnimatePresence>
              {showCan && !cleared && (
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                  className="absolute right-6 bottom-10 text-4xl select-none z-20">🥤</motion.div>
              )}
            </AnimatePresence>

            {/* ── CLOCK ── */}
            <AnimatePresence>
              {showClock && !cleared && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-red-500/30 rounded-xl px-4 py-2 z-20 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <span className="text-red-400 text-sm">🕑</span>
                  <span className="text-red-400 font-mono text-sm font-bold">2:17 AM</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── BOOKMARKS overflow ── */}
            <AnimatePresence>
              {showBookmarks && !cleared && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="absolute left-4 top-4 flex flex-col gap-1 z-20">
                  {["📌 Python docs", "📌 MDN Web Docs", "📌 Stack Overflow", "📌 roadmap.sh", "📌 CS50 lectures"].slice(0, phase - 6).map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="text-[9px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 whitespace-nowrap">
                      {b}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cleared state — single roadmap doc */}
            <AnimatePresence>
              {cleared && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                  className="absolute left-8 bottom-10 w-36 bg-blue-950/60 border border-blue-500/30 rounded-xl p-3 shadow-[0_0_20px_rgba(59,130,246,0.2)] z-20">
                  <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mb-2">Roadmap.pdf</p>
                  <div className="space-y-1">
                    {["Week 1", "Week 2", "Week 3"].map((w, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <div className="h-1 flex-1 bg-blue-400/30 rounded-full" />
                        <span className="text-[8px] text-blue-300 font-mono">{w}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs count badge */}
          {phase > 0 && !cleared && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`absolute -top-4 -right-4 px-4 py-2 rounded-full font-mono text-xs font-bold shadow-xl ${tabs >= 12 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
              {tabs} tabs open
            </motion.div>
          )}
        </motion.div>

        {/* CTAs */}
        <div className="flex justify-center mt-10 gap-4">
          {phase === 0 && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={start}
              className="px-8 py-3 bg-white text-black font-black rounded-full text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              "I'll just open one tab..."
            </motion.button>
          )}
          {chaosComplete && !cleared && !isClearing && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-zinc-500 text-sm font-mono text-center">
              ↑ Hover the <span className="text-blue-400">SkillBridge</span> logo on the laptop to clear this.
            </motion.p>
          )}
          {cleared && (
            <div className="flex flex-col items-center gap-3">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-mono text-sm">One clean roadmap. Zero chaos.</motion.p>
              <button onClick={reset} className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors font-mono">↺ replay</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
