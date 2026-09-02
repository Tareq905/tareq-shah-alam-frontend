"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { FaBrain, FaMicrochip, FaDatabase, FaRocket } from "react-icons/fa";
import { RxArrowTopRight } from "react-icons/rx";
import { VscTerminal } from "react-icons/vsc";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/lib/motion";
import { usePortfolio } from "@/context/portfolio-context";

export const AboutMe = () => {
  const { siteSetting } = usePortfolio();
  const blogUrl = siteSetting?.blog_url || "https://medium.com/@tareqshahalam";

  return (
    <section
      id="about-me"
      className="relative flex flex-col items-center justify-center w-full px-4 sm:px-8 py-10 sm:py-14 z-20 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInFromTop}
        className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-[#090226]/80 text-cyan-300 text-xs font-mono mb-4 shadow-lg shadow-purple-900/20">
          <HiSparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Profile & Background</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-cyan-500">
            Md Tareq Shah Alam
          </span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-3">
          Bridging the gap between cutting-edge AI research and scalable, production-grade intelligent systems.
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* ================= LEFT COLUMN: STUNNING USER IMAGE ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInFromLeft(0.2)}
          className="lg:col-span-5 flex flex-col items-center justify-center relative"
        >
          {/* Rotating ambient aura */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-cyan-400/30 to-pink-500/20 blur-xl opacity-70 animate-pulse -z-10" />

          {/* Futuristic Image Card Container */}
          <div className="relative group w-full max-w-[290px] sm:max-w-[360px] aspect-[4/5] rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-purple-500/30 via-[#0a0327] to-[#040114] border border-cyan-400/40 backdrop-blur-2xl shadow-2xl shadow-purple-900/50 transition-transform duration-500 hover:scale-[1.02]">
            {/* Corner Tech Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg z-20 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400 rounded-tr-lg z-20 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-400 rounded-bl-lg z-20 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-lg z-20 pointer-events-none" />

            {/* Inner Image Wrapper */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <Image
                src="/md-tareq-shah-alam.jpg"
                alt="Md Tareq Shah Alam - ML & AI Engineer"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />

              {/* Gradient Bottom Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050118] via-transparent to-transparent opacity-85 pointer-events-none" />

              {/* Floating Bottom Info Pill */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#090226]/90 border border-purple-500/40 backdrop-blur-md flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Md Tareq Shah Alam</h3>
                  <p className="text-[11px] font-mono text-cyan-300">AI / ML Engineer & Data Scientist</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= RIGHT COLUMN: SHORT BIO & PILLARS ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInFromRight(0.3)}
          className="lg:col-span-7 flex flex-col space-y-6 text-left"
        >
          {/* Main Headline */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              Passionate about architecting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Agentic AI & Neural Systems
              </span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Hello! I&apos;m <strong>Md Tareq Shah Alam</strong>, a Machine Learning Engineer and Data Scientist specializing in
              <strong> autonomous multi-agent workflows</strong> (LangGraph, LangChain),
              <strong> Large Language Model fine-tuning & RAG architectures</strong>, and
              <strong> deep computer vision systems</strong>.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              With a strong grounding in mathematics, statistics, and high-performance engineering, I focus on turning complex neural networks into low-latency, scalable production endpoints that solve real-world problems.
            </p>
          </div>

          {/* 4 Core Specialization Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#090226]/80 border border-purple-500/25 backdrop-blur-md flex items-start gap-3 hover:border-cyan-400/50 transition">
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-cyan-400">
                <FaBrain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Agentic RAG & LangGraph</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Multi-agent graphs, state management & tool orchestration.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090226]/80 border border-purple-500/25 backdrop-blur-md flex items-start gap-3 hover:border-cyan-400/50 transition">
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                <FaMicrochip className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">LLM Fine-Tuning & Quantization</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">LoRA/QLoRA optimization with TensorRT & vLLM acceleration.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090226]/80 border border-purple-500/25 backdrop-blur-md flex items-start gap-3 hover:border-cyan-400/50 transition">
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-pink-400">
                <FaRocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Computer Vision & CNNs</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Residual deep networks & high-resolution feature extraction.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090226]/80 border border-purple-500/25 backdrop-blur-md flex items-start gap-3 hover:border-cyan-400/50 transition">
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-emerald-400">
                <FaDatabase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Production MLOps & Vector DBs</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Containerized FastAPI microservices & high-speed vector retrieval.</p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-3 sm:pt-4">
            <Link
              href="#experience"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-900/30 hover:opacity-90 transition cursor-pointer"
            >
              <span>Explore My Experience</span>
              <RxArrowTopRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href="/cli"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0a032a] border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-400 font-mono text-xs sm:text-sm transition cursor-pointer"
            >
              <VscTerminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              <span>Launch CLI Shell</span>
            </Link>

            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#090226]/80 border border-purple-500/30 text-gray-300 hover:text-white font-medium text-xs sm:text-sm transition"
            >
              <span>Read Articles</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
