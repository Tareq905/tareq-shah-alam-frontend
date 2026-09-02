"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { soundEffects } from "@/lib/audio-effects";

interface SkillNode {
  name: string;
  image: string;
  angle: number; // in degrees
  radius: number; // distance from center in px
  size: number;
  glowColor: string;
}

interface ExplosionParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

const INNER_SKILLS: SkillNode[] = [
  {
    name: "Python",
    image: "/skills/python.avif",
    angle: 0,
    radius: 130,
    size: 56,
    glowColor: "rgba(56, 189, 248, 0.4)",
  },
  {
    name: "LangChain",
    image: "/skills/langchain.png",
    angle: 90,
    radius: 130,
    size: 56,
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    name: "LLM",
    image: "/skills/llm.png",
    angle: 180,
    radius: 130,
    size: 56,
    glowColor: "rgba(236, 72, 153, 0.4)",
  },
  {
    name: "NLP",
    image: "/skills/nlp.jpg",
    angle: 270,
    radius: 130,
    size: 56,
    glowColor: "rgba(99, 102, 241, 0.4)",
  },
];

const OUTER_SKILLS: SkillNode[] = [
  {
    name: "AI Agents",
    image: "/skills/AI Agent.jpg",
    angle: 30,
    radius: 230,
    size: 60,
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    name: "LangGraph",
    image: "/skills/langgraph.png",
    angle: 105,
    radius: 230,
    size: 60,
    glowColor: "rgba(56, 189, 248, 0.4)",
  },
  {
    name: "Hugging Face",
    image: "/skills/higgingface.jpg",
    angle: 180,
    radius: 230,
    size: 60,
    glowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    name: "SQL",
    image: "/skills/sql.png",
    angle: 255,
    radius: 230,
    size: 56,
    glowColor: "rgba(34, 197, 94, 0.4)",
  },
  {
    name: "Docker / MLOps",
    image: "/skills/docker.png",
    angle: 330,
    radius: 230,
    size: 56,
    glowColor: "rgba(14, 165, 233, 0.4)",
  },
];

const PARTICLE_COLORS = [
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#ec4899", // pink
  "#3b82f6", // blue
  "#fbbf24", // amber
  "#ffffff", // white spark
];

const TOTAL_HOLD_DURATION_MS = 3000; // Exactly 3 seconds

