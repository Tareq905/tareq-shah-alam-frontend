"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BiLayer } from "react-icons/bi";
import { slideInFromTop } from "@/lib/motion";
import { soundEffects } from "@/lib/audio-effects";

interface TechBox {
  name: string;
  image: string;
  category: string;
  tag: string;
  glowColor: string;
  accentBorder: string;
}

// 100% Pure AI, Machine Learning, Deep Learning, NLP & MLOps Technologies
const AI_ML_TECH_BOXES: TechBox[] = [
  {
    name: "LangGraph",
    image: "langgraph.png",
    category: "Agentic AI",
    tag: "Multi-Agent State Graph",
    glowColor: "rgba(56, 189, 248, 0.5)",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
  },
  {
    name: "LangChain",
    image: "langchain.png",
    category: "Agentic AI",
    tag: "Tool Orchestration",
    glowColor: "rgba(168, 85, 247, 0.5)",
    accentBorder: "border-purple-500/40 hover:border-purple-400",
  },
  {
    name: "LLM & Fine-Tuning",
    image: "llm.png",
    category: "Generative AI",
    tag: "LoRA / QLoRA & vLLM",
    glowColor: "rgba(236, 72, 153, 0.5)",
    accentBorder: "border-pink-500/40 hover:border-pink-400",
  },
  {
    name: "AI Agents",
    image: "AI Agent.jpg",
    category: "Autonomous Systems",
    tag: "Goal Decomposition",
    glowColor: "rgba(56, 189, 248, 0.5)",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
  },
  {
    name: "Hugging Face",
    image: "higgingface.jpg",
    category: "Transformers Hub",
    tag: "Model Hub & Tokenizers",
    glowColor: "rgba(251, 191, 36, 0.5)",
    accentBorder: "border-amber-500/40 hover:border-amber-400",
  },
  {
    name: "NLP & Embeddings",
    image: "nlp.jpg",
    category: "Semantic NLP",
    tag: "Vector Search & NER",
    glowColor: "rgba(99, 102, 241, 0.5)",
    accentBorder: "border-indigo-500/40 hover:border-indigo-400",
  },
  {
    name: "Python",
    image: "python.avif",
    category: "Core AI Language",
    tag: "PyTorch & NumPy",
    glowColor: "rgba(56, 189, 248, 0.5)",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
  },
  {
    name: "Computer Vision",
    image: "what-is-nlp.avif",
    category: "Deep Learning",
    tag: "Residual CNNs",
    glowColor: "rgba(236, 72, 153, 0.5)",
    accentBorder: "border-pink-500/40 hover:border-pink-400",
  },
  {
    name: "PostgreSQL & Vector",
    image: "postgresql.png",
    category: "Vector Database",
    tag: "pgvector Similarity",
    glowColor: "rgba(56, 189, 248, 0.5)",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
  },
  {
    name: "SQL & Analytics",
    image: "sql.png",
    category: "Data Pipelines",
    tag: "Feature Extraction",
    glowColor: "rgba(34, 197, 94, 0.5)",
    accentBorder: "border-emerald-500/40 hover:border-emerald-400",
  },
  {
    name: "Docker / MLOps",
    image: "docker.png",
    category: "MLOps",
    tag: "GPU/CUDA Container",
    glowColor: "rgba(14, 165, 233, 0.5)",
    accentBorder: "border-sky-500/40 hover:border-sky-400",
  },
];

export const Skills = () => {
  const [clickedBox, setClickedBox] = useState<string | null>(null);

  // Duplicated triplet array for seamless infinite linear marquee
  const marqueeItems = [...AI_ML_TECH_BOXES, ...AI_ML_TECH_BOXES, ...AI_ML_TECH_BOXES];

  const handleBoxClick = (name: string) => {
    setClickedBox(name);
    soundEffects.playBalloonBurst();
    setTimeout(() => {
      setClickedBox(null);
    }, 700);
  };

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center w-full py-8 sm:py-10 z-20 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInFromTop}
        className="flex flex-col items-center justify-center text-center px-4 mb-10 z-20"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-[#090226]/80 text-cyan-300 text-xs font-mono mb-3 shadow-lg shadow-purple-900/20">
          <BiLayer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI / ML Neural Stream</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200">
          AI & Machine Learning{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-cyan-500">
            Tech Stream
          </span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-xl mt-2">
          A focused, continuous moving stream of modern AI frameworks, LLM tools, deep learning neural networks, and vector data systems.
        </p>
      </motion.div>

      {/* ================= SINGLE-LINE PURE AI/ML MOVING BOX MARQUEE STREAM ================= */}
      <div className="w-full relative overflow-hidden py-4 z-20 group">
        {/* Left & Right Gradient Blur Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#030014] via-[#030014]/80 to-transparent z-30 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#030014] via-[#030014]/80 to-transparent z-30 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            duration: 35, // Smooth, engaging speed
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max items-center gap-3 sm:gap-4 will-change-transform"
        >
          {marqueeItems.map((box, idx) => {
            const isClicked = clickedBox === `${box.name}-${idx}`;

            return (
              <motion.div
                key={`${box.name}-${idx}`}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleBoxClick(`${box.name}-${idx}`)}
                className={`relative shrink-0 w-[160px] sm:w-[185px] px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-b from-[#0c042a]/95 to-[#050116]/95 border ${box.accentBorder} backdrop-blur-2xl shadow-lg transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none`}
                style={{
                  boxShadow: isClicked
                    ? `0 0 25px ${box.glowColor}`
                    : `0 4px 16px rgba(0,0,0,0.5)`,
                }}
              >
                {/* Tech Logo Compact Container */}
                <div
                  className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shadow-inner"
                  style={{
                    boxShadow: `0 0 10px ${box.glowColor}`,
                  }}
                >
                  <Image
                    src={`/skills/${box.image}`}
                    alt={box.name}
                    fill
                    className="object-contain p-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    sizes="36px"
                  />
                </div>

                {/* Box Text Info */}
                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs font-bold text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                    {box.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium truncate">
                    {box.category}
                  </p>
                  <span className="text-[8.5px] font-mono text-cyan-300/90 truncate">
                    • {box.tag}
                  </span>
                </div>

                {/* Pulsing Highlight on Click */}
                {isClicked && (
                  <motion.div
                    initial={{ opacity: 0.8, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.3 }}
                    className="absolute inset-0 rounded-xl bg-cyan-400/20 pointer-events-none border border-cyan-400"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Video Background Layer */}
      <div className="w-full h-full absolute inset-0 -z-10 pointer-events-none opacity-20 flex items-center justify-center">
        <video
          className="w-full h-auto"
          preload="false"
          playsInline
          loop
          muted
          autoPlay
        >
          <source src="/videos/skills-bg.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
};
