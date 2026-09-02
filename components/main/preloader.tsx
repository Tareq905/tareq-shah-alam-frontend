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
  const [stage, setStage] = useState<"loading" | "welcome" | "complete">("loading");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL CORE...");

  // Handler to transition from welcome screen into main portfolio
  const enterPortfolio = useCallback(() => {
    setStage("complete");
    try {
      sessionStorage.setItem("portfolio_intro_seen", "true");
    } catch {
      // Ignore in restricted environments
    }
    document.body.style.overflow = "unset";
  }, []);

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
        return;
      }
    } catch {
      // Fallback
    }

    // Lock scroll during intro loading and welcome screen
    document.body.style.overflow = "hidden";

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
        }, 400); // Transition to Welcome Splash screen
      }
    }, 45); // Slower, deliberate cadence (~2.6 seconds)

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, []);

  // When on the Welcome screen, advance EXCLUSIVELY when user scrolls with mouse wheel (or mobile touch swipe)
  useEffect(() => {
    if (stage !== "welcome") return;

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
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
        enterPortfolio();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [stage, enterPortfolio]);

  if (!mounted || stage === "complete") {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro-overlay"
        suppressHydrationWarning
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.04,
          filter: "blur(16px)",
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed inset-0 z-[9999] bg-[#030014] flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden"
      >
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

              {/* Typography "TAREQ" */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-cyan-200 to-white font-serif drop-shadow-[0_2px_20px_rgba(112,66,248,0.7)]">
                TAREQ
              </h2>
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase mt-1 mb-6">
                Machine Learning & Data Science
              </span>

              {/* Big Stylish Percentage Counter */}
              <div className="flex items-baseline justify-center mb-5">
                <span className="text-6xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-purple-200 font-mono tracking-tighter drop-shadow-[0_0_35px_rgba(112,66,248,0.45)]">
                  {progress}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono ml-1.5 opacity-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                  %
                </span>
              </div>

              {/* Glowing Purple & Cyan Progress Bar */}
              <div className="w-full max-w-[280px] sm:max-w-[340px] h-[3.5px] bg-[#090226] border border-purple-500/30 rounded-full overflow-hidden relative shadow-inner mb-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_16px_#06b6d4]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status Message */}
              <p className="text-[11px] sm:text-xs font-mono text-cyan-300/90 tracking-wider h-5 flex items-center justify-center">
                {statusText}
              </p>
            </motion.div>
          )}

          {/* ================= STAGE 2: WELCOME SPLASH SCREEN (mubx.dev style) ================= */}
          {stage === "welcome" && (
            <motion.div
              key="stage-welcome"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 1.05, filter: "blur(12px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center text-center my-auto z-10 w-full max-w-4xl px-4"
            >
              {/* Top Logo Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative w-11 h-11 sm:w-13 sm:h-13 mb-5 sm:mb-6 drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]"
              >
                <Image
                  src="/skills/tareq-logo-clean.png"
                  alt="Tareq Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Sub-heading "Hi, my name is" */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-400 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-3"
              >
                Hi, my name is
              </motion.p>

              {/* Main Headline: "Md Tareq Shah Alam." in Standard Balanced Size */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-5 leading-tight flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5"
              >
                <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">
                  Md Tareq
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.75)]">
                  Shah Alam.
                </span>
              </motion.h1>

              {/* "Welcome to my Portfolio" */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-300 font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase text-center"
              >
                Welcome to my Portfolio
              </motion.p>

              {/* Subtle Scroll prompt with pulsing vertical beam */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-10 sm:mt-12 flex flex-col items-center gap-2.5 select-none pointer-events-none"
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
