"use client";
import React, { useRef, useEffect } from "react";

const hiddenContent = [
  // Skill nodes
  { x: 0.08, y: 0.15, label: "Python", type: "skill" },
  { x: 0.22, y: 0.55, label: "React", type: "skill" },
  { x: 0.38, y: 0.25, label: "SQL", type: "skill" },
  { x: 0.55, y: 0.70, label: "FastAPI", type: "skill" },
  { x: 0.72, y: 0.30, label: "Next.js", type: "skill" },
  { x: 0.88, y: 0.60, label: "Docker", type: "skill" },
  { x: 0.14, y: 0.80, label: "TypeScript", type: "skill" },
  { x: 0.45, y: 0.80, label: "Git", type: "skill" },
  { x: 0.65, y: 0.18, label: "AWS", type: "skill" },
  { x: 0.92, y: 0.82, label: "CI/CD", type: "skill" },
  { x: 0.30, y: 0.45, label: "Node.js", type: "skill" },
  { x: 0.80, y: 0.50, label: "Redis", type: "skill" },

  // Job titles
  { x: 0.12, y: 0.38, label: "Frontend Developer", type: "job" },
  { x: 0.50, y: 0.12, label: "ML Engineer", type: "job" },
  { x: 0.78, y: 0.75, label: "Backend Engineer", type: "job" },
  { x: 0.35, y: 0.65, label: "Full-Stack Dev", type: "job" },
  { x: 0.62, y: 0.45, label: "DevOps Engineer", type: "job" },
  { x: 0.20, y: 0.90, label: "Data Analyst", type: "job" },
  { x: 0.85, y: 0.22, label: "Product Engineer", type: "job" },

  // Companies
  { x: 0.05, y: 0.50, label: "Google", type: "company" },
  { x: 0.42, y: 0.35, label: "Stripe", type: "company" },
  { x: 0.70, y: 0.90, label: "Figma", type: "company" },
  { x: 0.90, y: 0.40, label: "Vercel", type: "company" },
  { x: 0.25, y: 0.20, label: "GitHub", type: "company" },
  { x: 0.57, y: 0.90, label: "OpenAI", type: "company" },

  // Roadmap nodes / connectors
  { x: 0.10, y: 0.65, label: "● Learn Basics", type: "node" },
  { x: 0.28, y: 0.72, label: "→ Build Projects", type: "node" },
  { x: 0.48, y: 0.50, label: "→ Deploy to Cloud", type: "node" },
  { x: 0.68, y: 0.60, label: "→ Join a Team", type: "node" },
  { x: 0.88, y: 0.12, label: "✓ Get Hired", type: "node" },
];

const FlashlightSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const { x: mx, y: my } = mouseRef.current;
      const radius = 160;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Draw the hidden content first at ~5% opacity (barely visible)
      hiddenContent.forEach(({ x, y, label, type }) => {
        const px = x * width;
        const py = y * height;

        ctx.save();
        ctx.globalAlpha = 0.04;
        ctx.font =
          type === "job"
            ? "500 13px sans-serif"
            : type === "company"
            ? "700 15px sans-serif"
            : type === "node"
            ? "400 11px monospace"
            : "700 14px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, px, py);
        ctx.restore();
      });

      // Draw flashlight revealed content clipped to radial gradient
      hiddenContent.forEach(({ x, y, label, type }) => {
        const px = x * width;
        const py = y * height;

        const distToMouse = Math.hypot(px - mx, py - my);
        if (distToMouse > radius + 80) return;

        const reveal = Math.max(0, 1 - distToMouse / radius);
        if (reveal <= 0) return;

        let color = "#60a5fa"; // skill – blue
        let fontSize = "700 16px monospace";
        if (type === "job") { color = "#a78bfa"; fontSize = "500 14px sans-serif"; }
        if (type === "company") { color = "#34d399"; fontSize = "700 16px sans-serif"; }
        if (type === "node") { color = "#94a3b8"; fontSize = "400 12px monospace"; }

        ctx.save();
        ctx.globalAlpha = reveal * 0.9;
        ctx.font = fontSize;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * reveal;
        ctx.fillText(label, px, py);
        ctx.restore();
      });

      // Flashlight glow circle overlay
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(5,5,5,1)");

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Re-fill everything outside the radius — the dark overlay
      const mask = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
      mask.addColorStop(0, "rgba(5,5,5,0)");
      mask.addColorStop(0.6, "rgba(5,5,5,0)");
      mask.addColorStop(1, "rgba(5,5,5,1)");
      ctx.fillStyle = mask;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative w-full h-[650px] overflow-hidden border-t border-white/5 bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none" />

      {/* Centered headline — always fully visible */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
        <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mb-4 font-mono">
          move your cursor to explore
        </p>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight text-center leading-none">
          SkillBridge
        </h2>
        <p className="text-zinc-500 mt-4 text-sm tracking-wide">
          illuminates what was always there — invisible to you.
        </p>
      </div>
    </section>
  );
};

export default FlashlightSection;
