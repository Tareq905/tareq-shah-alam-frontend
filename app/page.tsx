import { AboutMe } from "@/components/main/about-me";
import { Contact } from "@/components/main/contact";
import { Encryption } from "@/components/main/encryption";
import { Experience } from "@/components/main/experience";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { PortfolioWrapper } from "@/components/main/portfolio-wrapper";

export default function Home() {
  return (
    <PortfolioWrapper>
      <main suppressHydrationWarning className="h-full w-full">
        <div suppressHydrationWarning className="flex flex-col gap-8 sm:gap-12">
          <Hero />
          <AboutMe />
          <Skills />
          <Experience />
          <Encryption />
          <Projects />
          <Contact />
        </div>
      </main>
    </PortfolioWrapper>
  );
}
