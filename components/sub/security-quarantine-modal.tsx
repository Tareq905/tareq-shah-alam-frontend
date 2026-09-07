'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShieldExclamation,
  HiOutlineLockClosed,
  HiOutlineClock,
  HiOutlineCpuChip,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { QuarantineRecord } from "@/lib/security/ip-blocklist-store";

interface Props {
  record: QuarantineRecord;
}

export const SecurityQuarantineModal = ({ record }: Props) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 30, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = record.expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [record.expiresAt]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-4 py-8 overflow-y-auto">
        {/* Background Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444410_1px,transparent_1px),linear-gradient(to_bottom,#ef444410_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none opacity-40" />

        {/* Pulsing Red Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#090214]/95 border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.35),inset_0_1px_2px_rgba(255,255,255,0.15)] text-left overflow-hidden z-10"
        >
          {/* Top Edge Warning Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)] shrink-0">
              <HiOutlineShieldExclamation className="w-8 h-8 text-red-400 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-900/60 border border-red-500/50 text-red-300 tracking-wider">
                  HTTP 403 • ACCESS TERMINATED
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-900/60 border border-purple-500/50 text-purple-300 tracking-wider">
                  30-DAY QUARANTINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5 font-mono">
                CYBER DEFENSE LOCKDOWN
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Malicious exploit or prompt injection attempt was detected and neutralized.
              </p>
            </div>
          </div>

          {/* Incident Dossier Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 bg-[#04010b]/80 border border-red-500/20 p-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase text-gray-500">Incident Reference</span>
              <span className="text-xs font-mono font-semibold text-red-300">
                {record.incidentId}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase text-gray-500">Threat Classification</span>
              <span className="text-xs font-semibold text-amber-300">
                {record.threatName}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase text-gray-500">Detection Engine</span>
              <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono">
                <HiOutlineCpuChip className="w-3.5 h-3.5 text-cyan-400" />
                <span>{record.aiModel || "Qwen 3.6 27B AI Analyst"}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase text-gray-500">Host Target</span>
              <span className="text-xs font-mono text-gray-300">
                IP: {record.ip}
              </span>
            </div>

            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-red-500/10">
              <span className="text-[11px] font-mono uppercase text-gray-500">Violation Details</span>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                {record.reason}
              </p>
            </div>
          </div>

          {/* 30-Day Live Countdown Timer */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-b from-[#14061a] to-[#0d0317] border border-purple-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <HiOutlineClock className="w-4 h-4 text-amber-400" />
                <span>AUTOMATED QUARANTINE COUNTDOWN</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400">Strict Enforcement</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-black/60 border border-white/5 p-2 rounded-xl">
                <div className="text-lg sm:text-2xl font-bold font-mono text-white">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">Days</div>
              </div>
              <div className="bg-black/60 border border-white/5 p-2 rounded-xl">
                <div className="text-lg sm:text-2xl font-bold font-mono text-white">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">Hours</div>
              </div>
              <div className="bg-black/60 border border-white/5 p-2 rounded-xl">
                <div className="text-lg sm:text-2xl font-bold font-mono text-white">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">Mins</div>
              </div>
              <div className="bg-black/60 border border-white/5 p-2 rounded-xl">
                <div className="text-lg sm:text-2xl font-bold font-mono text-red-400">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">Secs</div>
              </div>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="flex items-center gap-2.5 mt-5 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200/90">
            <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              Your IP address and browser credentials have been placed into an automated 30-day quarantine blacklist. Any repeated attempts will extend this lock.
            </span>
          </div>

          {/* Footer actions */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <HiOutlineLockClosed className="w-3.5 h-3.5 text-gray-400" />
              Protected by Qwen 3.6 27B AI WAF Engine
            </span>
            <span>Md Tareq Shah Alam Portfolio</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
