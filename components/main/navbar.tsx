'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaCommentDots } from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineBriefcase,
  HiOutlineRocketLaunch,
  HiOutlineEnvelope,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

import { usePortfolio } from "@/context/portfolio-context";

interface DropdownItem {
  title: string;
  description: string;
  link: string;
  tabTarget?: "experience" | "education";
  isExternal?: boolean;
}

interface NavItem {
  id: string;
  title: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    title: "Home",
    link: "#hero",
    icon: HiOutlineHome,
  },
  {
    id: "about",
    title: "About",
    link: "#about-me",
    icon: HiOutlineUser,
    hasDropdown: true,
    dropdownItems: [
      {
        title: "About Me",
        description: "Personal story, bio & philosophy",
        link: "#about-me",
      },
      {
        title: "Technical Skills",
        description: "AI, MLOps, LLMs & tools stack",
        link: "#skills",
      },
      {
        title: "Articles & Blog",
        description: "AI & machine learning writing on Medium",
        link: "https://medium.com/@tareqshahalam",
        isExternal: true,
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    link: "#experience",
    icon: HiOutlineBriefcase,
    hasDropdown: true,
    dropdownItems: [
      {
        title: "Job Experience",
        description: "Production ML, AI & engineering roles",
        link: "#experience",
        tabTarget: "experience",
      },
      {
        title: "Education",
        description: "Academic degrees & research foundations",
        link: "#experience",
        tabTarget: "education",
      },
    ],
  },
  {
    id: "projects",
    title: "Projects & Research",
    link: "#projects",
    icon: HiOutlineRocketLaunch,
  },
  {
    id: "contact",
    title: "Contact",
    link: "#contact",
    icon: HiOutlineEnvelope,
  },
];

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [expandedMobileNavId, setExpandedMobileNavId] = useState<string | null>(null);

  const isManualClickRef = useRef<boolean>(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { siteSetting } = usePortfolio();

  const whatsappNumberClean = siteSetting?.whatsapp_number
    ? siteSetting.whatsapp_number.replace(/\D/g, "")
    : "8801625801530";
  const whatsappLink = `https://wa.me/${whatsappNumberClean}`;

  // ScrollSpy: Automatically sync active tab based on scroll position
  useEffect(() => {
    const sections: { id: string; navId: string }[] = [
      { id: "hero", navId: "home" },
      { id: "about-me", navId: "about" },
      { id: "skills", navId: "about" },
      { id: "experience", navId: "experience" },
      { id: "projects", navId: "projects" },
      { id: "contact", navId: "contact" },
    ];

    const handleScroll = () => {
      if (isManualClickRef.current) return;

      // Top of page
      if (window.scrollY < 90) {
        setActiveTab("home");
        return;
      }

      // Bottom of page (near Contact)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 70
      ) {
        setActiveTab("contact");
        return;
      }

      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(sections[i].navId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(item.id);
    isManualClickRef.current = true;
    setOpenDropdownId(null);

    if (item.link === "#hero" || item.link === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetEl = document.querySelector(item.link);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }

    setTimeout(() => {
      isManualClickRef.current = false;
    }, 750);
  };

  const handleDropdownItemClick = (
    item: NavItem,
    dropItem: DropdownItem,
    e: React.MouseEvent
  ) => {
    if (!dropItem.isExternal) {
      e.preventDefault();
      setActiveTab(item.id);
      setOpenDropdownId(null);
      isManualClickRef.current = true;

      if (dropItem.tabTarget) {
        window.dispatchEvent(
          new CustomEvent("switch-experience-tab", { detail: dropItem.tabTarget })
        );
      }

      const targetEl = document.querySelector(dropItem.link);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        isManualClickRef.current = false;
      }, 750);
    }
  };

  const handleMouseEnterItem = (itemId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdownId(itemId);
  };

  const handleMouseLeaveItem = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  return (
    <nav className="w-full h-[68px] fixed top-0 bg-[#030014]/50 backdrop-blur-xl z-50 px-6 sm:px-10 lg:px-12 border-b border-purple-900/25 shadow-lg shadow-[#2A0E61]/25 transition-all">
      {/* Navbar Content */}
      <div className="relative w-full h-full flex items-center justify-between">
        {/* Left: Brand Logo + Name */}
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 group cursor-pointer z-10"
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
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-cyan-200 to-purple-200 group-hover:from-cyan-300 group-hover:to-purple-400 transition-all">
              Tareq
            </span>
          </div>
        </Link>

        {/* Center: Mathematically Centered Animated Capsule Pill Navigation Bar */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="relative flex items-center p-1 rounded-full bg-[#07011a]/75 backdrop-blur-xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6),0_0_20px_rgba(112,66,248,0.15)]">
            {/* Specular bottom edge reflection light */}
            <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-36 lg:w-48 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[0.5px] pointer-events-none" />
            <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-24 lg:w-32 h-[2px] bg-cyan-400/50 blur-[2px] pointer-events-none" />

            {/* Top subtle highlight */}
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            {/* Nav Items */}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHovered = hoveredTab === item.id;
              const isDropdownActive = openDropdownId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredTab(item.id);
                    if (item.hasDropdown) handleMouseEnterItem(item.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredTab(null);
                    if (item.hasDropdown) handleMouseLeaveItem();
                  }}
                >
                  <a
                    href={item.link}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`relative z-10 flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive
                          ? "text-white scale-105 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{item.title}</span>

                    {item.hasDropdown && (
                      <HiOutlineChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isDropdownActive
                            ? "rotate-180 text-cyan-300"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </a>

                  {/* Active Animated Pill (Sliding Capsule with Framer Motion) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-[#180f33]/90 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_18px_rgba(112,66,248,0.35)] z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Subtle Hover Pill effect for inactive items */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.05] border border-white/5 z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {isDropdownActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-1.5 rounded-2xl bg-[#08021c]/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(112,66,248,0.25)] z-50 flex flex-col gap-1 overflow-hidden"
                          onMouseEnter={() => handleMouseEnterItem(item.id)}
                          onMouseLeave={handleMouseLeaveItem}
                        >
                          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

                          {item.dropdownItems?.map((dropItem) => (
                            <a
                              key={dropItem.title}
                              href={dropItem.link}
                              target={dropItem.isExternal ? "_blank" : undefined}
                              rel={dropItem.isExternal ? "noreferrer noopener" : undefined}
                              onClick={(e) => handleDropdownItemClick(item, dropItem, e)}
                              className="group flex flex-col px-3 py-2 rounded-xl hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 transition-all text-left"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors">
                                <span>{dropItem.title}</span>
                                {dropItem.isExternal ? (
                                  <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 transition-colors" />
                                ) : (
                                  <span className="text-[10px] text-gray-500 group-hover:text-cyan-400 transition-colors font-mono">
                                    →
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 group-hover:text-gray-300 mt-0.5">
                                {dropItem.description}
                              </span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Talk with me (Theme Matched) + Try CLI Button */}
        <div className="hidden md:flex flex-row items-center gap-3 z-10">
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

        {/* Hamburger Menu Button for Mobile */}
        <button
          aria-label="Toggle Navigation Menu"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#0d0426]/90 border border-purple-500/40 text-gray-200 hover:text-cyan-300 hover:border-cyan-400 text-xl focus:outline-none transition-all shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[68px] left-0 w-full bg-[#030014]/98 backdrop-blur-2xl px-6 py-6 flex flex-col items-center text-gray-300 md:hidden border-b border-purple-500/30 shadow-2xl"
          >
            {/* Mobile Nav Links Capsule List */}
            <div className="flex flex-col items-stretch w-full max-w-sm gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isExpanded = expandedMobileNavId === item.id;

                return (
                  <div key={item.id} className="flex flex-col">
                    <button
                      onClick={(e) => {
                        if (item.hasDropdown) {
                          setExpandedMobileNavId(isExpanded ? null : item.id);
                        } else {
                          handleNavClick(item, e as unknown as React.MouseEvent);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                        isActive
                          ? "bg-[#180f33] border-purple-500/60 text-white shadow-[0_0_15px_rgba(112,66,248,0.35)]"
                          : "bg-[#0d0426]/50 border-white/5 text-gray-300 hover:text-cyan-300 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-gray-400"}`} />
                        <span>{item.title}</span>
                      </div>
                      {item.hasDropdown && (
                        <HiOutlineChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-cyan-300" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Expandable Sub-items */}
                    {item.hasDropdown && isExpanded && (
                      <div className="flex flex-col gap-1.5 pl-6 pr-2 py-2 mt-1 border-l-2 border-purple-500/30 ml-4">
                        {item.dropdownItems?.map((dropItem) => (
                          <a
                            key={dropItem.title}
                            href={dropItem.link}
                            target={dropItem.isExternal ? "_blank" : undefined}
                            rel={dropItem.isExternal ? "noreferrer noopener" : undefined}
                            onClick={(e) => {
                              handleDropdownItemClick(item, dropItem, e);
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs text-gray-300 hover:text-cyan-300 hover:bg-purple-950/40 transition-colors"
                          >
                            <span>{dropItem.title}</span>
                            {dropItem.isExternal ? (
                              <HiOutlineArrowTopRightOnSquare className="w-3 h-3 text-gray-500" />
                            ) : (
                              <span className="text-[10px] text-gray-500 group-hover:text-cyan-400 font-mono">
                                →
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Cosmic "Talk with me" Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 flex items-center justify-center gap-2 w-full max-w-sm py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border border-purple-400/30 active:scale-95 transition"
            >
              <FaCommentDots className="w-4 h-4 text-cyan-200" />
              <span>Talk with me</span>
            </a>

            {/* Try CLI Mobile button */}
            <Link
              href="/cli"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 w-full max-w-sm px-5 py-2 rounded-full bg-[#0d0426] border border-cyan-400 text-cyan-300 text-xs font-mono font-bold shadow-lg shadow-cyan-500/30"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Launch CLI Workstation 💻</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};