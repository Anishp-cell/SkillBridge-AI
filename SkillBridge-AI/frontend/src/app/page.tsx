"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import CareerPathMotion from "@/components/CareerPathMotion";
import NotebookSection from "@/components/NotebookSection";
import YouTubeFeedSection from "@/components/YouTubeFeedSection";
import SearchBarSection from "@/components/SearchBarSection";
import OverwhelmedDeskSection from "@/components/OverwhelmedDeskSection";
import HeroFlashlightBg from "@/components/HeroFlashlightBg";
import "./homepage.css";

const allTags = ["React", "FastAPI", "Python", "SQL", "Auth", "Deployment", "CI/CD", "Testing"];

const LostStudentsSection = () => {
  const cards = [
    {
      icon: "📚",
      title: "Disconnected Context",
      description: "Your syllabus tells you what to study, not why it matters.",
      gradient: "from-blue-500/10 to-purple-500/20",
      accent: "bg-blue-500",
      delay: 0.1
    },
    {
      icon: "🧭",
      title: "Generic Guidance",
      description: "Career advice online ignores what you’re already learning.",
      gradient: "from-orange-500/10 to-red-500/20",
      accent: "bg-orange-500",
      delay: 0.2
    },
    {
      icon: "🎯",
      title: "Missing Direction",
      description: "Students don’t fail because they lack talent — they fail due to lack of direction.",
      gradient: "from-green-500/10 to-emerald-500/20",
      accent: "bg-green-500",
      delay: 0.3
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight relative z-10">
            Why most students feel{' '}
            <motion.span
              whileHover={{
                scale: 1.05,
                filter: "drop-shadow(0 0 20px rgba(239,68,68,0.9))"
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 inline-block py-2 cursor-default transition-all duration-300"
            >
              lost after lectures
            </motion.span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative group cursor-default h-full"
            >
              {/* Hover Animated Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`} />

              <div className="relative h-full bg-zinc-900/60 backdrop-blur-xl border border-white/5 group-hover:border-white/10 p-10 rounded-[2rem] transition-colors duration-500 flex flex-col shadow-2xl">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/50">
                  {card.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                  {card.title}
                </h3>

                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  {card.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-10 right-10 h-[3px] ${card.accent} rounded-t-lg opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0 shadow-[0_-5px_20px_rgba(255,255,255,0.1)]`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AccuracyBar = () => {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="mt-5 bg-zinc-800/60 rounded-xl p-5 border border-white/5">
      <div className="flex justify-between text-xs font-mono text-zinc-400 mb-3 uppercase tracking-widest">
        <span>Avg. Accuracy Score</span>
        <motion.span animate={{ opacity: filled ? 1 : 0 }} className="text-blue-400 font-black">94%</motion.span>
      </div>
      <div className="h-2.5 w-full bg-zinc-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: filled ? '94%' : 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <p className="text-zinc-500 text-xs mt-3 font-mono">Based on internal benchmark across 2,400+ syllabi.</p>
    </div>
  );
};

const FAQItem = ({ question, tag, tagColor, borderColor, children }: { question: string; tag?: string; tagColor?: string; borderColor?: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open
          ? `border-l-2 ${borderColor ?? 'border-l-blue-500'} border-t border-r border-b border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.08)] bg-zinc-900/60`
          : 'border border-white/5 bg-zinc-900/30'
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
          transition={{ duration: 0.25, ease: 'easeInOut' }}
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container min-h-screen selection:bg-blue-500/30 bg-black text-white relative">
      {/* Background Elements */}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="glow-blob top-[-10%] left-[-5%] opacity-30" />
        <div className="glow-blob bottom-[10%] right-[-5%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-12 py-8 backdrop-blur-xl border-b border-white/5 bg-black/40">
        <div className="flex-1 flex items-center">
          <div className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
            SkillBridge <span className="text-blue-500">AI</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          <Link href="#features" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all">Features</Link>
          <Link href="#how-it-works" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all">How it Works</Link>
          <Link href="#faq" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all">FAQ</Link>
        </div>

        <div className="flex-1 flex justify-end items-center">
          <Link
            href="/login"
            className="px-8 py-2.5 bg-white text-black rounded-full font-black hover:bg-zinc-200 transition-all text-xs uppercase tracking-wider shadow-lg shadow-white/5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <HeroFlashlightBg />

        <motion.div
          className="relative z-10 pt-24 md:pt-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.h1
            variants={containerVariants}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight"
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex flex-wrap justify-center overflow-hidden">
              {"Bridge the Gap.".split(" ").map((word, i) => (
                <motion.span key={i} variants={itemVariants} className="inline-block mr-[0.2em]">{word}</motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center overflow-hidden">
              <span className="text-gradient">
                {"Build Your Future.".split(" ").map((word, i) => (
                  <motion.span key={i} variants={itemVariants} className="inline-block mr-[0.2em]">{word}</motion.span>
                ))}
              </span>
            </div>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            AI-powered career roadmaps that turn your college syllabus into a professional edge.
            Stop guessing, start mastering.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Content Sections */}
      <motion.main
        className="max-w-7xl mx-auto px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <SearchBarSection />

        {/* Career Path in Motion */}
        <div className="py-20">
          <CareerPathMotion />
        </div>

        <NotebookSection />
        <YouTubeFeedSection />
        <OverwhelmedDeskSection />

        <div className="border-t border-white/5" />
        <LostStudentsSection />



        {/* How it Works */}
        <section id="how-it-works" className="py-32 scroll-mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-zinc-400 text-lg">Your journey to career excellence in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
            {[
              { step: "01", title: "Tell Us Your Goals", desc: "Define your interests, target roles, and weekly time commitment." },
              { step: "02", title: "Upload Syllabus", desc: "Our AI scans your curriculum to identify existing knowledge and gaps." },
              { step: "03", title: "Execute Roadmap", desc: "Get your personalized learning path and start building your future." }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass-card p-10 rounded-3xl transition-all duration-500 relative overflow-hidden ${activeStep === i
                  ? "border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.5)] bg-blue-500/10 scale-105"
                  : "border-white/10"
                  }`}
              >
                {activeStep === i && (
                  <div className="absolute inset-0 bg-blue-500/5 z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-4xl font-black text-blue-500/20 mb-6">{s.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 scroll-mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Got questions about{' '}
              <span className="text-blue-500">SkillBridge?</span>
            </h2>
            <p className="text-zinc-400 text-lg">Everything you need to know about SkillBridge AI.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-5">
            <FAQItem question="How accurate is the AI syllabus scanning?" borderColor="border-l-blue-500">
              <p className="text-zinc-400 leading-relaxed">Our AI is trained on thousands of academic documents and industry job descriptions, ensuring a high level of accuracy in extracting core skills and mapping them to professional requirements.</p>
              <AccuracyBar />
            </FAQItem>

            <FAQItem question="Is SkillBridge AI free for students?" tag="Most Asked" tagColor="bg-green-500/15 text-green-400 border border-green-500/20" borderColor="border-l-green-500">
              <p className="text-zinc-400 leading-relaxed">
                Yes — our core features including syllabus scanning and roadmap generation are completely{' '}
                <span className="text-blue-400 text-xl font-black tracking-tight">free</span>{' '}
                for individual students. No credit card, no trial period.
              </p>
            </FAQItem>

            <FAQItem question="What formats can I upload my syllabus in?" borderColor="border-l-purple-500">
              <p className="text-zinc-400 leading-relaxed mb-5">We support the most common academic document format right now, with more on the way.</p>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/30 rounded-xl">
                  <div className="w-7 h-8 bg-red-600 rounded-sm flex items-center justify-center relative">
                    <span className="text-white text-[8px] font-black">PDF</span>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-900 rounded-sm" />
                  </div>
                  <span className="text-red-300 text-sm font-bold">PDF</span>
                  <span className="text-green-400 text-xs ml-1">✓ Supported</span>
                </div>
                {['DOCX', 'Image Scan', 'Google Doc'].map(fmt => (
                  <div key={fmt} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 border border-zinc-700/40 rounded-xl opacity-50">
                    <span className="text-zinc-400 text-sm font-bold">{fmt}</span>
                    <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">soon</span>
                  </div>
                ))}
              </div>
            </FAQItem>

            <FAQItem question="Can I export my roadmap to other platforms?" borderColor="border-l-amber-500">
              <p className="text-zinc-400 leading-relaxed mb-5">Export your roadmap directly to the tools your team already uses.</p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 px-4 py-2 bg-green-950/40 border border-green-600/30 rounded-full text-green-400 text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500" />Google Sheets
                </span>
                {[
                  { name: 'Notion', cls: 'bg-zinc-800/60 border-zinc-600/30 text-zinc-300' },
                  { name: 'Trello', cls: 'bg-blue-950/40 border-blue-600/30 text-blue-400' },
                  { name: 'Obsidian', cls: 'bg-purple-950/40 border-purple-600/30 text-purple-400' },
                ].map(p => (
                  <span key={p.name} className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold opacity-50 ${p.cls}`}>
                    {p.name}
                    <span className="text-[9px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded-full font-bold uppercase">soon</span>
                  </span>
                ))}
              </div>
            </FAQItem>

            <div className="text-center pt-4">
              <Link href="/login" className="text-zinc-500 text-sm hover:text-blue-400 transition-colors duration-200">
                Still confused? Your roadmap will answer the rest. →
              </Link>
            </div>
          </div>
        </section>
      </motion.main>

      {/* Final CTA */}
      {/* Final CTA Removed */}

      {/* Enhanced Footer */}
      <footer className="py-20 px-12 border-t border-white/5 bg-black/50 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-black text-white tracking-tighter mb-6">
              SkillBridge <span className="text-blue-500">AI</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Empowering students to bridge the gap between academic theory and industry reality with AI-driven career roadmaps.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="sr-only">{s}</span>
                  <div className="w-4 h-4 bg-zinc-600 rounded-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="#features" className="hover:text-blue-500 transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-blue-500 transition-colors">How it Works</Link></li>
              <li><Link href="/login" className="hover:text-blue-500 transition-colors">Login / Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-8 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2026 SkillBridge AI. Built for the future of education.</p>
          <div className="flex gap-8 text-zinc-600 text-sm">
            <span>Server Status: <span className="text-green-500 font-mono">Operational</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

