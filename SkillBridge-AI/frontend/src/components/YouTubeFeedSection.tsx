"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_CARDS = [
  { id: 1, title: "Python Full Course for Beginners", channel: "Tech World", duration: "4:32:11", views: "12M views", thumb: "🐍" },
  { id: 2, title: "JavaScript in 100 Seconds", channel: "Fireship", duration: "1:40", views: "8M views", thumb: "⚡" },
  { id: 3, title: "Learn React – Full Tutorial", channel: "freeCodeCamp", duration: "11:57:09", views: "5M views", thumb: "⚛️" },
  { id: 4, title: "CS50: Introduction to Computer Science", channel: "Harvard", duration: "25:22:00", views: "3M views", thumb: "🎓" },
];

const WAIT_CARDS = [
  { id: 10, title: "Watch this BEFORE Python", channel: "CodeWithMe", duration: "45:12", thumb: "⚠️" },
  { id: 11, title: "Actually learn THIS language first", channel: "DevTips", duration: "22:08", thumb: "🔥" },
  { id: 12, title: "Stop learning Python (watch this)", channel: "TechBro", duration: "18:44", thumb: "🛑" },
  { id: 13, title: "The ONLY roadmap you need", channel: "Guru9000", duration: "1:02:17", thumb: "🗺️" },
  { id: 14, title: "Why I wasted 2 years learning wrong", channel: "RegretDev", duration: "33:01", thumb: "😩" },
  { id: 15, title: "Watch this BEFORE any tutorial", channel: "MetaTech", duration: "12:55", thumb: "🔄" },
];

export default function YouTubeFeedSection() {
  const [elapsed, setElapsed] = useState(0); // seconds
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [extraCards, setExtraCards] = useState<typeof WAIT_CARDS>([]);
  const [decided, setDecided] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [skipChaos, setSkipChaos] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start timer on first hover
  useEffect(() => {
    if (hoveredId !== null && !decided && !showOverlay) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      }
    }
  }, [hoveredId, decided, showOverlay]);

  // Trigger overlay at 15 real seconds
  useEffect(() => {
    if (elapsed >= 15 && !decided) {
      if (timerRef.current) clearInterval(timerRef.current);
      setShowOverlay(true);
    }
  }, [elapsed, decided]);

  const handleHover = (id: number) => {
    if (decided || showOverlay) return;
    setHoveredId(id);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      const available = WAIT_CARDS.filter(c => c.id > 12 ? extraCards.length > 2 : true);
      const toAdd = available.slice(0, 3).filter(c => !extraCards.find(e => e.id === c.id));
      if (toAdd.length > 0) setExtraCards(prev => [...prev.slice(-3), ...toAdd].slice(-6));
    }, 400);
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const displayTime = `${mins}m ${secs.toString().padStart(2, "0")}s`;

  const reset = () => {
    setElapsed(0); setHoveredId(null); setExtraCards([]); setDecided(false); setShowOverlay(false); setSkipChaos(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 mb-6">
            <span className="text-base">▶️</span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-[0.2em]">Decision Paralysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Just pick <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">one tutorial.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">Go on. It's easy. Just click one and start.</p>
        </motion.div>

        <div className="relative">
          {/* Timer */}
          {elapsed > 0 && !skipChaos && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-14 right-0 flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-full px-5 py-2">
              <span className={`w-2 h-2 rounded-full ${elapsed > 10 ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
              <span className="text-xs font-mono text-zinc-300 tracking-widest">Deciding: {displayTime}</span>
            </motion.div>
          )}

          {/* Card Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${showOverlay && !skipChaos ? 'blur-md opacity-30' : ''}`}>
            {[...BASE_CARDS, ...extraCards].slice(0, 8).map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onMouseEnter={() => handleHover(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 group ${
                  hoveredId === card.id ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10'
                } bg-zinc-900/60 backdrop-blur-sm`}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-zinc-800 flex items-center justify-center text-4xl relative">
                  {card.thumb}
                  {hoveredId === card.id && card.id <= 4 && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-red-950/80 flex items-center justify-center"
                    >
                      <span className="text-red-300 text-xs font-bold text-center px-2">Wait, watch this first →</span>
                    </motion.div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-xs font-semibold leading-tight mb-1 line-clamp-2">{card.title}</p>
                  <p className="text-zinc-500 text-[10px]">{card.channel} · {(card as any).views ?? "wait, watch this first"}</p>
                  <p className="text-zinc-600 text-[10px]">{card.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overlay at 15s */}
          <AnimatePresence>
            {showOverlay && !skipChaos && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-black text-white text-center mb-6 leading-tight"
                >
                  Most students<br /><span className="text-red-400">never even start.</span>
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSkipChaos(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black rounded-full text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  Skip the chaos →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SkillBridge path */}
          <AnimatePresence>
            {skipChaos && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col items-center">
                <p className="text-zinc-400 text-sm mb-6 font-mono tracking-widest uppercase">No choices. Just the next step.</p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full max-w-lg bg-black border-2 border-blue-500/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.25)] cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Next up on your roadmap</span>
                  </div>
                  <h3 className="text-white text-2xl font-black mb-2">Week 1: Python Fundamentals</h3>
                  <p className="text-zinc-400 text-sm font-mono">Based on your syllabus · Est. 3 hrs · No prior knowledge needed</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: "0%" }} />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">Start →</span>
                  </div>
                </motion.div>
                <button onClick={reset} className="mt-6 text-zinc-600 text-xs hover:text-zinc-400 transition-colors font-mono">↺ replay chaos</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
