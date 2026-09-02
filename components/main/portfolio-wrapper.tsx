"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const PortfolioWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check if intro has already been seen in this session
    try {
      const hasSeen = sessionStorage.getItem("portfolio_intro_seen");
      if (hasSeen) {
        setIsRevealed(true);
      }
    } catch {
      setIsRevealed(true);
    }

    const handleReveal = () => {
      setIsTransitioning(true);
      setIsRevealed(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1250);
    };

    window.addEventListener("portfolio_focus_reveal", handleReveal);
    return () => {
      window.removeEventListener("portfolio_focus_reveal", handleReveal);
    };
  }, []);

  return (
    <motion.div
      initial={{
        opacity: isRevealed ? 1 : 0.8,
        scale: isRevealed ? 1 : 1.03,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.15,
        ease: [0.22, 1, 0.36, 1], // Standard smooth natural curve
      }}
      className={`h-full w-full ${isTransitioning ? "transition-transform" : ""}`}
    >
      {children}
    </motion.div>
  );
};
