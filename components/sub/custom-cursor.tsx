"use client";

import React, { useEffect, useRef, useState } from "react";

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const CustomCursor = () => {
  const coreRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Direct numeric tracking for 0-latency 120hz transform
  const mousePos = useRef({ x: -200, y: -200 });
  const reticlePos = useRef({ x: -200, y: -200 });
  const particles = useRef<StardustParticle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only activate if not on pure touch screen
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Ensure cursor is visible and body hides native cursor
      if (!document.body.classList.contains("custom-cursor-active")) {
        document.body.classList.add("custom-cursor-active");
        setIsVisible(true);
      }

      // 0-Latency position update for core diamond pointer
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check for interactive targets under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            'a, button, [role="button"], .cursor-pointer, input[type="submit"], input[type="button"], summary'
          )
        );
        const textInput = Boolean(
          target.closest(
            'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, [contenteditable="true"]'
          )
        );

        setIsHovered(interactive);
        setIsText(textInput);
      }

      // Spawn subtle cosmic stardust behind cursor
      if (Math.random() < 0.4) {
        const colors = ["#00f5ff", "#a855f7", "#38bdf8", "#e0e7ff", "#c084fc"];
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 + 0.2,
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.9,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Energy blast sparks on click
      const colors = ["#ffffff", "#00f5ff", "#c084fc", "#38bdf8"];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 3 + 2;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.remove("custom-cursor-active");
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      reticlePos.current.x = e.clientX;
      reticlePos.current.y = e.clientY;
      setIsVisible(true);
      document.body.classList.add("custom-cursor-active");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth Lerp Animation Loop for Outer HUD Reticle & Stardust
    const render = () => {
      // Lerp reticle position smoothly towards mouse pointer
      const lerp = 0.24;
      reticlePos.current.x += (mousePos.current.x - reticlePos.current.x) * lerp;
      reticlePos.current.y += (mousePos.current.y - reticlePos.current.y) * lerp;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Draw stardust particle trail on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.024;
          p.size *= 0.96;

          if (p.alpha <= 0.01 || p.size <= 0.3) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("custom-cursor-active");
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Cosmic Stardust Particle Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999990]"
      />

      {/* ========================================================================= */}
      {/* 1. ZERO-LATENCY CORE DIAMOND / CROSSHAIR POINTER                          */}
      {/* ========================================================================= */}
      <div
        ref={coreRef}
        className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform"
        style={{
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
        }}
      >
        {isText ? (
          /* Text I-Beam Mode */
          <div className="w-[2.5px] h-5 bg-gradient-to-b from-cyan-300 via-white to-purple-400 rounded-full shadow-[0_0_8px_#00f5ff] animate-pulse" />
        ) : (
          /* Gaming Precision Crosshair Core */
          <div className="relative flex items-center justify-center">
            {/* Center Glowing Neon Core */}
            <div
              className={`rounded-full transition-all duration-150 ${
                isClicking
                  ? "w-3 h-3 bg-white shadow-[0_0_16px_#00f5ff,0_0_28px_#a855f7]"
                  : isHovered
                  ? "w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_12px_#00f5ff]"
                  : "w-2 h-2 bg-gradient-to-r from-cyan-400 to-white shadow-[0_0_8px_#00f5ff]"
              }`}
            />

            {/* Precision Micro Crosshair Ticks (North, South, East, West) */}
            <div className="absolute -top-1.5 w-[1.2px] h-1.2 bg-cyan-300 shadow-[0_0_4px_#00f5ff]" />
            <div className="absolute -bottom-1.5 w-[1.2px] h-1.2 bg-cyan-300 shadow-[0_0_4px_#00f5ff]" />
            <div className="absolute -left-1.5 w-1.2 h-[1.2px] bg-cyan-300 shadow-[0_0_4px_#00f5ff]" />
            <div className="absolute -right-1.5 w-1.2 h-[1.2px] bg-cyan-300 shadow-[0_0_4px_#00f5ff]" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TACTICAL HUD RETICLE FOLLOWER & LOCK-ON BRACKETS                       */}
      {/* ========================================================================= */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 pointer-events-none z-[999998] will-change-transform"
        style={{
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
        }}
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-200 ease-out ${
            isText
              ? "scale-0 opacity-0"
              : isClicking
              ? "scale-75 rotate-45"
              : isHovered
              ? "scale-120 rotate-90"
              : "scale-100 rotate-0"
          }`}
        >
          {/* Outer Dashed Rotating HUD Ring */}
          <div
            className={`rounded-full border border-dashed transition-all duration-300 ${
              isHovered
                ? "w-8 h-8 border-cyan-300 shadow-[0_0_18px_rgba(0,245,255,0.7)] animate-[spin_3.5s_linear_infinite]"
                : "w-7 h-7 border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-[spin_10s_linear_infinite]"
            }`}
          />

          {/* Gaming Corner Target Brackets [ ┌ ┐ └ ┘ ] */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? "w-10 h-10" : "w-6 h-6"
            }`}
          >
            {/* Top-Left Bracket */}
            <span
              className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-200 ${
                isHovered
                  ? "border-cyan-300 shadow-[0_0_6px_#00f5ff]"
                  : "border-purple-300 shadow-[0_0_5px_#a855f7]"
              }`}
            />
            {/* Top-Right Bracket */}
            <span
              className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-colors duration-200 ${
                isHovered
                  ? "border-cyan-300 shadow-[0_0_6px_#00f5ff]"
                  : "border-purple-300 shadow-[0_0_5px_#a855f7]"
              }`}
            />
            {/* Bottom-Left Bracket */}
            <span
              className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors duration-200 ${
                isHovered
                  ? "border-cyan-300 shadow-[0_0_6px_#00f5ff]"
                  : "border-purple-300 shadow-[0_0_5px_#a855f7]"
              }`}
            />
            {/* Bottom-Right Bracket */}
            <span
              className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-200 ${
                isHovered
                  ? "border-cyan-300 shadow-[0_0_6px_#00f5ff]"
                  : "border-purple-300 shadow-[0_0_5px_#a855f7]"
              }`}
            />
          </div>

          {/* Interactive Target Lock HUD Badge */}
          {isHovered && (
            <div className="absolute -top-5 px-1.5 py-0.2 rounded-full bg-[#030014]/95 border border-cyan-400 text-[7px] font-mono font-extrabold text-cyan-300 tracking-widest uppercase shadow-[0_0_10px_rgba(0,245,255,0.6)] animate-pulse">
              LOCK
            </div>
          )}

          {/* Click Shockwave Ring */}
          {isClicking && (
            <div className="absolute w-12 h-12 rounded-full border-2 border-cyan-300 shadow-[0_0_12px_#00f5ff] animate-ping pointer-events-none opacity-90" />
          )}
        </div>
      </div>
    </div>
  );
};
