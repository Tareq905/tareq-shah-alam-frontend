"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  { threshold: 0, text: "INITIALIZING NEURAL CORE..." },
  { threshold: 22, text: "CALIBRATING PYTORCH & CUDA 12..." },
  { threshold: 48, text: "LOADING TRANSFORMERS & LLM AGENTS..." },
  { threshold: 72, text: "SYNCHRONIZING VECTOR WORKFLOWS..." },
  { threshold: 92, text: "ESTABLISHING QUANTUM LINK..." },
  { threshold: 100, text: "SYSTEM ONLINE — WELCOME" },
];

export const Preloader = () => {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"loading" | "welcome" | "shutting_down" | "complete">("loading");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL CORE...");

  const [isWelcomeReady, setIsWelcomeReady] = useState(false);

  // Handler to transition from welcome screen into main portfolio with TV-Off & Focus Reveal
  const enterPortfolio = useCallback(() => {
    if (stage === "shutting_down" || stage === "complete") return;

    // Pin viewport to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    // Keep scroll strictly locked
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Trigger TV-Off Shutoff State
    setStage("shutting_down");

    // Dispatch Chromar focus-reveal event for the main portfolio
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("portfolio_focus_reveal"));
    }

    try {
      sessionStorage.setItem("portfolio_intro_seen", "true");
    } catch {
      // Ignore in restricted environments
    }

    // Complete transition after TV-Off + Chromar effect finishes (~1050ms)
    setTimeout(() => {
      setStage("complete");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }, 1050);
  }, [stage]);

  useEffect(() => {
    setMounted(true);

    // Check if intro has already played in this running session
    try {
      const hasSeenIntro = sessionStorage.getItem("portfolio_intro_seen");
      let isReload = false;

      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].type === "reload") {
        isReload = true;
      }

      // If user has already seen it and it is not a page reload, skip immediately
      if (hasSeenIntro && !isReload) {
        setStage("complete");
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
        return;
      }
    } catch {
      // Fallback
    }

    // Lock scroll during intro loading and welcome screen
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1; // 1 to 3% smooth increments
      current = Math.min(current + increment, 100);
      setProgress(current);

      const currentStatus = [...STATUS_MESSAGES]
        .reverse()
        .find((s) => current >= s.threshold);
      if (currentStatus) {
        setStatusText(currentStatus.text);
      }

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStage("welcome");
          // Allow scrolling only after welcome elements have smoothly settled
          setTimeout(() => {
            setIsWelcomeReady(true);
          }, 500);
        }, 400); // Transition to Welcome Splash screen
      }
    }, 45); // Deliberate cadence (~2.6 seconds)

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  // When on the Welcome screen, advance EXCLUSIVELY when user scrolls with mouse wheel (or mobile touch swipe)
  useEffect(() => {
    if (stage !== "welcome" || !isWelcomeReady) return;

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Trigger strictly on mouse wheel scroll
      if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
        enterPortfolio();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      // If user swipes to scroll on touch device
      if (Math.abs(touchStartY - currentY) > 15) {
        e.preventDefault();
        enterPortfolio();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [stage, isWelcomeReady, enterPortfolio]);

  if (!mounted || stage === "complete") {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro-overlay"
        suppressHydrationWarning
        initial={{ opacity: 1 }}
        className={`fixed inset-0 z-[9999] bg-[#030014] flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden origin-center ${
          stage === "shutting_down" ? "portal-tear-active pointer-events-none" : ""
        }`}
      >
        {/* Pulsing Torn Hole Shockwave Quantum Ring */}
        {stage === "shutting_down" && (
          <div className="torn-shockwave" />
        )}

        {/* Cosmic Portfolio Ambient Glowing Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Subtle Status Bar */}
          <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest px-2 sm:px-8 z-10">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-cyan-300 font-semibold">
                {stage === "loading" ? "BOOT_SEQUENCE" : "PORTFOLIO_READY"}
              </span>
            </span>
            <span className="text-purple-300">TAREQ_AI_v2.6</span>
          </div>

          {/* ================= STAGE 1: LOADING PERCENTAGE ================= */}
          {stage === "loading" && (
            <motion.div
              key="stage-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center my-auto z-10 w-full max-w-md"
            >
              {/* Stylish Brand Logo */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-3 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                <Image
                  src="/skills/tareq-logo-clean.png"
                  alt="Tareq Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Large Futuristic Percentage Display */}
              <div className="relative font-mono font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-indigo-400 drop-shadow-[0_0_35px_rgba(112,66,248,0.5)]">
                {progress}
                <span className="text-4xl sm:text-5xl md:text-6xl text-cyan-400 ml-1 font-light opacity-90">%</span>
              </div>

              {/* Glowing Progress Bar */}
              <div className="w-full max-w-xs h-1.5 bg-[#120638] rounded-full overflow-hidden mt-6 border border-purple-500/30 p-[1px] shadow-[0_0_15px_rgba(112,66,248,0.4)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_12px_#06b6d4]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Dynamic Status Text */}
              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-300/90 tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{statusText}</span>
              </div>
            </motion.div>
          )}

          {/* ================= STAGE 2: WELCOME SPLASH SCREEN ================= */}
          {(stage === "welcome" || stage === "shutting_down") && (
            <motion.div
              key="stage-welcome"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center my-auto z-10 max-w-2xl px-4"
            >
              {/* Profile Avatar Glow Pill */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 mb-6 shadow-[0_0_35px_rgba(112,66,248,0.6)] group overflow-hidden">
                <Image
                  src="/md-tareq-shah-alam.jpg"
                  alt="Md Tareq Shah Alam"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Greeting Text */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-gray-300 font-light text-base sm:text-xl md:text-2xl tracking-wide mb-2"
              >
                Hi, my name is
              </motion.div>

              {/* Bold Name with Standard Balanced Size */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-indigo-300 drop-shadow-[0_0_30px_rgba(112,66,248,0.5)]"
              >
                Md Tareq Shah Alam.
              </motion.h1>

              {/* Sub-headline */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-3 text-sm sm:text-lg md:text-xl text-cyan-400/90 font-mono"
              >
                Welcome to my Portfolio
              </motion.div>

              {/* Prompt with Animated Downward Scroll Pulse */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ delay: 0.6, duration: 2, repeat: Infinity }}
                className="mt-12 flex flex-col items-center gap-2"
              >
                {/* Glowing vertical indicator line */}
                <div className="w-[2px] h-7 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full animate-pulse shadow-[0_0_12px_#06b6d4]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-gray-500 uppercase">
                  SCROLL TO ENTER
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Bottom Watermark */}
          <div className="w-full text-center text-[10px] sm:text-xs font-mono text-gray-600 tracking-[0.3em] uppercase z-10">
            MD TAREQ SHAH ALAM &bull; 2026
          </div>
        </motion.div>
    </AnimatePresence>
  );
};
