"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import CareerPathMotion from "@/components/CareerPathMotion";
import SearchBarSection from "@/components/SearchBarSection";
import HeroFlashlightBg from "@/components/HeroFlashlightBg";
import "./homepage.css";

const AccuracyBar = () => {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mt-5 bg-zinc-800/60 rounded-xl p-5 border border-white/5">
      <div className="flex justify-between text-xs font-mono text-zinc-400 mb-3 uppercase tracking-widest">
        <span>Avg. Accuracy Score</span>
        <motion.span animate={{ opacity: filled ? 1 : 0 }} className="text-blue-400 font-black">
          94%
        </motion.span>
      </div>
      <div className="h-2.5 w-full bg-zinc-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: filled ? "94%" : 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <p className="text-zinc-500 text-xs mt-3 font-mono">Based on internal benchmark across 2,400+ engineering syllabi.</p>
    </div>
  );
};

const FAQItem = ({
  question,
  tag,
  tagColor,
  borderColor,
  children,
}: {
  question: string;
  tag?: string;
  tagColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? `border-l-2 ${borderColor ?? "border-l-blue-500"} border-t border-r border-b border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.08)] bg-zinc-900/60`
          : "border border-white/5 bg-zinc-900/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-7 flex justify-between items-center gap-4 text-left cursor-default"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-lg text-white">{question}</span>
          {tag && (
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${tagColor}`}>
              {tag}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-blue-500 flex-shrink-0 text-xl leading-none"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-7 pb-7 border-t border-white/5 pt-5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Home() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const line1Words = ["Bridge", "the", "Gap."];
  const line2Words = ["Build", "Your", "Future."];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container min-h-screen selection:bg-blue-500/30 bg-black text-white relative">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="glow-blob top-[-10%] left-[-5%] opacity-30" />
        <div
          className="glow-blob bottom-[10%] right-[-5%] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Unified Floating Navbar (3-piece symmetrical layout: Logo Capsule | Main Dock | Action Capsule) */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-5 left-0 right-0 z-50 flex items-center justify-center px-4 md:px-8 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-center gap-4 sm:gap-8 md:gap-14 lg:gap-20 max-w-7xl">
          {/* Outside Left: Logo Placeholder Capsule (Exact same size & height as Bridge Now, shifted ~3 fingers left) */}
          <Link href="/" className="flex items-center group/logo flex-shrink-0" title="Home">
            <div className="relative h-[48px] w-[120px] sm:w-[150px] px-3.5 sm:px-4 rounded-full bg-gradient-to-br from-blue-500/10 via-white/[0.04] to-indigo-500/10 border border-blue-400/30 flex items-center justify-center shadow-[inset_0_0_12px_rgba(59,130,246,0.15),0_0_15px_rgba(59,130,246,0.2)] group-hover/logo:border-blue-400/70 group-hover/logo:shadow-[0_0_24px_rgba(59,130,246,0.45)] transition-all">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto max-h-[30px] object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                }}
              />
              {/* Fallback geometric bridge icon + label if logo.png not yet placed */}
              <div className="flex items-center gap-2 text-blue-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5" cy="12" r="2.5" />
                  <circle cx="19" cy="12" r="2.5" />
                  <path d="M7.5 12h9" strokeDasharray="2 2" className="animate-pulse" />
                  <path d="M5 8c2.5-3 5.5-4 7-4s4.5 1 7 4" opacity="0.8" />
                </svg>
                <span className="text-xs font-mono text-blue-300/90 font-bold uppercase tracking-wider">Logo</span>
              </div>
            </div>
          </Link>

          {/* Center: The Navbar Dock (SkillBridge AI + Nav Links, ends cleanly after FAQ) */}
          <div className="relative group">
            {/* Subtle Ambient Electric Glow Aura behind the dock */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-600/30 via-sky-500/20 to-indigo-600/30 blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500 -z-10" />

            <nav className="h-[48px] rounded-full bg-[#070a12]/90 backdrop-blur-2xl border border-white/[0.16] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(59,130,246,0.15)] px-4 sm:px-6 flex items-center gap-3 sm:gap-5 md:gap-6 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(59,130,246,0.28)] relative overflow-hidden">
              {/* Ambient top hairline glow highlight */}
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none" />

              {/* Inside Dock: Brand Name Wordmark */}
              <Link
                href="/"
                className="flex items-center group/brand flex-shrink-0 transition-transform duration-200 hover:scale-105"
                title="SkillBridge AI"
              >
                <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white group-hover/brand:text-zinc-100 transition-colors whitespace-nowrap">
                  SkillBridge{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_14px_rgba(96,165,250,0.55)]">
                    AI
                  </span>
                </span>
              </Link>

              {/* Inside Dock: Subtle Divider */}
              <div className="hidden md:block h-4 w-[1px] bg-white/10" />

              {/* Inside Dock: Nav Links in exact site order (ends after FAQ) */}
              <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full p-1 shadow-inner">
                {[
                  { name: "The Dilemma", href: "#the-dilemma" },
                  { name: "The AI Bridge", href: "#neural-bridge" },
                  { name: "How It Works", href: "#how-it-works" },
                  { name: "FAQ", href: "#faq" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-3.5 py-1.5 rounded-full text-xs md:text-[13px] font-semibold text-zinc-300 hover:text-white transition-all duration-200 hover:bg-blue-500/10 hover:border hover:border-blue-500/25 hover:shadow-[0_0_14px_rgba(59,130,246,0.3)]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Outside Right: Action Button Capsule (Exact same size & height as Logo, shifted ~3 fingers right) */}
          <div className="flex items-center flex-shrink-0">
            {user ? (
              <Link
                href="/dashboard"
                className="relative group/btn inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.65)] h-[48px] w-[120px] sm:w-[150px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 rounded-full opacity-80 group-hover/btn:opacity-100 transition-opacity" />
                <span className="relative h-full w-full rounded-full bg-blue-600/90 text-white flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-xl group-hover/btn:bg-blue-500/90 transition-colors">
                  <span>Dashboard</span>
                  <span className="group-hover/btn:translate-x-0.5 transition-transform duration-200">→</span>
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="relative group/btn inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_22px_rgba(59,130,246,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.7)] h-[48px] w-[120px] sm:w-[150px]"
                title="Start bridging your college syllabus"
              >
                {/* Luminous ambient gradient border ring */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-300 to-indigo-500 rounded-full opacity-85 group-hover/btn:opacity-100 blur-[1px] transition-opacity" />

                {/* Inner dark glass button surface with light shimmer reflection on hover */}
                <span className="relative h-full w-full rounded-full bg-[#080c16]/95 text-white flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-xl group-hover/btn:bg-[#0d1424] transition-colors overflow-hidden">
                  {/* Shimmer light beam sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform ease-out pointer-events-none" />

                  <span>Bridge Now</span>
                  <svg
                    className="w-3.5 h-3.5 text-blue-400 group-hover/btn:translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Interactive Flashlight Background */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <HeroFlashlightBg />

        <div className="relative z-10 pt-20 md:pt-24 max-w-5xl mx-auto flex flex-col items-center">
          {/* 1. Main Title - First thing you see on load (Balanced scale with navbar) */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] lg:text-[76px] font-extrabold tracking-tight mb-8 leading-[1.1]">
            {/* Line 1: Bridge the Gap. (starts at 0.1s) */}
            <div className="flex flex-wrap justify-center overflow-hidden">
              {line1Words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.1 + i * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 2: Build Your Future. (starts after line 1 completes) */}
            <div className="flex flex-wrap justify-center overflow-hidden">
              <span className="text-gradient">
                {line2Words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.85 + i * 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block mr-[0.22em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </div>
          </h1>

          {/* 2. Subtext & Tag - Appears AFTER both lines finish their transition */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          >
            <span className="text-xs font-mono text-blue-300 font-semibold">
              🏆 Google GDG TechSprint 1st Place Winner
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            AI-powered career roadmaps that turn your university syllabus into a professional edge.
            Stop restarting from scratch—bridge what's missing.
          </motion.p>

          {/* 3. Action Buttons - Appear right after subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.95, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <Link
              href="/login"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"
            >
              Scan Your Syllabus Free →
            </Link>
            <Link
              href="#neural-bridge"
              className="px-7 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-full font-semibold text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
            >
              See How It Connects
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none"
        >
          <div className="w-5 h-9 border-2 border-white/20 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-blue-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Main Sections */}
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section 1: The Search Dilemma vs SkillBridge AI */}
        <div id="the-dilemma">
          <SearchBarSection />
        </div>

        {/* Section 2: The Neural Brain & Career Path Mapping */}
        <div id="neural-bridge" className="py-12">
          <CareerPathMotion />
        </div>

        {/* Section 3: How It Works */}
        <section id="how-it-works" className="py-28 scroll-mt-28 border-t border-white/5">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 mb-4">
              <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-[0.2em]">
                Three Step Flow
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
              From university PDF to hiring-ready portfolio in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Define Target Domain",
                desc: "Choose or get recommended career roles based on your genuine interests and target industry jobs.",
                badge: "Goal Alignment",
              },
              {
                step: "02",
                title: "Upload Syllabus PDF",
                desc: "Our AI scans your university coursework, extracting topics and calculating the exact skill gap without restarting.",
                badge: "Intelligent Extraction",
              },
              {
                step: "03",
                title: "Execute Roadmap",
                desc: "Follow weekly curated milestones with top-rated YouTube resources, project guides, and Google Sheets sync.",
                badge: "Personalized Bridge",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`glass-card p-8 rounded-3xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${
                  activeStep === i
                    ? "border-blue-400 shadow-[0_0_35px_rgba(96,165,250,0.3)] bg-blue-500/10 scale-105"
                    : "border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-blue-500/30 font-mono">{s.step}</span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{s.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 4: FAQ Section */}
        <section id="faq" className="py-28 scroll-mt-28 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Got Questions About <span className="text-blue-500">SkillBridge?</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg">Everything you need to know about the platform.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem question="How accurate is the AI syllabus scanning?" borderColor="border-l-blue-500">
              <p className="text-zinc-400 leading-relaxed text-sm">
                Our parser combines PyMuPDF semantic extraction with Gemini Pro intelligence, achieving a 94% accuracy score across 2,400+ engineering curriculum standards (SPPU, Mumbai, VTU, AKTU, and autonomous universities).
              </p>
              <AccuracyBar />
            </FAQItem>

            <FAQItem
              question="Is SkillBridge AI free for students?"
              tag="Most Asked"
              tagColor="bg-green-500/15 text-green-400 border border-green-500/20"
              borderColor="border-l-green-500"
            >
              <p className="text-zinc-400 leading-relaxed text-sm">
                Yes — core syllabus intelligence, career domain recommendation, and personalized weekly roadmap generation are completely{" "}
                <span className="text-blue-400 font-bold">free</span> for college students. No credit card required.
              </p>
            </FAQItem>

            <FAQItem question="What formats can I upload my syllabus in?" borderColor="border-l-purple-500">
              <p className="text-zinc-400 leading-relaxed text-sm mb-4">
                We natively support PDF documents as they are the official standard for university syllabi and course outlines.
              </p>
              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border border-red-500/30 rounded-xl">
                  <span className="text-red-300 text-xs font-bold">PDF</span>
                  <span className="text-green-400 text-[10px] font-mono">✓ Active</span>
                </div>
                {["DOCX", "Image Scan", "Google Docs"].map((fmt) => (
                  <div key={fmt} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/40 border border-zinc-700/40 rounded-xl opacity-50">
                    <span className="text-zinc-400 text-xs font-bold">{fmt}</span>
                    <span className="text-[8px] bg-zinc-700 text-zinc-400 px-1 py-0.2 rounded font-bold uppercase">soon</span>
                  </div>
                ))}
              </div>
            </FAQItem>

            <FAQItem question="Can I export my roadmap to other tools?" borderColor="border-l-amber-500">
              <p className="text-zinc-400 leading-relaxed text-sm mb-4">
                Yes! You can export your personalized week-by-week roadmap directly to Google Sheets with one click to track checkboxes, study links, and hours.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-green-950/40 border border-green-600/30 rounded-full text-green-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Google Sheets
                </span>
                {["Notion", "Trello", "Obsidian"].map((p) => (
                  <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700/40 bg-zinc-900/40 rounded-full text-xs font-bold text-zinc-500 opacity-60">
                    {p}
                    <span className="text-[8px] bg-white/10 px-1 py-0.2 rounded uppercase">soon</span>
                  </span>
                ))}
              </div>
            </FAQItem>

            <div className="text-center pt-6">
              <Link
                href="/login"
                className="text-zinc-400 text-sm hover:text-blue-400 transition-colors font-mono"
              >
                Ready to bridge your syllabus? Launch SkillBridge AI →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="py-16 px-8 md:px-12 border-t border-white/5 bg-black/70 backdrop-blur-xl relative z-10 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xl font-black text-white tracking-tighter mb-2">
              SkillBridge <span className="text-blue-500">AI</span>
            </div>
            <p className="text-zinc-500 text-xs max-w-sm">
              Empowering students to bridge the gap between academic theory and industry reality.
            </p>
          </div>

          <div className="flex gap-8 text-xs font-mono text-zinc-500">
            <Link href="#the-dilemma" className="hover:text-zinc-300 transition-colors">The Dilemma</Link>
            <Link href="#neural-bridge" className="hover:text-zinc-300 transition-colors">The AI Bridge</Link>
            <Link href="#how-it-works" className="hover:text-zinc-300 transition-colors">How It Works</Link>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Login</Link>
          </div>

          <div className="text-zinc-600 text-xs font-mono">
            © 2026 SkillBridge AI • Google GDG TechSprint Winner
          </div>
        </div>
      </footer>
    </div>
  );
}
