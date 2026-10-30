"use client";
import { useRef, useEffect } from "react";

const hiddenContent = [
  { x: 0.06, y: 0.12, label: "Python",            type: "skill" },
  { x: 0.18, y: 0.55, label: "React",             type: "skill" },
  { x: 0.35, y: 0.22, label: "SQL",               type: "skill" },
  { x: 0.52, y: 0.72, label: "FastAPI",           type: "skill" },
  { x: 0.70, y: 0.32, label: "Next.js",           type: "skill" },
  { x: 0.87, y: 0.62, label: "Docker",            type: "skill" },
  { x: 0.12, y: 0.82, label: "TypeScript",        type: "skill" },
  { x: 0.44, y: 0.85, label: "Git",               type: "skill" },
  { x: 0.63, y: 0.15, label: "AWS",               type: "skill" },
  { x: 0.93, y: 0.78, label: "CI/CD",             type: "skill" },
  { x: 0.28, y: 0.45, label: "Node.js",           type: "skill" },
  { x: 0.80, y: 0.50, label: "Redis",             type: "skill" },
  { x: 0.50, y: 0.40, label: "GraphQL",           type: "skill" },
  { x: 0.77, y: 0.82, label: "Kubernetes",        type: "skill" },
  { x: 0.38, y: 0.58, label: "MongoDB",           type: "skill" },
  { x: 0.60, y: 0.26, label: "Linux",             type: "skill" },
  { x: 0.16, y: 0.30, label: "Tailwind CSS",      type: "skill" },
  { x: 0.85, y: 0.95, label: "PostgreSQL",        type: "skill" },
  { x: 0.72, y: 0.08, label: "Figma",             type: "skill" },
  { x: 0.96, y: 0.30, label: "REST APIs",         type: "skill" },
  { x: 0.03, y: 0.70, label: "Bash",              type: "skill" },

  { x: 0.10, y: 0.38, label: "Frontend Developer",   type: "job" },
  { x: 0.48, y: 0.10, label: "ML Engineer",          type: "job" },
  { x: 0.76, y: 0.74, label: "Backend Engineer",     type: "job" },
  { x: 0.33, y: 0.65, label: "Full-Stack Dev",       type: "job" },
  { x: 0.60, y: 0.48, label: "DevOps Engineer",      type: "job" },
  { x: 0.19, y: 0.90, label: "Data Analyst",         type: "job" },
  { x: 0.88, y: 0.20, label: "Product Engineer",     type: "job" },
  { x: 0.42, y: 0.20, label: "Cloud Architect",      type: "job" },
  { x: 0.55, y: 0.58, label: "Security Engineer",    type: "job" },

  { x: 0.04, y: 0.50, label: "Cybersecurity", type: "domain" },
  { x: 0.40, y: 0.32, label: "AI & ML",       type: "domain" },
  { x: 0.68, y: 0.88, label: "Data Science",  type: "domain" },
  { x: 0.91, y: 0.42, label: "FinTech",       type: "domain" },
  { x: 0.24, y: 0.18, label: "Cloud Infra.",  type: "domain" },
  { x: 0.56, y: 0.92, label: "Web3",          type: "domain" },
  { x: 0.83, y: 0.36, label: "Robotics",      type: "domain" },
  { x: 0.08, y: 0.95, label: "Game Dev",      type: "domain" },

  { x: 0.06, y: 0.65, label: "● Learn Basics",      type: "node" },
  { x: 0.24, y: 0.74, label: "→ Build Projects",    type: "node" },
  { x: 0.46, y: 0.55, label: "→ Deploy to Cloud",   type: "node" },
  { x: 0.67, y: 0.60, label: "→ Join a Team",       type: "node" },
  { x: 0.90, y: 0.10, label: "✓ Get Hired",         type: "node" },
];

const HeroFlashlightBg = () => {
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

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const { x: mx, y: my } = mouseRef.current;
      const radius = 180;

      ctx.clearRect(0, 0, width, height);

      // Base dark fill
      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, width, height);

      hiddenContent.forEach(({ x, y, label, type }) => {
        const px = x * width;
        const py = y * height;

        const distToMouse = Math.hypot(px - mx, py - my);
        const reveal = Math.max(0, 1 - distToMouse / radius);

        // Always draw at very low opacity (hidden baseline)
        ctx.save();
        ctx.globalAlpha = 0.035;
        ctx.font = type === "job"
          ? "500 13px sans-serif"
          : type === "company" || type === "domain"
          ? "700 15px sans-serif"
          : type === "node"
          ? "400 11px monospace"
          : "700 14px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, px, py);
        ctx.restore();

        // Draw illuminated version based on cursor proximity
        if (reveal > 0) {
          let color = "#60a5fa";   // skill – blue
          let font  = "700 16px monospace";
          if (type === "job")     { color = "#c4b5fd"; font = "500 14px sans-serif"; }
          if (type === "company" || type === "domain") { color = "#34d399"; font = "700 16px sans-serif"; }
          if (type === "node")    { color = "#94a3b8"; font = "400 12px monospace";  }

          ctx.save();
          ctx.globalAlpha = reveal * 0.92;
          ctx.font = font;
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 14 * reveal;
          ctx.fillText(label, px, py);
          ctx.restore();
        }
      });

      // Soft dark vignette — everything outside cursor radius stays near-black
      const vignette = ctx.createRadialGradient(mx, my, 0, mx, my, radius * 1.6);
      vignette.addColorStop(0,   "rgba(6,6,8,0)");
      vignette.addColorStop(0.5, "rgba(6,6,8,0)");
      vignette.addColorStop(1,   "rgba(6,6,8,0.92)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
    />
  );
};

export default HeroFlashlightBg;
