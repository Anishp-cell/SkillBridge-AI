"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SkillNode {
  id: string;
  label: string;
  courseOrigin: string;
  description: string;
  x: number;
  y: number;
  careers: string[];
}

interface CareerNode {
  id: string;
  label: string;
  description: string;
  syllabusMatch: number;
  gapBridge: string;
  timeEstimate: string;
  skills: string[];
  x: number;
  y: number;
}

const SKILLS: SkillNode[] = [
  {
    id: "python",
    label: "Python & OOP Logic",
    courseOrigin: "College Sem 2 • CS102",
    description: "Core algorithms, data structures, and modular OOP architecture.",
    x: 240,
    y: 170,
    careers: ["swe", "data_sci", "ml_eng", "ai_eng"]
  },
  {
    id: "js",
    label: "JavaScript & Web Tech",
    courseOrigin: "College Sem 3 • CS203",
    description: "Asynchronous programming, event loop, and modern browser APIs.",
    x: 260,
    y: 245,
    careers: ["swe", "fullstack"]
  },
  {
    id: "sql",
    label: "Relational SQL & DBMS",
    courseOrigin: "College Sem 4 • CS204",
    description: "Schema design, relational algebra, indexing, and transactional integrity.",
    x: 300,
    y: 320,
    careers: ["swe", "fullstack", "data_sci", "ml_eng"]
  },
  {
    id: "git",
    label: "Git & Software Engg",
    courseOrigin: "College Sem 3 • CS205",
    description: "Version control branching, PR workflows, and code collaboration.",
    x: 270,
    y: 395,
    careers: ["swe", "fullstack", "devops"]
  },
  {
    id: "apis",
    label: "Computer Networks & APIs",
    courseOrigin: "College Sem 5 • CS301",
    description: "Client-server models, HTTP protocol, sockets, and REST contracts.",
    x: 310,
    y: 470,
    careers: ["swe", "fullstack", "ai_eng", "devops"]
  },
  {
    id: "ml",
    label: "Linear Algebra & Stats",
    courseOrigin: "College Sem 4 • M401",
    description: "Statistical distributions, matrix factorization, and loss optimizations.",
    x: 330,
    y: 545,
    careers: ["data_sci", "ml_eng", "ai_eng"]
  },
];

const CAREERS: CareerNode[] = [
  {
    id: "swe",
    label: "Software Engineer",
    description: "Architecting reliable, scalable backend logic and enterprise systems.",
    syllabusMatch: 65,
    gapBridge: "System Design, Automated Testing, Cloud CI/CD",
    timeEstimate: "6 Weeks",
    skills: ["python", "sql", "git", "apis"],
    x: 1350,
    y: 160
  },
  {
    id: "fullstack",
    label: "Full-Stack Developer",
    description: "Building production web applications from database schemas to client UI.",
    syllabusMatch: 58,
    gapBridge: "React / Next.js, FastAPI, Docker Containers",
    timeEstimate: "8 Weeks",
    skills: ["js", "sql", "git", "apis"],
    x: 1380,
    y: 235
  },
  {
    id: "data_sci",
    label: "Data Scientist",
    description: "Turning raw enterprise data into predictive models and actionable insight.",
    syllabusMatch: 70,
    gapBridge: "Pandas, Scikit-Learn, Production Feature Pipelines",
    timeEstimate: "7 Weeks",
    skills: ["python", "sql", "ml"],
    x: 1400,
    y: 310
  },
  {
    id: "ml_eng",
    label: "Machine Learning Eng",
    description: "Deploying high-throughput deep learning and inference pipelines.",
    syllabusMatch: 52,
    gapBridge: "PyTorch, Model Serving (Triton/FastAPI), Vector DBs",
    timeEstimate: "9 Weeks",
    skills: ["python", "sql", "ml"],
    x: 1410,
    y: 385
  },
  {
    id: "ai_eng",
    label: "AI Systems Engineer",
    description: "Building agentic applications with LLMs, RAG, and multimodal pipelines.",
    syllabusMatch: 50,
    gapBridge: "Gemini / LangChain, Embeddings, Context Orchestration",
    timeEstimate: "6 Weeks",
    skills: ["python", "apis", "ml"],
    x: 1400,
    y: 460
  },
  {
    id: "devops",
    label: "Cloud & DevOps Eng",
    description: "Automating cloud infrastructure, Kubernetes orchestration, and monitoring.",
    syllabusMatch: 45,
    gapBridge: "Docker, Kubernetes, Terraform, AWS Deployments",
    timeEstimate: "8 Weeks",
    skills: ["git", "apis", "python"],
    x: 1340,
    y: 535
  },
];

