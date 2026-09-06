import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { Preloader } from "@/components/main/preloader";
import { StarsCanvas } from "@/components/main/star-background";
import { CustomCursor } from "@/components/sub/custom-cursor";
import { WaterTouchRipple } from "@/components/sub/water-touch-ripple";
import { BackgroundMusic } from "@/components/sub/background-music";
import { PortfolioProvider } from "@/context/portfolio-context";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          inter.className
        )}
      >
        <PortfolioProvider>
          <BackgroundMusic />
          <CustomCursor />
          <WaterTouchRipple />
          <Preloader />
          <StarsCanvas />
          <Navbar />
          {children}
          <Footer />
        </PortfolioProvider>
      </body>
    </html>
  );
}
