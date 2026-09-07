"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeIcon, MapPinIcon, SparklesIcon, UserIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { submitContactMessage } from "@/lib/api";
import { usePortfolio } from "@/context/portfolio-context";
import { useSecurity, getOrCreateDeviceId } from "@/context/security-context";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAiMessage, setIsGeneratingAiMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { siteSetting } = usePortfolio();
  const { inspectPayload } = useSecurity();

  const siteEmail = siteSetting?.email || "tareqshah.027@gmail.com";

  // AI Message Auto-Drafter using Name, Email, and Subject
  const handleAiDraftMessage = async () => {
    setIsGeneratingAiMessage(true);
    setErrorMessage("");

    const name = formData.name.trim() || "a professional collaborator";
    const email = formData.email.trim() || "contact email";
    const subject = formData.subject.trim() || "AI & Machine Learning project collaboration";

    // Inspect draft inputs for hostile payloads
    const checkDraft = await inspectPayload(`${name} ${email} ${subject}`);
    if (checkDraft.isThreat) {
      setIsGeneratingAiMessage(false);
      return;
    }

    const prompt = `Please write a concise, articulate, and professional contact message to Md Tareq Shah Alam (Machine Learning Engineer & Data Scientist).
Sender Details:
- Name: ${name}
- Email: ${email}
- Topic / Subject: ${subject}

IMPORTANT INSTRUCTIONS:
- Write in clean, natural plain text for email (DO NOT USE ANY MARKDOWN ASTERISKS like ** or * or #).
- Keep it courteous, focused on collaboration or opportunities, and 2-3 short paragraphs max.
- Write only the ready-to-send message body.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": getOrCreateDeviceId(),
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          mode: "random",
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const cleanedReply = data.reply
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/__(.*?)__/g, "$1")
          .replace(/_(.*?)_/g, "$1")
          .replace(/^#+\s+/gm, "")
          .replace(/^["']|["']$/g, "")
          .replace(/^⚠️.*$/gm, "")
          .trim();
        setFormData((prev) => ({ ...prev, message: cleanedReply }));
      }
    } catch (error) {
      console.error("AI Draft Error:", error);
      setFormData((prev) => ({
        ...prev,
        message: `Hello Tareq,\n\nI came across your impressive Machine Learning and AI portfolio. I would love to connect with you regarding ${subject}.\n\nLooking forward to discussing potential synergies and collaborations.\n\nBest regards,\n${name}`,
      }));
    } finally {
      setIsGeneratingAiMessage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMessage("");

    // 1. Instant AI & Heuristic Security Inspection across all contact fields
    const combinedPayload = `${formData.name} ${formData.email} ${formData.subject} ${formData.message}`.trim();
    const inspection = await inspectPayload(combinedPayload);
    if (inspection.isThreat) {
      setIsSubmitting(false);
      // The Animated Red Alert Popup is automatically engaged by inspectPayload!
      return;
    }

    // 2. Submit through protected contact gateway
    const result = await submitContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || "Collaboration Inquiry",
      message: formData.message.trim(),
    });

    setIsSubmitting(false);

    if (result.isThreat && result.quarantinedRecord) {
      localStorage.setItem("tareq_sec_quarantine", JSON.stringify(result.quarantinedRecord));
      location.reload();
      return;
    }

    if (result.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 7000);
    } else {
      setErrorMessage(result.message || "Failed to verify and submit inquiry.");
    }
  };


  return (
    <section
      id="contact"
      className="w-full min-h-screen py-20 px-4 sm:px-10 flex flex-col items-center justify-center relative z-20"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-16 text-center"
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7042f8]/40 bg-[#0f0438]/60 text-purple-300 text-xs font-mono mb-4 shadow-lg">
          <SparklesIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>LET&apos;S CONNECT & COLLABORATE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 tracking-tight">
          Get In Touch
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl">
          Interested in Machine Learning research, generative AI pipelines, or technical consultation? Send me a verified message directly.
        </p>
      </motion.div>

      {/* Main Grid: Profile Card (Left) + Space Form (Right) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-20">
        {/* Left Column: Md Tareq Shah Alam Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-8 md:p-10 rounded-3xl bg-[#090226]/80 border border-[#7042f8]/40 backdrop-blur-xl shadow-2xl shadow-[#2A0E61]/50 relative overflow-hidden"
        >
          {/* Card Accent Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 mb-5 sm:mb-6 shadow-xl shadow-purple-900/40 group overflow-hidden">
              <Image
                src="/md-tareq-shah-alam.jpg"
                alt="Md Tareq Shah Alam"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-white">
              Md Tareq Shah Alam
            </h3>
            <p className="text-xs sm:text-sm font-medium text-cyan-400 mt-1 font-mono">
              Machine Learning Engineer & Data Scientist
            </p>

            <p className="text-gray-300 text-xs sm:text-sm mt-4 sm:mt-5 leading-relaxed">
              Passionate about architecting end-to-end Machine Learning systems, fine-tuning Large Language Models, and building autonomous agentic AI workflows with PyTorch, LangChain, and Transformers.
            </p>

            {/* Quick Info Items */}
            <div className="mt-6 sm:mt-8 space-y-3.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <span>Open to Global AI/ML Roles & Research Collaborations</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <EnvelopeIcon className="w-4 h-4" />
                </div>
                <a
                  href={`mailto:${siteEmail}`}
                  className="hover:text-cyan-300 transition underline underline-offset-4 break-all"
                >
                  {siteEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-purple-500/20 flex flex-wrap gap-1.5 sm:gap-2">
            {[
              "Machine Learning",
              "NLP",
              "Transformers",
              "LangChain",
              "LlamaIndex",
              "Deep Learning",
              "Data Science",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] sm:text-[11px] rounded-full bg-[#160645] border border-purple-500/30 text-purple-200 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Interactive Space Contact Form with AI Guard */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="lg:col-span-7 p-5 sm:p-8 md:p-10 rounded-3xl bg-[#090226]/80 border border-[#7042f8]/40 backdrop-blur-xl shadow-2xl shadow-[#2A0E61]/50 relative"
        >
          {/* Real-time Error / Spam Rejection Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg shadow-red-950/40"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-red-300">
                    {errorMessage.toLowerCase().includes("security") ||
                    errorMessage.toLowerCase().includes("threat") ||
                    errorMessage.toLowerCase().includes("blocked")
                      ? "Security Filter Alert"
                      : "Submission Notice"}
                  </h5>
                  <p className="mt-0.5 text-red-200/90">{errorMessage}</p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-3xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Message Verified & Sent Successfully!
              </h4>
              <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                Thank you for reaching out. Your inquiry has passed AI verification checks and was delivered directly to Md Tareq Shah Alam&apos;s admin dashboard.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Your Real Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-[#0d0433] border border-purple-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Your Email <span className="text-cyan-400">* (No Disposable/Temp Mails)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="alex@company.com or personal"
                      className="w-full bg-[#0d0433] border border-purple-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g. AI Model Fine-tuning, Job Opportunity, Research"
                  className="w-full bg-[#0d0433] border border-purple-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              {/* Message Header with AI Drafter Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-300">
                    Your Message <span className="text-cyan-400">*</span>
                  </label>

                  {/* Groq AI Drafter Trigger */}
                  <button
                    type="button"
                    onClick={handleAiDraftMessage}
                    disabled={isGeneratingAiMessage}
                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded-full bg-gradient-to-r from-purple-600/50 via-indigo-600/50 to-cyan-500/50 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                    title="Let Groq LLM generate an articulate message from your info"
                  >
                    <SparklesIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>
                      {isGeneratingAiMessage
                        ? "Synthesizing AI Message..."
                        : "Draft with AI ✨"}
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Describe your project, timeline, research ideas, or collaboration thoughts..."
                    className="w-full bg-[#0d0433] border border-purple-500/40 rounded-2xl p-4 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/50 hover:shadow-cyan-500/30 transition duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Gatekeeper Inspecting & Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verified Message 🚀</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
