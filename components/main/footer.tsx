import Link from "next/link";

import { FOOTER_DATA } from "@/constants";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#030014]/60 border-t border-[#7042f8]/20 text-gray-200 shadow-2xl py-12 px-6 relative z-30 backdrop-blur-md">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
        {/* Two Columns: Community and About */}
        <div className="w-full flex flex-row items-start justify-center gap-12 sm:gap-32 flex-wrap mb-10">
          {FOOTER_DATA.map((column) => (
            <div
              key={column.title}
              className="min-w-[160px] flex flex-col items-center sm:items-start justify-start"
            >
              <h3 className="font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3 tracking-wide">
                {column.title}
              </h3>
              <div className="flex flex-col space-y-3">
                {column.data.map(({ icon: Icon, name, link }) => {
                  const isExternal = link.startsWith("http");
                  return (
                    <Link
                      key={`${column.title}-${name}`}
                      href={link}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 group"
                    >
                      {Icon && (
                        <Icon className="text-base text-purple-400 group-hover:text-cyan-300 transition-colors" />
                      )}
                      <span>{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-purple-500/10 w-full text-center text-xs text-gray-400 font-mono">
          &copy; Md Tareq Shah Alam 2026 Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
