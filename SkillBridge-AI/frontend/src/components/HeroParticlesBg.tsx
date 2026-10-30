"use client";
import { useRef, useEffect } from "react";

const skills = [
  "Python", "React", "SQL", "Git", "APIs", "Docker", "AWS", "Node.js",
  "FastAPI", "Next.js", "TypeScript", "CI/CD", "Testing", "Auth",
  "Deployment", "GraphQL", "Redis", "Kubernetes", "NoSQL", "Figma",
  "Machine Learning", "Cloud", "Microservices", "REST", "CSS",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  baseOpacity: number;
  opacity: number;
  size: number;
  angle: number;
  orbitRadius: number;
}

const HeroParticlesBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

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

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.25 + Math.random() * 0.55),
      text: skills[Math.floor(Math.random() * skills.length)],
      baseOpacity: 0.06 + Math.random() * 0.14,
      opacity: 0.06 + Math.random() * 0.14,
      size: 11 + Math.random() * 7,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: 60 + Math.random() * 60,
    });

    const particles: Particle[] = Array.from({ length: 70 }, spawn);

    const ATTRACT_DIST = 220;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < ATTRACT_DIST) {
          // Pull into orbit around cursor
          p.angle += 0.025;
          const tx = mx + Math.cos(p.angle) * p.orbitRadius;
          const ty = my + Math.sin(p.angle) * p.orbitRadius;
          p.x += (tx - p.x) * 0.04;
          p.y += (ty - p.y) * 0.04;
          p.opacity = Math.min(0.75, p.opacity + 0.04);
        } else {
          // Free drift upward
          p.x += p.vx;
          p.y += p.vy;
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        // Respawn when off screen
        if (p.y < -30 || p.x < -150 || p.x > width + 150) {
          particles[idx] = spawn();
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.font = `600 ${p.size}px 'Outfit', 'Inter', monospace`;
        ctx.fillStyle = "#60a5fa"; // blue-400
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      });

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
      style={{ opacity: 1 }}
    />
  );
};

export default HeroParticlesBg;
