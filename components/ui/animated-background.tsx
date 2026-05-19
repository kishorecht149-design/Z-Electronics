"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let nodes: CircuitNode[] = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 720);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class Particle {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      vx = (Math.random() - 0.5) * 0.5;
      vy = (Math.random() - 0.5) * 0.5;
      radius = Math.random() * 2 + 1;
      opacity = Math.random() * 0.5 + 0.2;

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    class CircuitNode {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      radius = Math.random() * 3 + 2;
      pulsePhase = Math.random() * Math.PI * 2;
      color = Math.random() > 0.5 ? "rgba(0, 217, 255, 0.8)" : "rgba(157, 78, 221, 0.8)";

      draw(time: number) {
        const pulse = Math.sin(time * 0.002 + this.pulsePhase) * 0.5 + 0.5;
        const glowRadius = this.radius + pulse * 5;

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0, 217, 255, 0)");

        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const seedScene = () => {
      particles = Array.from({ length: 50 }, () => new Particle());
      nodes = Array.from({ length: 15 }, () => new CircuitNode());
    };

    const drawCircuitLines = (time: number) => {
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.3;
            const flowOffset = (time * 0.1) % 20;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.setLineDash([10, 10]);
            ctx.lineDashOffset = -flowOffset;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    };

    const animate = (time: number) => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, Math.max(window.innerHeight, 720));

      drawCircuitLines(time);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      nodes.forEach((node) => node.draw(time));

      animationFrameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    seedScene();
    animate(0);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10, 14, 39, 0.4) 100%)"
        }}
      />
    </>
  );
}
