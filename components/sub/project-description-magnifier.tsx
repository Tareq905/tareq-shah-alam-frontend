"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ProjectDescriptionMagnifierProps {
  description: string;
  className?: string;
}

export const ProjectDescriptionMagnifier: React.FC<ProjectDescriptionMagnifierProps> = ({
  description,
  className = "",
}) => {
  const [isMagnified, setIsMagnified] = useState(false);
  const [mousePos, setMousePos] = useState({ normX: 0, normY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move handler for 3D optical lens tilt and dynamic specular glare
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ normX, normY });
  };

  const handleMouseEnter = () => {
    setIsMagnified(true);
  };

  const handleMouseLeave = () => {
    setIsMagnified(false);
    setMousePos({ normX: 0, normY: 0 });
  };

  // Mobile/touch support: Close if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsMagnified(false);
      }
    };

    if (isMagnified) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isMagnified]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => setIsMagnified((prev) => !prev)}
      className={`relative mt-3 group/mag cursor-zoom-in select-none ${className}`}
    >
      {/* ================= NORMAL PREVIEW (TRUNCATED) ================= */}
      <div className="p-3 -mx-2.5 rounded-xl border border-transparent transition-all duration-300 group-hover/mag:border-cyan-500/30 group-hover/mag:bg-cyan-950/20">
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 transition-colors duration-200 group-hover/mag:text-gray-300">
          {description}
        </p>

        {/* Small subtle Magnifier Cue */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-purple-500/15 text-[11px] font-mono text-cyan-400/80 group-hover/mag:text-cyan-300 transition-colors">
          <div className="flex items-center gap-1.5">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="tracking-wide">Hover / Tap to Magnify</span>
          </div>
          <span className="text-[10px] text-purple-300/60 font-mono">1.4x Lens</span>
        </div>
      </div>

      {/* ================= OPTICAL MAGNIFYING GLASS LENS (FULL TEXT, ZERO SCROLL) ================= */}
      <AnimatePresence>
        {isMagnified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1.03, y: -6 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            style={{
              transform: `perspective(700px) rotateX(${-mousePos.normY * 8}deg) rotateY(${mousePos.normX * 8}deg)`,
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%+24px)] z-50 rounded-2xl bg-[#080221]/98 border-2 border-cyan-400 shadow-[0_0_45px_rgba(6,182,212,0.5),0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between overflow-visible cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Convex Glass Lens Glare / Reflection --- */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-transform duration-100 ease-out"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
                transform: `translate(${mousePos.normX * 25}px, ${mousePos.normY * 25}px)`,
              }}
            />

            {/* Subtle chromatic aberration edge glow */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_0_22px_rgba(6,182,212,0.35)]" />

            {/* --- Top Magnifier HUD Header --- */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-cyan-500/30 text-[10px] sm:text-xs font-mono shrink-0">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <MagnifyingGlassIcon
                  className="w-4 h-4 text-cyan-400 animate-spin"
                  style={{ animationDuration: "12s" }}
                />
                <span>MAGNIFIER LENS</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/40 text-[9px]">
                  1.4X OPTICAL ZOOM
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-purple-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                <span className="hidden sm:inline">FULL TEXT</span>
              </div>
            </div>

            {/* --- Full Magnified Text (Uncut, Zoomed In, Zero Scrolling Required) --- */}
            <div className="select-text">
              <p className="text-white text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-line font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {description}
              </p>
            </div>

            {/* --- Bottom Status & Physical Magnifying Handle Accent --- */}
            <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-purple-500/20 text-[10px] font-mono shrink-0">
              <span className="text-gray-400/90 italic">
                Move mouse away to auto-close
              </span>

              {/* Magnifying Glass Physical Handle Accent */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                title="Optical Magnifier Lens Active"
              >
                <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
