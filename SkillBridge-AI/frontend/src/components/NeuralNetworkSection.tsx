"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NeuralNetworkSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 600;

    const nodes: { x: number; y: number; vx: number; vy: number; base_x: number; base_y: number }[] = [];
    const nodeCount = 100;
    const connectionDist = 150;
    const attractDist = 200;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        base_x: 0,
        base_y: 0
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 600;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        ripplesRef.current.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            r: 0,
            alpha: 1
        });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update Ripples
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0);
      ripplesRef.current.forEach(r => {
          r.r += 4;
          r.alpha -= 0.01;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${r.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
      });

      nodes.forEach((node, i) => {
        // Drift
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse Attraction
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < attractDist) {
          const force = (attractDist - dist) / attractDist;
          node.x += dx * force * 0.05;
          node.y += dy * force * 0.05;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx_conn = node.x - node2.x;
          const dy_conn = node.y - node2.y;
          const dist_conn = Math.sqrt(dx_conn * dx_conn + dy_conn * dy_conn);

          if (dist_conn < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            const alpha = (1 - dist_conn / connectionDist) * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-[600px] w-full bg-black overflow-hidden border-t border-white/5">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 h-full flex items-center justify-center pointer-events-none">
        <h2 className="text-6xl font-black text-white tracking-widest opacity-20 uppercase">
          SkillBridge
        </h2>
      </div>
    </section>
  );
};

export default NeuralNetworkSection;
