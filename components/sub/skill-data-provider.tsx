"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

type SkillDataProviderProps = {
  src: string;
  name: string;
  width: number;
  height: number;
  index: number;
};

export const SkillDataProvider = ({
  src,
  name,
  width,
  height,
  index,
}: SkillDataProviderProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const [isClicked, setIsClicked] = useState(false);
  const [clickRipples, setClickRipples] = useState<number[]>([]);

  // Unique float animation timing per orb for natural organic constellation feel
  const floatDuration = 3.5 + (index % 4) * 0.6;
  const floatDelay = (index % 5) * 0.4;
  const floatOffset = 6 + (index % 3) * 3;

  const handleClick = () => {
    setIsClicked(true);
    const rippleId = Date.now();
    setClickRipples((prev) => [...prev, rippleId]);

    setTimeout(() => {
      setClickRipples((prev) => prev.filter((id) => id !== rippleId));
      setIsClicked(false);
    }, 1200);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: 1,
              y: [-floatOffset, floatOffset, -floatOffset],
            }
          : { opacity: 0, scale: 0.5 }
      }
      transition={{
        opacity: { duration: 0.5, delay: index * 0.05 },
        scale: { duration: 0.5, delay: index * 0.05 },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
      whileHover={{ scale: 1.2, zIndex: 30 }}
      whileTap={{ scale: 0.88 }}
      onClick={handleClick}
      className="relative group flex flex-col items-center justify-center m-2 cursor-pointer select-none"
    >
      {/* Shockwave Rings on Click */}
      <AnimatePresence>
        {clickRipples.map((id) => (
          <motion.div
            key={id}
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-20 h-20 rounded-full border-2 border-cyan-400 pointer-events-none z-10 shadow-[0_0_20px_#06b6d4]"
          />
        ))}
      </AnimatePresence>

      {/* 3D Cosmic Ball Shell */}
      <div
        className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-3 flex flex-col items-center justify-center transition-all duration-300 ${
          isClicked
            ? "bg-gradient-to-tr from-cyan-500/40 via-purple-600/50 to-blue-500/40 border-2 border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-110"
            : "bg-[#0b032b]/85 border border-[#7042f8]/60 hover:border-cyan-400 shadow-xl shadow-[#190640]/80 hover:shadow-[0_0_25px_rgba(112,66,248,0.7)]"
        } backdrop-blur-xl`}
      >
        {/* Top 3D Specular Highlight Gloss */}
        <div className="absolute top-1.5 left-2.5 w-7 h-4 bg-white/25 rounded-full blur-[1.5px] -rotate-35 pointer-events-none" />

        {/* Ambient Ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

        {/* Image Icon inside Sphere */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
          <Image
            src={`/skills/${src}`}
            alt={name}
            fill
            className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:rotate-6 transition-transform duration-300"
            sizes="48px"
          />
        </div>

        {/* Pulsing Core on Click */}
        {isClicked && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.8 }}
            className="absolute inset-0 rounded-full bg-cyan-400/30 blur-sm pointer-events-none"
          />
        )}
      </div>

      {/* Ball Label Below */}
      <motion.div
        animate={isClicked ? { y: 2, scale: 1.1 } : { y: 0, scale: 1 }}
        className="mt-2 text-center"
      >
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all duration-300 ${
            isClicked
              ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono shadow-[0_0_10px_#06b6d4]"
              : "bg-[#06011c]/70 border border-purple-500/20 text-gray-300 group-hover:text-cyan-300 group-hover:border-cyan-400/50"
          }`}
        >
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
};