export default function CareerPathMotion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<"skill" | "career" | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const brainX = 850;
  const brainY = 355;

  // Active highlighted skill/career IDs based on hover
  const activeSkill = hoveredType === "skill" ? SKILLS.find((s) => s.id === hoveredId) : null;
  const activeCareer = hoveredType === "career" ? CAREERS.find((c) => c.id === hoveredId) : null;

  const highlightedSkillIds = new Set<string>();
  const highlightedCareerIds = new Set<string>();

  if (activeSkill) {
    highlightedSkillIds.add(activeSkill.id);
    activeSkill.careers.forEach((cId) => highlightedCareerIds.add(cId));
  } else if (activeCareer) {
    highlightedCareerIds.add(activeCareer.id);
    activeCareer.skills.forEach((sId) => highlightedSkillIds.add(sId));
  }

  const isAnyHovered = hoveredId !== null;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[880px] w-full flex flex-col items-center justify-center overflow-hidden bg-black py-16 border-t border-b border-white/5"
    >
      {/* Background Subtle Grid & Radial Glow */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-6 z-10 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-[0.2em]">
            The SkillBridge Neural Architecture
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-3 text-white tracking-tight">
          How Your Syllabus Connects to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            Real Careers
          </span>
        </h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Hover over any college course or target job to see how SkillBridge's AI bridges academic theory into hiring criteria.
        </p>
      </div>

      {/* Three Architectural Column Labels */}
      <div className="w-full max-w-6xl grid grid-cols-3 gap-4 px-8 mb-2 z-10 text-center select-none pointer-events-none">
        <div className="bg-zinc-950/70 border border-white/10 rounded-2xl py-3 px-4 backdrop-blur-md">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
            1. Academic Input
          </span>
          <span className="text-sm font-semibold text-white">Your College Syllabus</span>
          <span className="text-[11px] text-zinc-500 block">Existing coursework & credits</span>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl py-3 px-4 backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.12)]">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-0.5">
            2. SkillBridge AI
          </span>
          <span className="text-sm font-semibold text-white">Neural Gap Engine</span>
          <span className="text-[11px] text-blue-300/70 block">Calculates readiness & missing skills</span>
        </div>

        <div className="bg-zinc-950/70 border border-white/10 rounded-2xl py-3 px-4 backdrop-blur-md">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
            3. Industry Output
          </span>
          <span className="text-sm font-semibold text-white">Target Career Roles</span>
          <span className="text-[11px] text-zinc-500 block">Verified market hiring tracks</span>
        </div>
      </div>

      {/* SVG Neural Mesh */}
      <svg viewBox="0 0 1700 720" className="w-full h-full max-w-7xl select-none relative z-10">
        <defs>
          <filter id="brain-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="brain-grad">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left Side: Academic Skills */}
        {SKILLS.map((skill) => {
          const isHighlighted = highlightedSkillIds.has(skill.id);
          const isDirectlyHovered = hoveredId === skill.id;
          const dimmed = isAnyHovered && !isHighlighted;

          return (
            <NeuralPath
              key={skill.id}
              skill={skill}
              end={{ x: brainX - 80, y: brainY }}
              isHighlighted={isHighlighted}
              isDirectlyHovered={isDirectlyHovered}
              dimmed={dimmed}
              onHover={() => {
                setHoveredId(skill.id);
                setHoveredType("skill");
              }}
              onLeave={() => {
                setHoveredId(null);
                setHoveredType(null);
              }}
            />
          );
        })}

        {/* Right Side: Industry Careers */}
        {CAREERS.map((career) => {
          const isHighlighted = highlightedCareerIds.has(career.id);
          const isDirectlyHovered = hoveredId === career.id;
          const dimmed = isAnyHovered && !isHighlighted;

          return (
            <WavyPath
              key={career.id}
              career={career}
              start={{ x: brainX + 80, y: brainY }}
              isHighlighted={isHighlighted}
              isDirectlyHovered={isDirectlyHovered}
              dimmed={dimmed}
              onHover={() => {
                setHoveredId(career.id);
                setHoveredType("career");
              }}
              onLeave={() => {
                setHoveredId(null);
                setHoveredType(null);
              }}
            />
          );
        })}

        {/* Central Brain Core */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Pulsing Aura */}
          <motion.circle
            cx={brainX}
            cy={brainY}
            r="170"
            fill="url(#brain-grad)"
            animate={{
              opacity: isAnyHovered ? [0.4, 0.7, 0.4] : [0.25, 0.45, 0.25],
              scale: isAnyHovered ? [1.02, 1.12, 1.02] : [1, 1.06, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Brain Image with Shadow */}
          <foreignObject x={brainX - 110} y={brainY - 110} width="220" height="220">
            <motion.div
              className="w-full h-full flex items-center justify-center p-3 select-none pointer-events-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/neon-brain.png"
                alt="SkillBridge AI Neural Core"
                className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(96,165,250,0.65)]"
                style={{ borderRadius: "50%" }}
              />
            </motion.div>
          </foreignObject>

          {/* Core Center Glow */}
          <circle cx={brainX} cy={brainY} r="70" fill="#60a5fa" className="opacity-15 blur-2xl pointer-events-none" />
        </motion.g>
      </svg>

      {/* Bottom Hint */}
      <div className="z-10 mt-2 text-center text-xs font-mono text-zinc-500">
        💡 <span className="text-zinc-400">Interactive:</span> Hover any node to trace the exact college-to-career bridge.
      </div>

      {/* Floating Smart Tooltip Panel */}
      {hoveredId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            left: mousePos.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500) ? mousePos.x - 320 : mousePos.x + 25,
            top: mousePos.y > (typeof window !== "undefined" ? window.innerHeight - 240 : 500) ? mousePos.y - 210 : mousePos.y + 20,
            pointerEvents: "none",
          }}
          className="z-50 p-5 rounded-2xl border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.25)] backdrop-blur-2xl bg-zinc-950/90 max-w-sm"
        >
          {activeCareer ? (
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  Target Career Role
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeCareer.syllabusMatch}% Syllabus Match
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">{activeCareer.label}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed mb-3">{activeCareer.description}</p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">
                    Missing Industry Gap:
                  </span>
                  <span className="text-blue-300 font-mono text-xs">{activeCareer.gapBridge}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono pt-1">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Estimated Bridge Time:</span>
                  <span className="text-white font-bold">{activeCareer.timeEstimate}</span>
                </div>
              </div>
            </div>
          ) : activeSkill ? (
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  College Coursework
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {activeSkill.courseOrigin}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">{activeSkill.label}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed mb-3">{activeSkill.description}</p>

              <div className="pt-2 border-t border-white/10 text-xs">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1">
                  Directly Powers These Careers:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeSkill.careers.map((cId) => {
                    const c = CAREERS.find((item) => item.id === cId);
                    return (
                      <span
                        key={cId}
                        className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px] font-mono"
                      >
                        {c?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </section>
  );
}

// Left Path Component (College Skills -> Brain)
function NeuralPath({
  skill,
  end,
  isHighlighted,
  isDirectlyHovered,
  dimmed,
  onHover,
  onLeave,
}: {
  skill: SkillNode;
  end: { x: number; y: number };
  isHighlighted: boolean;
  isDirectlyHovered: boolean;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const seed = skill.id.length;
  const dx = end.x - skill.x;
  const dir = seed % 2 === 0 ? 1 : -1;
  const vOffset = 18 + (seed % 3) * 6;

  const cp1y = skill.y + vOffset * dir;
  const cp2y = skill.y - vOffset * dir;
  const midX = skill.x + dx * 0.45;
  const midY = skill.y + (end.y - skill.y) * 0.45;

  const pathD = `M ${skill.x} ${skill.y} 
                 C ${skill.x + dx * 0.15} ${cp1y}, ${skill.x + dx * 0.3} ${cp2y}, ${midX} ${midY}
                 S ${end.x - dx * 0.2} ${end.y + vOffset * dir}, ${end.x} ${end.y}`;

  const strokeColor = isDirectlyHovered ? "#60a5fa" : isHighlighted ? "#93c5fd" : "#3b82f6";
  const strokeWidth = isDirectlyHovered ? 4 : isHighlighted ? 3 : 1.8;
  const opacity = dimmed ? 0.15 : isHighlighted ? 1 : 0.45;

  return (
    <g onMouseEnter={onHover} onMouseLeave={onLeave} className="cursor-pointer">
      <path d={pathD} fill="none" stroke="#1e3a8a" strokeWidth="1" opacity="0.2" />

      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        filter={isHighlighted ? "url(#line-glow)" : ""}
      />

      {/* College Course Origin Tag */}
      <motion.text
        x={skill.x - 12}
        y={skill.y - 12}
        textAnchor="end"
        fill={isHighlighted ? "#93c5fd" : "#64748b"}
        className="text-[10px] font-mono tracking-wider"
        animate={{ opacity: dimmed ? 0.2 : isHighlighted ? 1 : 0.7 }}
      >
        {skill.courseOrigin}
      </motion.text>

      {/* Skill Label */}
      <motion.text
        x={skill.x - 12}
        y={skill.y + 7}
        textAnchor="end"
        fill={isDirectlyHovered ? "#ffffff" : isHighlighted ? "#bfdbfe" : "#94a3b8"}
        className="text-[14px] font-bold tracking-wide"
        animate={{ opacity: dimmed ? 0.2 : isHighlighted ? 1 : 0.85 }}
      >
        {skill.label}
      </motion.text>

      {/* Node Bullet */}
      <motion.circle
        cx={skill.x}
        cy={skill.y}
        r={isDirectlyHovered ? 6 : isHighlighted ? 5 : 3.5}
        fill={isDirectlyHovered ? "#ffffff" : isHighlighted ? "#60a5fa" : "#3b82f6"}
        filter="url(#line-glow)"
        animate={{ scale: isDirectlyHovered ? 1.4 : 1 }}
      />
    </g>
  );
}

// Right Path Component (Brain -> Careers)
function WavyPath({
  career,
  start,
  isHighlighted,
  isDirectlyHovered,
  dimmed,
  onHover,
  onLeave,
}: {
  career: CareerNode;
  start: { x: number; y: number };
  isHighlighted: boolean;
  isDirectlyHovered: boolean;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const seed = career.id.length;
  const dx = career.x - start.x;
  const dy = career.y - start.y;

  const cp1x = start.x + dx * 0.25;
  const cp1y = start.y + dy * 0.1 + (seed % 2 === 0 ? 35 : -35);
  const cp2x = start.x + dx * 0.75;
  const cp2y = start.y + dy * 0.9 + (seed % 2 === 0 ? -35 : 35);

  const pathD = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${career.x} ${career.y}`;

  const strokeColor = isDirectlyHovered ? "#a855f7" : isHighlighted ? "#c084fc" : "#60a5fa";
  const strokeWidth = isDirectlyHovered ? 4 : isHighlighted ? 3 : 2;
  const opacity = dimmed ? 0.15 : isHighlighted ? 1 : 0.6;

  return (
    <g onMouseEnter={onHover} onMouseLeave={onLeave} className="cursor-pointer">
      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.2 }}
        filter={isHighlighted ? "url(#line-glow)" : ""}
      />

      {/* Career Box Container */}
      <g transform={`translate(${career.x + 10}, ${career.y - 20})`}>
        <motion.rect
          x="0"
          y="0"
          width="230"
          height="40"
          rx="8"
          fill={isDirectlyHovered ? "rgba(30, 27, 75, 0.9)" : isHighlighted ? "rgba(15, 23, 42, 0.9)" : "rgba(10, 10, 15, 0.8)"}
          stroke={isDirectlyHovered ? "#a855f7" : isHighlighted ? "#818cf8" : "rgba(255, 255, 255, 0.15)"}
          strokeWidth={isHighlighted ? "2" : "1"}
          animate={{ opacity: dimmed ? 0.25 : 1 }}
        />

        {/* Career Title */}
        <text
          x="14"
          y="20"
          fill={isDirectlyHovered ? "#ffffff" : isHighlighted ? "#f3e8ff" : "#e2e8f0"}
          className="text-[12px] font-bold tracking-wide"
        >
          {career.label}
        </text>

        {/* Readiness Match Tag */}
        <text
          x="14"
          y="32"
          fill={isHighlighted ? "#34d399" : "#64748b"}
          className="text-[9px] font-mono tracking-wider uppercase font-semibold"
        >
          {career.syllabusMatch}% Syllabus Match • {career.timeEstimate}
        </text>
      </g>
    </g>
  );
}
