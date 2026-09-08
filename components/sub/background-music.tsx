"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/context/portfolio-context";
import { getValidImageUrl } from "@/lib/api";

const DEFAULT_AUDIO_PATH = "/arabic-bgm.mp3";
const TARGET_VOLUME = 0.45; // Luxurious, comfortable ambient volume

export const BackgroundMusic: React.FC = () => {
  const { siteSetting, isLoading, lastSyncedAt } = usePortfolio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionCleanupRef = useRef<(() => void) | null>(null);

  // States
  const [isMainPortfolioReady, setIsMainPortfolioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserMuted, setIsUserMuted] = useState(false);
  const [audioSrc, setAudioSrc] = useState(DEFAULT_AUDIO_PATH);
  const [trackName, setTrackName] = useState("Arabic Ambient BGM");

  // Determine current active audio file & enabled status from backend
  const isBgmEnabled = Boolean(siteSetting?.is_bgm_enabled);
  const isDataLoaded = !isLoading || lastSyncedAt !== null;

  const isBgmEnabledRef = useRef(isBgmEnabled);
  isBgmEnabledRef.current = isBgmEnabled;

  const isUserMutedRef = useRef(isUserMuted);
  isUserMutedRef.current = isUserMuted;

  const isMainPortfolioReadyRef = useRef(isMainPortfolioReady);
  isMainPortfolioReadyRef.current = isMainPortfolioReady;

  useEffect(() => {
    let resolvedSrc = DEFAULT_AUDIO_PATH;
    const rawBgmFile = siteSetting?.bgm_file;
    const rawBgmTitle = siteSetting?.bgm_title;
    if (rawBgmFile && typeof rawBgmFile === "string" && rawBgmFile.trim().length > 0) {
      resolvedSrc = getValidImageUrl(rawBgmFile);
    }
    setAudioSrc(resolvedSrc);
    setTrackName(rawBgmTitle || (rawBgmFile ? "Custom Track" : "Arabic Ambient BGM"));
  }, [siteSetting?.bgm_file, siteSetting?.bgm_title]);

  // Clean up any interaction listeners helper
  const removeInteractionListeners = useCallback(() => {
    if (interactionCleanupRef.current) {
      interactionCleanupRef.current();
      interactionCleanupRef.current = null;
    }
  }, []);

  // Smooth Volume Fade In helper
  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0;
    let currentVol = 0;
    const step = TARGET_VOLUME / 25; // Smooth 25 steps (~1.25 seconds)
    const interval = setInterval(() => {
      currentVol = Math.min(currentVol + step, TARGET_VOLUME);
      audio.volume = currentVol;
      if (currentVol >= TARGET_VOLUME) {
        clearInterval(interval);
      }
    }, 50);
  }, []);

  // Play audio safely handling browser autoplay restrictions
  const startPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isBgmEnabledRef.current || isUserMutedRef.current) return;

    audio.loop = true;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeIn(audio);
          removeInteractionListeners();
        })
        .catch(() => {
          // Autoplay was blocked by browser security policy.
          // Wait for user's first interaction anywhere on document.
          removeInteractionListeners();

          const handleFirstInteraction = () => {
            removeInteractionListeners();
            const currentAudio = audioRef.current;
            if (
              currentAudio &&
              isBgmEnabledRef.current &&
              !isUserMutedRef.current &&
              isMainPortfolioReadyRef.current
            ) {
              currentAudio.play().then(() => {
                setIsPlaying(true);
                fadeIn(currentAudio);
              }).catch(() => {});
            }
          };

          window.addEventListener("click", handleFirstInteraction, { once: true });
          window.addEventListener("touchstart", handleFirstInteraction, { once: true });
          window.addEventListener("keydown", handleFirstInteraction, { once: true });

          interactionCleanupRef.current = () => {
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
          };
        });
    }
  }, [fadeIn, removeInteractionListeners]);

  // Check when preloader finishes and main portfolio becomes active
  useEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio_intro_seen") === "true") {
        setIsMainPortfolioReady(true);
      }
    } catch {
      // Fallback
    }

    const handlePortfolioReady = () => {
      setIsMainPortfolioReady(true);
    };

    window.addEventListener("portfolio_main_ready", handlePortfolioReady);
    window.addEventListener("portfolio_focus_reveal", handlePortfolioReady);

    return () => {
      window.removeEventListener("portfolio_main_ready", handlePortfolioReady);
      window.removeEventListener("portfolio_focus_reveal", handlePortfolioReady);
    };
  }, []);

  // Manage Audio element life-cycle and source changes
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (audio.src !== audioSrc && audioSrc) {
      const wasPlaying = !audio.paused;
      audio.src = audioSrc;
      audio.load();
      if (wasPlaying && isBgmEnabled && isMainPortfolioReady && !isUserMuted) {
        startPlaying();
      }
    }
  }, [audioSrc, isBgmEnabled, isMainPortfolioReady, isUserMuted, startPlaying]);

  // Strict enforcement of BGM enablement:
  // If BGM is disabled from backend: IMMEDIATELY halt audio, cancel listeners, reset state!
  useEffect(() => {
    const audio = audioRef.current;
    if (!isBgmEnabled) {
      removeInteractionListeners();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    // Only start if both portfolio is ready AND backend data has loaded
    if (isDataLoaded && isMainPortfolioReady && !isUserMuted) {
      startPlaying();
    }
  }, [isBgmEnabled, isDataLoaded, isMainPortfolioReady, isUserMuted, startPlaying, removeInteractionListeners]);

  // Tab switching / Window visibility management
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (
          isMainPortfolioReadyRef.current &&
          isBgmEnabledRef.current &&
          !isUserMutedRef.current
        ) {
          audio.play().then(() => {
            setIsPlaying(true);
            audio.volume = TARGET_VOLUME;
          }).catch(() => {});
        }
      }
    };

    const handleWindowBlur = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleWindowBlur);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeInteractionListeners();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [removeInteractionListeners]);

  // Manual Toggle button handler
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !isBgmEnabled) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsUserMuted(true);
    } else {
      setIsUserMuted(false);
      audio.play().then(() => {
        setIsPlaying(true);
        fadeIn(audio);
      }).catch(() => {});
    }
  };

  // Do not render floating audio UI during preloader or when disabled from backend
  if (!isMainPortfolioReady || !isBgmEnabled) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-40 select-none pointer-events-auto"
      title={isPlaying ? `Playing: ${trackName} (Click to mute)` : `Muted: ${trackName} (Click to play)`}
    >
      <motion.button
        onClick={toggleMute}
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#090226]/85 hover:bg-[#120538] border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all duration-300 cursor-pointer"
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        {/* Animated Cyber Equalizer Bars */}
        <div className="flex items-end gap-[3px] h-4 w-4 justify-center">
          <span
            className={`w-[2.5px] rounded-full bg-cyan-400 transition-all ${
              isPlaying ? "animate-pulse" : "h-1 opacity-50"
            }`}
            style={{
              height: isPlaying ? "80%" : "25%",
              animationDuration: isPlaying ? "0.6s" : "0s",
            }}
          />
          <span
            className={`w-[2.5px] rounded-full bg-purple-400 transition-all ${
              isPlaying ? "animate-pulse" : "h-1.5 opacity-50"
            }`}
            style={{
              height: isPlaying ? "100%" : "35%",
              animationDuration: isPlaying ? "0.8s" : "0s",
              animationDelay: "0.2s",
            }}
          />
          <span
            className={`w-[2.5px] rounded-full bg-cyan-300 transition-all ${
              isPlaying ? "animate-pulse" : "h-1 opacity-50"
            }`}
            style={{
              height: isPlaying ? "65%" : "20%",
              animationDuration: isPlaying ? "0.5s" : "0s",
              animationDelay: "0.4s",
            }}
          />
        </div>

        {/* Track Label Badge */}
        <div className="flex items-center gap-1.5 pr-1">
          <span className="text-[11px] font-mono tracking-wider text-gray-200 group-hover:text-cyan-300 transition-colors max-w-[130px] truncate">
            {isPlaying ? trackName : "Music Muted"}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPlaying
                ? "bg-green-400 shadow-[0_0_8px_#4ade80]"
                : "bg-gray-500 opacity-60"
            }`}
          />
        </div>
      </motion.button>
    </div>
  );
};

