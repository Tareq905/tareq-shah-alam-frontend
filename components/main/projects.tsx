"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { PROJECTS as FALLBACK_PROJECTS, RESEARCH_PAPERS as FALLBACK_PAPERS } from "@/constants";
import { usePortfolio } from "@/context/portfolio-context";
import { getValidImageUrl } from "@/lib/api";

export const Projects = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "research">("projects");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { projects: projectsList, research: researchList } = usePortfolio();

  // Handle ESC key and prevent body scroll when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Use API list or fallback
  const displayProjects = projectsList.length > 0
    ? projectsList
    : (FALLBACK_PROJECTS || []).map((p, idx) => ({
        id: idx + 1,
        title: p.title,
        description: p.description,
        category: "Applied AI & ML",
        image: p.image,
        live_url: p.link || "",
        github_url: "https://github.com/tareqshah027",
        tech_stack: Array.isArray(p.tags) ? p.tags.join(", ") : "",
        tech_stack_list: Array.isArray(p.tags) ? [...p.tags] : [],
        is_featured: true,
        order: idx + 1,
      }));

  const displayResearch = researchList.length > 0
    ? researchList
    : (FALLBACK_PAPERS || []).map((r, idx) => ({
        id: idx + 1,
        title: r.title,
        publisher: r.venue || "Technical Research",
        publication_date: "2025",
        abstract: r.description,
        paper_url: r.link || "",
        pdf_url: r.link || "",
        tags: Array.isArray(r.tags) ? r.tags.join(", ") : "",
        tags_list: Array.isArray(r.tags) ? [...r.tags] : [],
        citations_count: 0,
        order: idx + 1,
      }));

  return (
    <section
      id="projects"
      className="w-full min-h-screen flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-8 md:px-10 relative z-20"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center mb-8 sm:mb-10 px-2"
      >
        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#7042f8]/40 bg-[#0f0438]/60 text-purple-300 text-xs font-mono mb-3.5 shadow-lg">
          <SparklesIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>INNOVATION & PUBLICATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 tracking-tight">
          Projects & Research
        </h2>
        <p className="text-gray-400 text-xs sm:text-base mt-2.5 sm:mt-3 max-w-xl">
          Explore my production-ready AI/ML architectures, autonomous agent workflows, and technical research publications.
        </p>
      </motion.div>

      {/* Interactive Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#090226]/90 border border-[#7042f8]/40 backdrop-blur-xl shadow-2xl mb-8 sm:mb-12 z-20 max-w-full">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === "projects"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/30"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <RocketLaunchIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Applied AI Projects ({displayProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("research")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === "research"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 border border-cyan-400/30"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <BookOpenIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Research & Papers ({displayResearch.length})</span>
        </button>
      </div>

      {/* Dynamic Content Display */}
      <div className="w-full max-w-7xl">
        <AnimatePresence mode="wait">
          {activeTab === "projects" ? (
            <motion.div
              key="projects-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayProjects.map((project, idx) => {
                const techList = Array.isArray(project.tech_stack_list)
                  ? project.tech_stack_list
                  : typeof project.tech_stack === "string"
                  ? project.tech_stack.split(/[, ]+/).map((s) => s.trim()).filter(Boolean)
                  : [];

                return (
                  <motion.div
                    key={project.id || project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group rounded-3xl overflow-hidden bg-[#090226]/85 border border-[#7042f8]/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-[#1f074d]/50 hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative w-full h-52 overflow-hidden bg-black/40">
                        <Image
                          src={getValidImageUrl(project.image || (project as any).image_file || (project as any).image_url)}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090226] via-transparent to-transparent opacity-80" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#030014]/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg">
                          {project.category}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-purple-200 group-hover:from-cyan-300 group-hover:to-purple-300 transition-colors">
                          {project.title}
                        </h3>

                        {/* Interactive Magnifier Description Box (Desktop Hover & Mobile Touch) */}
                        <div
                          onClick={() => setSelectedProject(project)}
                          className="group/desc relative mt-3 p-3 -mx-2.5 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#150738] hover:to-[#090226] border border-transparent hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-[0.98]"
                          role="button"
                          tabIndex={0}
                          title="Click / Tap to magnify full description 🔍"
                        >
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover/desc:text-gray-200 group-hover/desc:scale-[1.01] origin-top-left transition-all duration-200">
                            {project.description}
                          </p>

                          {/* Magnifying Glass Indicator Banner */}
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-500/20 text-[11px] font-mono text-cyan-400">
                            <div className="flex items-center gap-1.5">
                              <MagnifyingGlassPlusIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                              <span className="font-semibold text-cyan-300">Magnify Overview</span>
                            </div>
                            <span className="text-[10px] text-purple-300/80 group-hover/desc:text-cyan-300 transition-colors">
                              🔍 Click / Tap
                            </span>
                          </div>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-2 mt-5">
                          {techList.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 text-xs rounded-lg bg-[#14083a] border border-[#7042f8]/30 text-purple-200 font-mono"
                            >
                              #{tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 flex items-center gap-3">
                      {project.live_url && (
                        <Link
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition duration-200"
                        >
                          <span>Live Demo</span>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Link>
                      )}

                      {project.github_url && (
                        <Link
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center justify-center p-2.5 rounded-xl border border-purple-500/40 hover:border-cyan-400 bg-[#090226] text-gray-300 hover:text-white transition duration-200"
                          title="View Source Code on GitHub"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Research Papers Tab View */
            <motion.div
              key="research-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              {displayResearch.map((paper, idx) => {
                const tagsList = Array.isArray(paper.tags_list)
                  ? paper.tags_list
                  : typeof paper.tags === "string"
                  ? paper.tags.split(/[, ]+/).map((s) => s.trim()).filter(Boolean)
                  : [];

                return (
                  <motion.div
                    key={paper.id || paper.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-8 rounded-3xl bg-[#090226]/85 border border-[#7042f8]/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-[#1f074d]/50 transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex-1">
                      {/* Meta header */}
                      <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                          {paper.publisher}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-purple-300">{paper.publication_date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-purple-200">
                        {paper.title}
                      </h3>

                      {/* Abstract */}
                      <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                        {paper.abstract}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {tagsList.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-xs rounded-md bg-[#14083a] border border-purple-500/20 text-purple-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Paper Links */}
                    <div className="flex md:flex-col justify-end gap-3 min-w-[150px]">
                      {paper.paper_url && (
                        <Link
                          href={paper.paper_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/40 transition"
                        >
                          <span>Read Paper</span>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Link>
                      )}

                      {paper.pdf_url && (
                        <Link
                          href={paper.pdf_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/40 hover:border-cyan-400 bg-[#090226] text-purple-200 hover:text-white text-xs font-semibold transition"
                        >
                          <span>PDF Download</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= CYBER MAGNIFIER GLASS MODAL ================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-x-hidden overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg cursor-pointer"
            />

            {/* Magnifier Glass Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 25 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#090226]/95 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl z-10 overflow-hidden my-auto"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-500/20 bg-[#0d0430]/90 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                    <MagnifyingGlassPlusIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#030014] border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                        {selectedProject.category}
                      </span>
                      <span className="text-gray-400 text-[11px] font-mono hidden sm:inline-block">
                        MAGNIFIED OVERVIEW
                      </span>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-white mt-1 leading-snug">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 sm:p-2.5 rounded-full border border-purple-500/30 hover:border-cyan-400 bg-[#030014]/60 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
                {/* Image Banner */}
                <div className="relative w-full h-44 sm:h-60 rounded-2xl overflow-hidden border border-purple-500/30 bg-black/50">
                  <Image
                    src={getValidImageUrl(selectedProject.image || selectedProject.image_file || selectedProject.image_url)}
                    alt={selectedProject.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090226] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/70 border border-cyan-400/40 text-cyan-300 text-xs font-mono backdrop-blur-md">
                    🔍 Detailed Inspection
                  </div>
                </div>

                {/* Complete Uncut Description */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Full Architecture & Description
                  </h4>
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0433]/70 border border-purple-500/20 text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans select-text">
                    {selectedProject.description}
                  </div>
                </div>

                {/* Tech Stack List */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Integrated Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.tech_stack_list)
                      ? selectedProject.tech_stack_list
                      : typeof selectedProject.tech_stack === "string"
                      ? selectedProject.tech_stack.split(/[, ]+/).filter(Boolean)
                      : []
                    ).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs rounded-lg bg-[#14083a] border border-[#7042f8]/40 text-cyan-200 font-mono shadow-sm"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-purple-500/20 bg-[#0d0430]/90 flex items-center justify-end gap-3 shrink-0">
                {selectedProject.live_url && (
                  <Link
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition"
                  >
                    <span>Live Demo</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </Link>
                )}

                {selectedProject.github_url && (
                  <Link
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:py-2.5 rounded-xl border border-purple-500/40 hover:border-cyan-400 bg-[#090226] text-gray-300 hover:text-white text-xs font-semibold transition"
                  >
                    <span>GitHub</span>
                  </Link>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 sm:py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
