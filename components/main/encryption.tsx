"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { AiChatInterface } from "@/components/sub/ai-chat-interface";
import { Terminal } from "@/components/cli/terminal";
import { slideInFromTop } from "@/lib/motion";

export const Encryption = () => {
  const [activeView, setActiveView] = useState<"vault" | "terminal">("vault");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  // Hold-to-unlock handler
  const startHold = () => {
    if (isUnlocked) return;
    isHoldingRef.current = true;

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          isHoldingRef.current = false;
          setIsUnlocked(true);
          return 100;
        }
        return prev + 4; // ~1.25 seconds to fill
      });
    }, 50);
  };

  const stopHold = () => {
    if (isUnlocked) return;
    isHoldingRef.current = false;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col relative items-center justify-center min-h-fit w-full py-12 sm:py-16 overflow-hidden select-none px-4">
      {/* Top Header */}
      <div className="z-[25] text-center px-2 sm:px-4 max-w-3xl mb-8">
        <motion.div
          variants={slideInFromTop}
          className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center text-gray-200 tracking-tight"
        >
          Data Intelligence{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-500">
            & Neural Assistant
          </span>
        </motion.div>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
          {activeView === "terminal"
            ? "Interactive ML/AI Engineer Terminal Shell Workstation (Linux / Bash)"
            : isUnlocked
            ? "Interactive AI Assistant powered by Groq LLM inference"
            : "Hold down the neural vault to unlock the AI Chatbot or launch the CLI Terminal"}
        </p>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
          <button
            type="button"
            onClick={() => setActiveView("vault")}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
              activeView === "vault"
                ? "bg-purple-600/80 text-white border border-purple-400 shadow-md shadow-purple-600/30"
                : "bg-[#090226]/80 text-gray-400 hover:text-gray-200 border border-purple-500/20"
            }`}
          >
            🔒 Neural Vault (AI Chat)
          </button>
          <button
            type="button"
            onClick={() => setActiveView("terminal")}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
              activeView === "terminal"
                ? "bg-cyan-600/80 text-white border border-cyan-400 shadow-md shadow-cyan-600/30"
                : "bg-[#090226]/80 text-cyan-300 hover:text-white border border-cyan-500/30"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>💻 CLI Terminal</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Center Section */}
      <div className="relative z-[30] w-full max-w-5xl px-2 sm:px-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {activeView === "terminal" ? (
            /* ================= INTERACTIVE TERMINAL VIEW ================= */
            <motion.div
              key="cli-terminal-view"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <Terminal onClose={() => setActiveView("vault")} />
            </motion.div>
          ) : !isUnlocked ? (
            /* ================= LOCKED VAULT STATE ================= */
            <motion.div
              key="locked-vault"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Interactive Hold-to-Unlock Button */}
              <div
                onMouseDown={startHold}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={startHold}
                onTouchEnd={stopHold}
                className="relative group cursor-pointer flex flex-col items-center justify-center p-8"
              >
                {/* SVG Radial Progress Ring */}
                <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="85"
                    className="stroke-purple-900/40"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="85"
                    stroke="url(#gradient-unlock)"
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 85}
                    strokeDashoffset={
                      2 * Math.PI * 85 * (1 - holdProgress / 100)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-75"
                  />
                  <defs>
                    <linearGradient
                      id="gradient-unlock"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Animated Lock Assembly inside the ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {/* Lock Top Shackle */}
                  <motion.div
                    animate={{
                      y: holdProgress > 0 ? -14 * (holdProgress / 100) : 0,
                      rotate: holdProgress > 60 ? 18 * ((holdProgress - 60) / 40) : 0,
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    <Image
                      src="/lock-top.png"
                      alt="Lock top"
                      width={50}
                      height={50}
                      className="transition-all duration-200"
                    />
                  </motion.div>

                  {/* Lock Body */}
                  <Image
                    src="/lock-main.png"
                    alt="Lock main"
                    width={70}
                    height={70}
                    className="z-10 -mt-2"
                  />

                  {/* Progress percentage label */}
                  <span className="text-xs font-mono font-bold text-cyan-300 mt-2">
                    {holdProgress > 0 ? `${holdProgress}%` : "HOLD"}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="Welcome-box px-[20px] py-[6px] z-[20] border mt-2 border-[#7042F88B] bg-[#030014]/80 backdrop-blur-md shadow-lg shadow-purple-500/20">
                <span className="Welcome-text text-[13px] font-medium tracking-wide">
                  {holdProgress > 0
                    ? "Decrypting Neural Assistant..."
                    : "Press & Hold to Unlock AI Chatbot"}
                </span>
              </div>

              {/* Quick Jump to CLI Button */}
              <button
                onClick={() => setActiveView("terminal")}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a0329]/90 hover:bg-[#14064a] border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 text-xs font-mono font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Or Launch Interactive CLI Terminal (tareq@ml:~$) 💻</span>
              </button>
            </motion.div>
          ) : (
            /* ================= UNLOCKED STATE (AI CHAT INTERFACE) ================= */
            <motion.div
              key="unlocked-chat"
              initial={{ scale: 0.88, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full flex justify-center"
            >
              <AiChatInterface
                onLock={() => {
                  setIsUnlocked(false);
                  setHoldProgress(0);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Subtitle / Helper */}
      <div className="absolute z-[20] bottom-4 px-4 text-center">
        <div className="cursive text-base sm:text-xl font-medium text-gray-400">
          {isUnlocked
            ? "Ask anything about Tareq's ML expertise or chat with Groq LLM"
            : "Data unlocks intelligence when models learn to reason"}
        </div>
      </div>

      {/* Background Video */}
      <div className="w-full flex items-start justify-center absolute inset-0 -z-20 opacity-70">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-full object-cover"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

