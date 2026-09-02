"use client";

import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { AiHeroVisual } from "@/components/sub/ai-hero-visual";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import { usePortfolio } from "@/context/portfolio-context";

const SKILL_TAGS = [
  "NLP",
  "Transformers",
  "CNN",
  "LangChain",
  "LlamaIndex",
  "SQL",
  "Deep Learning",
  "Generative AI",
];

const ROLES = [
  "Machine Learning Engineer",
  "Data Scientist",
  "NLP & LLM Specialist",
  "Generative AI Developer",
  "Deep Learning Practitioner",
];

export const HeroContent = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const { siteSetting } = usePortfolio();

  const blogUrl = siteSetting?.blog_url || "https://medium.com/@tareqshahalam";

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-between px-4 sm:px-8 md:px-20 mt-28 sm:mt-36 md:mt-40 w-full z-[20]"
    >
      <div className="h-full w-full lg:w-[54%] flex flex-col gap-4 sm:gap-5 justify-center m-auto text-start">
        {/* Welcome Badge */}
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[6px] sm:py-[8px] px-[10px] sm:px-[12px] border border-[#7042f88b] opacity-[0.9] w-fit"
        >
          <SparklesIcon className="text-[#b49bff] mr-[8px] h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          <h1 className="Welcome-text text-[11px] sm:text-[13px] tracking-wide">
            Machine Learning & Data Science Portfolio
          </h1>
        </motion.div>

        {/* Main Name & Animated Headline */}
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-4 text-3xl sm:text-5xl md:text-6xl font-bold text-white max-w-[650px] w-auto h-auto leading-tight"
        >
          <span>
            Hi, I&apos;m{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-500">
              Md Tareq Shah Alam
            </span>
          </span>

          <div className="h-[40px] sm:h-[58px] overflow-hidden flex items-center text-xl sm:text-3xl md:text-4xl text-gray-300 font-semibold">
            <span className="mr-2 text-gray-400 text-base sm:text-2xl font-normal">I build with</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLES[roleIndex]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-bold"
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Animated Skill Badges */}
        <motion.div
          variants={slideInFromLeft(0.65)}
          className="flex flex-wrap gap-1.5 sm:gap-2 my-1 max-w-[620px]"
        >
          {SKILL_TAGS.map((tag, idx) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08 * idx, duration: 0.3 }}
              className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-sm font-medium rounded-full bg-[rgba(112,66,248,0.15)] border border-[#7042f866] text-purple-200 shadow-sm shadow-[#2A0E61]/40 hover:border-cyan-400 hover:text-cyan-300 transition duration-300 cursor-default"
            >
              #{tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Bio / Description */}
        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-sm sm:text-base md:text-lg text-gray-400 my-1 sm:my-2 max-w-[600px] leading-relaxed"
        >
          Passionate about extracting actionable insights from data and architecting cutting-edge AI solutions. Specializing in <span className="text-gray-200 font-medium">NLP, Transformers, CNNs, LangChain, LlamaIndex,</span> and <span className="text-gray-200 font-medium">advanced SQL workflows</span> to solve complex real-world challenges.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-wrap gap-3 sm:gap-4 items-center mt-2"
        >
          <Link
            href="#projects"
            className="py-2.5 px-6 button-primary text-center text-white text-xs sm:text-sm cursor-pointer rounded-xl font-medium shadow-lg hover:shadow-cyan-500/20 transition duration-300"
          >
            Explore Projects
          </Link>
          <a
            href={blogUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="py-2.5 px-6 border border-[#7042f88b] bg-[rgba(3,0,20,0.6)] hover:bg-[#7042f822] text-center text-purple-200 text-xs sm:text-sm cursor-pointer rounded-xl font-medium transition duration-300"
          >
            Read Articles
          </a>
        </motion.div>
      </div>

      {/* Right Visual AI & Data Science Orbitals (Desktop Only for Clean & Fresh Mobile Experience) */}
      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full lg:w-[46%] hidden lg:flex justify-center items-center overflow-hidden py-4"
      >
        <AiHeroVisual />
      </motion.div>
    </motion.div>
  );
};
