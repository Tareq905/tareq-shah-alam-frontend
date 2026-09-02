"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaBrain,
  FaMicrochip,
  FaDatabase,
  FaGraduationCap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { BiGitBranch } from "react-icons/bi";
import { EXPERIENCES } from "@/constants";
import { slideInFromTop } from "@/lib/motion";
import { usePortfolio } from "@/context/portfolio-context";
import { Education as IEducation } from "@/lib/api";

interface LayerMeta {
  layer: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradient: string;
  nodeGlow: string;
  statusText: string;
}

const LAYER_METAS: Record<number, LayerMeta> = {
  0: {
    layer: "Layer 03 • Autonomous Reasoning",
    icon: FaBrain,
    accentColor: "border-cyan-400/50 text-cyan-300 bg-cyan-950/60",
    gradient: "from-cyan-500/15 via-purple-600/10 to-transparent",
    nodeGlow: "shadow-[0_0_15px_#06b6d4]",
    statusText: "Active Synaptic Epoch",
  },
  1: {
    layer: "Layer 02 • Deep Learning & Vision",
    icon: FaMicrochip,
    accentColor: "border-purple-400/50 text-purple-300 bg-purple-950/60",
    gradient: "from-purple-500/15 via-pink-600/10 to-transparent",
    nodeGlow: "shadow-[0_0_15px_#a855f7]",
    statusText: "Converged & Deployed",
  },
  2: {
    layer: "Layer 01 • Algorithmic Foundation",
    icon: FaDatabase,
    accentColor: "border-emerald-400/50 text-emerald-300 bg-emerald-950/60",
    gradient: "from-emerald-500/15 via-cyan-600/10 to-transparent",
    nodeGlow: "shadow-[0_0_15px_#10b981]",
    statusText: "Core Trained Baseline",
  },
};

function parseChronologicalScore(periodStr: string): number {
  const text = (periodStr || "").toLowerCase();
  const isPresent =
    text.includes("present") ||
    text.includes("current") ||
    text.includes("running") ||
    text.includes("now");

  const yearMatches = periodStr.match(/\b(19\d\d|20\d\d)\b/g);

  let endYear = isPresent ? 9999 : 0;
  let startYear = 0;

  if (yearMatches && yearMatches.length > 0) {
    const years = yearMatches.map(Number);
    if (!isPresent) {
      endYear = Math.max(...years);
    }
    startYear = Math.min(...years);
  }

  return endYear * 10000 + startYear;
}