export const AiHeroVisual = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [inflationProgress, setInflationProgress] = useState(0); // 0 to 100
  const [isPopped, setIsPopped] = useState(false);
  const [particles, setParticles] = useState<ExplosionParticle[]>([]);

  const isHoldingRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Trigger balloon burst explosion
  const triggerBurst = useCallback(() => {
    isHoldingRef.current = false;
    setIsHolding(false);
    setIsPopped(true);
    setInflationProgress(100);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Play loud punchy balloon blast & shockwave boom
    soundEffects.playBalloonBurst();

    // Generate 36 radial explosion sparks in 360 degrees
    const newParticles: ExplosionParticle[] = Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      angle: (i * 360) / 36 + (Math.random() * 15 - 7.5),
      distance: 140 + Math.random() * 160,
      size: 4 + Math.random() * 8,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));
    setParticles(newParticles);

    // Rebirth / Reset after explosion
    setTimeout(() => {
      setIsPopped(false);
      setInflationProgress(0);
      setParticles([]);
    }, 1200);
  }, []);

  // Stop hold handler (early release)
  const handleRelease = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    setIsHolding(false);

    // Stop energy sound
    soundEffects.stopEnergyCharge();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Deflate back to 0
    setInflationProgress(0);
  }, []);

  // Global window listeners for foolproof pointer release
  useEffect(() => {
    const onGlobalPointerUp = () => {
      if (isHoldingRef.current) {
        handleRelease();
      }
    };

    window.addEventListener("mouseup", onGlobalPointerUp);
    window.addEventListener("touchend", onGlobalPointerUp);
    window.addEventListener("touchcancel", onGlobalPointerUp);

    return () => {
      window.removeEventListener("mouseup", onGlobalPointerUp);
      window.removeEventListener("touchend", onGlobalPointerUp);
      window.removeEventListener("touchcancel", onGlobalPointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      soundEffects.stopEnergyCharge();
    };
  }, [handleRelease]);

  // Start hold to inflate with 3-second energy sound
  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPopped) return;
    e.stopPropagation();

    isHoldingRef.current = true;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    // Start 3-second ascending energy sound
    soundEffects.startEnergyCharge(3.0);

    // Animation frame loop for continuous, uninterrupted progression
    const updateFrame = () => {
      if (!isHoldingRef.current || !startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / TOTAL_HOLD_DURATION_MS) * 100, 100);

      setInflationProgress(progress);

      if (progress >= 100) {
        triggerBurst();
      } else {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateFrame);
  };

  // Calculate current balloon scale and jitter
  const balloonScale = 1 + (inflationProgress / 100) * 2.0; // scale from 1.0 to 3.0
  const jitterOffset = inflationProgress > 45 ? (inflationProgress / 100) * 5 : 0;
  const remainingSeconds = Math.max(0, (TOTAL_HOLD_DURATION_MS * (1 - inflationProgress / 100)) / 1000).toFixed(1);

  return (
    <div className="relative w-[520px] h-[520px] xl:w-[600px] xl:h-[600px] flex items-center justify-center select-none">
      {/* Background ambient cosmic glow */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-purple-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10 animate-pulse" />

      {/* ================= BURST EXPLOSION PARTICLES & SHOCKWAVES ================= */}
      <AnimatePresence>
        {isPopped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            {/* Primary expanding plasma shockwave ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1, borderWidth: 10 }}
              animate={{ scale: 5.0, opacity: 0, borderWidth: 1 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full border-cyan-400 shadow-[0_0_60px_#06b6d4]"
            />

            {/* Secondary purple shockwave ring */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1, borderWidth: 8 }}
              animate={{ scale: 4.2, opacity: 0, borderWidth: 1 }}
              transition={{ duration: 0.75, delay: 0.06, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full border-purple-500 shadow-[0_0_60px_#a855f7]"
            />

            {/* Radiant flash */}
            <motion.div
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 4.0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 blur-md"
            />

            {/* 360-Degree Radial Explosion Particles */}
            {particles.map((p) => {
              const rad = (p.angle * Math.PI) / 180;
              const targetX = Math.cos(rad) * p.distance;
              const targetY = Math.sin(rad) * p.distance;

              return (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1.6, opacity: 1 }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8 + Math.random() * 0.3, ease: "easeOut" }}
                  style={{
                    backgroundColor: p.color,
                    width: p.size,
                    height: p.size,
                    boxShadow: `0 0 14px ${p.color}`,
                  }}
                  className="absolute rounded-full"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ================= 3-SECOND INFLATABLE BALLOON CORE ================= */}
      <AnimatePresence mode="wait">
        {!isPopped && (
          <motion.div
            key="balloon-core"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: balloonScale,
              opacity: 1,
              x: isHolding ? [0, -jitterOffset, jitterOffset, -jitterOffset, 0] : 0,
              y: isHolding ? [0, jitterOffset, -jitterOffset, jitterOffset, 0] : 0,
              boxShadow: isHolding
                ? [
                    `0 0 ${35 + inflationProgress * 1.5}px rgba(6,182,212,${0.6 + inflationProgress / 180}), inset 0 0 ${20 + inflationProgress / 1.5}px rgba(236,72,153,0.85)`,
                    `0 0 ${50 + inflationProgress * 1.8}px rgba(168,85,247,${0.8 + inflationProgress / 200}), inset 0 0 ${25 + inflationProgress / 1.5}px rgba(6,182,212,0.95)`,
                  ]
                : [
                    "0 0 25px rgba(112,66,248,0.5), inset 0 0 15px rgba(56,189,248,0.4)",
                    "0 0 45px rgba(56,189,248,0.7), inset 0 0 25px rgba(112,66,248,0.6)",
                    "0 0 25px rgba(112,66,248,0.5), inset 0 0 15px rgba(56,189,248,0.4)",
                  ],
            }}
            exit={{ scale: 3.5, opacity: 0 }}
            transition={{
              scale: isHolding ? { duration: 0.05 } : { duration: 0.5, type: "spring", bounce: 0.4 },
              x: { duration: 0.06, repeat: isHolding ? Infinity : 0 },
              y: { duration: 0.06, repeat: isHolding ? Infinity : 0 },
              boxShadow: { duration: isHolding ? 0.15 : 4, repeat: Infinity, ease: "easeInOut" },
            }}
            onMouseDown={startHold}
            onTouchStart={startHold}
            className="relative z-30 w-24 h-24 rounded-full bg-[#07011a]/95 border-2 border-cyan-400/80 backdrop-blur-xl flex flex-col items-center justify-center p-2 text-center group cursor-pointer shadow-2xl transition-colors duration-150 touch-none"
            title="Press and hold for 3 seconds to inflate and pop with sound!"
          >
            {/* Dynamic visual emoji indicator */}
            <div className={`text-2xl transition-transform ${isHolding ? "scale-135" : "animate-bounce"}`}>
              {inflationProgress > 85 ? "💥" : inflationProgress > 45 ? "⚡" : isHolding ? "🔊" : "🧠"}
            </div>

            <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 whitespace-nowrap">
              {inflationProgress > 85
                ? "BOOM!"
                : inflationProgress > 50
                ? "CHARGING..."
                : isHolding
                ? "HOLD 3s..."
                : "AI & ML"}
            </span>

            <span className="text-[9px] text-cyan-300 font-mono font-bold">
              {isHolding ? `${remainingSeconds}s` : "Core"}
            </span>

            {/* Orbit pulse ripples */}
            {!isHolding && (
              <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-ping pointer-events-none opacity-40" />
            )}

            {/* Interactive hint tooltip on hover */}
            {!isHolding && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[10px] font-mono bg-[#050114]/90 px-2.5 py-0.5 rounded-full border border-cyan-400/50 text-cyan-300 shadow-lg flex items-center gap-1">
                  <span>🎈 Hold 3s to Pop</span>
                  <span>🔊</span>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INNER ORBIT ================= */}
      <div className="absolute w-[260px] h-[260px] rounded-full border border-purple-500/25 border-dashed pointer-events-none" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute w-[260px] h-[260px] rounded-full flex items-center justify-center"
      >
        {INNER_SKILLS.map((skill) => {
          const rad = (skill.angle * Math.PI) / 180;
          const x = Math.cos(rad) * skill.radius;
          const y = Math.sin(rad) * skill.radius;

          return (
            <div
              key={skill.name}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 1.3, zIndex: 50 }}
                className="group relative flex flex-col items-center justify-center p-2 rounded-2xl bg-[#090224]/90 border border-[#7042f8]/60 backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl shadow-lg z-10 hover:z-50"
                style={{
                  boxShadow: `0 0 15px ${skill.glowColor}`,
                }}
              >
                <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-black/50">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-contain p-1"
                    sizes="40px"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                  <span className="text-[11px] font-bold text-cyan-300 whitespace-nowrap bg-[#030014]/95 px-2.5 py-1 rounded-md border border-cyan-400 shadow-xl shadow-cyan-500/20 block text-center">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* ================= OUTER ORBIT ================= */}
      <div className="absolute w-[460px] h-[460px] rounded-full border border-cyan-500/20 border-dotted pointer-events-none" />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        className="absolute w-[460px] h-[460px] rounded-full flex items-center justify-center"
      >
        {OUTER_SKILLS.map((skill) => {
          const rad = (skill.angle * Math.PI) / 180;
          const x = Math.cos(rad) * skill.radius;
          const y = Math.sin(rad) * skill.radius;

          return (
            <div
              key={skill.name}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 1.35, zIndex: 50 }}
                className="group relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#080220]/95 border border-purple-500/50 backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl shadow-xl z-10 hover:z-50"
                style={{
                  boxShadow: `0 0 18px ${skill.glowColor}`,
                }}
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-black/50">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-contain p-1"
                    sizes="44px"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                  <span className="text-[11px] font-bold text-purple-200 whitespace-nowrap bg-[#030014]/95 px-2.5 py-1 rounded-md border border-purple-400 shadow-xl shadow-purple-500/20 block text-center">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
