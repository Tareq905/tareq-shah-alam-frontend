import { Metadata } from "next";
import { Terminal } from "@/components/cli/terminal";

export const metadata: Metadata = {
  title: "Tareq CLI — Interactive ML/AI Engineer Terminal Shell",
  description:
    "Interactive command-line workstation portfolio of Md Tareq Shah Alam. Explore AI/ML models, NLP architectures, projects, and skills through a Linux-inspired shell.",
};

export default function CliPage() {
  return (
    <main
      suppressHydrationWarning
      className="min-h-screen w-full bg-[#02000c] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Subtle fine technical grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#7042f8 1px, transparent 1px), linear-gradient(to right, #7042f8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle radial ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Terminal Shell */}
      <div className="w-full max-w-5xl z-10">
        <Terminal />
      </div>
    </main>
  );
}
