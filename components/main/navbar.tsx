'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";

import { LINKS, NAV_LINKS } from "@/constants";
import { usePortfolio } from "@/context/portfolio-context";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteSetting } = usePortfolio();

  const whatsappNumberClean = siteSetting?.whatsapp_number
    ? siteSetting.whatsapp_number.replace(/\D/g, "")
    : "8801625801530";
  const whatsappLink = `https://wa.me/${whatsappNumberClean}`;

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50 px-6 sm:px-10">
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between m-auto px-[10px]">
        {/* Logo + Name */}
        <Link
          href="#hero"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-900/60 via-[#0d0426] to-cyan-950/70 border border-purple-500/40 group-hover:border-cyan-400 shadow-[0_0_15px_rgba(112,66,248,0.35)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300">
            <Image
              src="/skills/tareq-logo-clean.png"
              alt="Md Tareq Shah Alam Logo"
              width={28}
              height={28}
              draggable={false}
              className="object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-cyan-200 to-purple-200 group-hover:from-cyan-300 group-hover:to-purple-400 transition-all">
              Tareq
            </span>
          </div>
        </Link>

        {/* Web Navbar Links */}
        <div className="hidden md:flex h-full flex-row items-center justify-between">
          <div className="flex items-center gap-5 lg:gap-6 border border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.45)] px-6 py-2 rounded-full text-gray-200 text-xs lg:text-sm backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                target={link.link.startsWith("http") ? "_blank" : undefined}
                rel={link.link.startsWith("http") ? "noreferrer noopener" : undefined}
                className="cursor-pointer hover:text-cyan-300 transition whitespace-nowrap"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Area: Talk with me (Theme Matched) + Try CLI Button */}
        <div className="hidden md:flex flex-row items-center gap-3">
          {/* Animated Cosmic "Talk with me" Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer noopener"
            className="relative group flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-[0_0_18px_rgba(112,66,248,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.65)] transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden border border-purple-400/40 hover:border-cyan-300"
          >
            {/* Shimmer light sweep */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <FaCommentDots className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 tracking-wide font-semibold">Talk with me</span>
          </a>

          {/* Try CLI Button */}
          <Link
            href="/cli"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d0426] hover:bg-[#1a084d] border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all transform hover:scale-105 group"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="group-hover:translate-x-0.5 transition-transform">Try CLI 💻</span>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          aria-label="Toggle Navigation Menu"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#0d0426]/90 border border-purple-500/40 text-gray-200 hover:text-cyan-300 hover:border-cyan-400 text-2xl focus:outline-none transition-all shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#030014]/98 backdrop-blur-2xl px-6 py-6 flex flex-col items-center text-gray-300 md:hidden border-b border-purple-500/30 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Links */}
          <div className="flex flex-col items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                target={link.link.startsWith("http") ? "_blank" : undefined}
                rel={link.link.startsWith("http") ? "noreferrer noopener" : undefined}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Mobile Cosmic "Talk with me" Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-5 flex items-center justify-center gap-2 w-full max-w-[260px] py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border border-purple-400/30 active:scale-95 transition"
          >
            <FaCommentDots className="w-4 h-4 text-cyan-300" />
            <span>Talk with me</span>
          </a>

          {/* Try CLI Mobile button */}
          <Link
            href="/cli"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 w-full max-w-[260px] px-5 py-2 rounded-full bg-[#0d0426] border border-cyan-400 text-cyan-300 text-xs font-mono font-bold shadow-lg shadow-cyan-500/30"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Launch CLI Workstation 💻</span>
          </Link>
        </div>
      )}
    </div>
  );
};