export const Experience = () => {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const { experience: rawExperiences, education: rawEducation } = usePortfolio();

  const handleNodeClick = (index: number) => {
    setActiveNode(activeNode === index ? null : index);
  };

  // Base list
  const baseExperiences = rawExperiences.length > 0 ? rawExperiences : EXPERIENCES.map((exp, idx) => ({
    id: idx + 1,
    role: exp.role,
    company: exp.company,
    period: exp.period,
    location: "Remote / Dhaka",
    job_type: exp.type || "Full-Time",
    description: exp.description,
    technologies: Array.isArray(exp.skills) ? exp.skills.join(", ") : "",
    technologies_list: Array.isArray(exp.skills) ? [...exp.skills] : [],
    order: idx + 1,
    is_active: true,
  }));

  // Smart Chronological Sorting: Running/Present on Top, Oldest on Bottom
  const displayExperiences = [...baseExperiences].sort((a, b) => {
    const scoreA = parseChronologicalScore(a.period);
    const scoreB = parseChronologicalScore(b.period);
    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Descending (newest/running on top)
    }
    return (a.order || 0) - (b.order || 0);
  });

  const baseEducation: IEducation[] = rawEducation.length > 0 ? rawEducation : [
    {
      id: 1,
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Leading University / Technical Institute",
      location: "Bangladesh",
      start_year: "2020",
      end_year: "2024",
      grade_or_cgpa: "First Class / Outstanding",
      field_of_study: "Artificial Intelligence, Machine Learning & Software Engineering",
      thesis_or_description: "Major in Machine Learning and Deep Neural Network architectures with research on NLP Transformer optimization.",
      order: 1,
      is_active: true,
    },
    {
      id: 2,
      degree: "Higher Secondary Certificate (HSC) — Science",
      institution: "Reputed College",
      location: "Bangladesh",
      start_year: "2017",
      end_year: "2019",
      grade_or_cgpa: "GPA 5.00 / 5.00",
      field_of_study: "Science (Mathematics, Physics, ICT)",
      thesis_or_description: "Focused on Advanced Mathematics, Analytical Physics, and Computational Fundamentals.",
      order: 2,
      is_active: true,
    },
  ];

  // Smart Chronological Sorting for Education
  const displayEducation = [...baseEducation].sort((a, b) => {
    const endA = a.end_year.toLowerCase().includes("present") ? 9999 : parseInt(a.end_year) || 0;
    const endB = b.end_year.toLowerCase().includes("present") ? 9999 : parseInt(b.end_year) || 0;
    if (endB !== endA) {
      return endB - endA; // Descending
    }
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <section
      id="experience"
      className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 py-8 sm:py-12 z-20 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Synaptic background grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7042f808_1px,transparent_1px),linear-gradient(to_bottom,#7042f808_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none -z-10 opacity-60" />

      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInFromTop}
        className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-2xl"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-[#090226]/80 text-cyan-300 text-xs font-mono mb-3.5 shadow-lg shadow-purple-900/20 backdrop-blur-md">
          <BiGitBranch className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Synaptic Career & Academic Matrix</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 tracking-tight">
          Experience{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
            & Neural Tree
          </span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-xl mt-2.5 leading-relaxed">
          A branch-by-branch synaptic evolution of production machine learning systems, multi-agent reasoning, and academic background.
        </p>

        {/* Experience & Education Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090226]/90 border border-purple-500/40 backdrop-blur-xl shadow-xl mt-6">
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "experience"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FaBriefcase className="w-3.5 h-3.5" />
            <span>Work Experience ({displayExperiences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "education"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/40 border border-cyan-400/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FaGraduationCap className="w-4 h-4" />
            <span>🎓 Education ({displayEducation.length})</span>
          </button>
        </div>
      </motion.div>

      {/* ================= TAB 1: INTERACTIVE EXPERIENCE TREE ================= */}
      <AnimatePresence mode="wait">
        {activeTab === "experience" ? (
          <motion.div
            key="experience-tree"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-4xl my-2"
          >
            {/* Central Vertical Tree Spine */}
            <div className="absolute left-5 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.6)] rounded-full">
              {/* Automatic continuous synaptic energy beam #1 */}
              <motion.div
                animate={{
                  top: ["-5%", "105%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-16 bg-gradient-to-b from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_20px_#06b6d4]"
              />

              {/* Automatic continuous synaptic energy beam #2 */}
              <motion.div
                animate={{
                  top: ["-5%", "105%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.8,
                  delay: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-16 bg-gradient-to-b from-transparent via-purple-400 to-transparent rounded-full shadow-[0_0_20px_#a855f7]"
              />
            </div>

            {/* Experience Nodes List */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {displayExperiences.map((exp, index) => {
                const isLeft = index % 2 === 0;
                const isSelected = activeNode === index;
                const meta = LAYER_METAS[index % 3];
                const NodeIcon = meta.icon;
                const techList = exp.technologies_list || (exp.technologies ? exp.technologies.split(",").map((s: string) => s.trim()) : []);

                return (
                  <div
                    key={exp.id || index}
                    className={`relative flex items-center w-full ${
                      isLeft ? "md:flex-row-reverse" : "md:flex-row"
                    } flex-row`}
                  >
                    {/* Content Card Container */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-6">
                      <motion.div
                        whileHover={{ scale: 1.015 }}
                        onClick={() => handleNodeClick(index)}
                        className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
                          isSelected
                            ? "bg-[#0d0426]/95 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                            : "bg-[#090226]/80 border-purple-500/30 hover:border-purple-400/60 shadow-lg shadow-[#2A0E61]/30"
                        }`}
                      >
                        {/* Top Layer & Status Header */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-purple-500/15 text-[11px] sm:text-xs">
                          <span className="font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            {meta.layer}
                          </span>
                          <span className="text-gray-400 font-mono text-[10px]">
                            {meta.statusText}
                          </span>
                        </div>

                        {/* Role & Company */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-purple-200">
                              {exp.role}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-cyan-400 mt-0.5 flex items-center gap-1.5">
                              <FaBriefcase className="w-3 h-3 shrink-0" />
                              <span>{exp.company}</span>
                              {exp.location && (
                                <span className="text-gray-400 text-[11px] ml-1">
                                  • {exp.location}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Period Badge */}
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-purple-300 bg-[#160645]/80 px-2.5 py-1 rounded-lg border border-purple-500/20 w-fit">
                          <FaCalendarAlt className="w-3 h-3 text-purple-400" />
                          <span>{exp.period}</span>
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Technologies Tags */}
                        {techList.length > 0 && (
                          <div className="mt-3.5 pt-2.5 border-t border-purple-500/15 flex flex-wrap gap-1.5">
                            {techList.map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono rounded-md bg-[#040114] border border-cyan-500/25 text-cyan-200"
                              >
                                #{tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Central Interactive Node Point on Spine */}
                    <div
                      onClick={() => handleNodeClick(index)}
                      className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer group z-20"
                    >
                      <motion.div
                        animate={{
                          scale: isSelected ? [1, 1.25, 1] : 1,
                          rotate: isSelected ? [0, 90, 0] : 0,
                        }}
                        transition={{ duration: 1.2, repeat: isSelected ? Infinity : 0 }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                          isSelected
                            ? "bg-cyan-500 border-white text-black shadow-[0_0_20px_#06b6d4] scale-110"
                            : "bg-[#090226] border-purple-400 text-purple-300 group-hover:border-cyan-300 group-hover:text-cyan-200 shadow-md shadow-purple-900/60"
                        }`}
                      >
                        <NodeIcon className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ================= TAB 2: EDUCATION SECTION ================= */
          <motion.div
            key="education-cards"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 my-2"
          >
            {displayEducation.map((edu, idx) => (
              <motion.div
                key={edu.id || idx}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#0e0433]/90 to-[#05011a]/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-[#2A0E61]/40 flex flex-col justify-between overflow-hidden group"
              >
                {/* Ambient glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div>
                  {/* Top Badge: Degree Duration & CGPA */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-sm">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>{edu.start_year} - {edu.end_year}</span>
                    </span>

                    {edu.grade_or_cgpa && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-bold">
                        {edu.grade_or_cgpa}
                      </span>
                    )}
                  </div>

                  {/* Degree Name */}
                  <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 mt-2">
                    {edu.degree}
                  </h3>

                  {/* Institution & Location */}
                  <p className="text-xs sm:text-sm font-medium text-cyan-400 mt-1 flex items-center gap-1.5">
                    <FaGraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{edu.institution}</span>
                    {edu.location && (
                      <span className="text-gray-400 text-xs flex items-center gap-0.5 ml-1">
                        • <FaMapMarkerAlt className="w-2.5 h-2.5 ml-0.5" /> {edu.location}
                      </span>
                    )}
                  </p>

                  {/* Field of Study */}
                  {edu.field_of_study && (
                    <div className="mt-3 text-xs text-purple-200 font-mono">
                      <span className="text-gray-400">Field: </span>
                      {edu.field_of_study}
                    </div>
                  )}

                  {/* Description / Thesis */}
                  {edu.thesis_or_description && (
                    <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {edu.thesis_or_description}
                    </p>
                  )}
                </div>

                {/* Bottom Verified Academic Tag */}
                <div className="mt-5 pt-3 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <IoCheckmarkDoneCircle className="w-4 h-4 text-emerald-400" />
                    <span>Academic Qualification</span>
                  </span>
                  <span className="text-purple-300">Degree Certified</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
