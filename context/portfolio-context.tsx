"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  fetchPortfolioBundle,
  PortfolioBundle,
  SiteSetting,
  Education,
  Experience,
  Project,
  ResearchPaper,
  DEFAULT_SITE_SETTING,
} from "@/lib/api";

interface PortfolioContextType {
  siteSetting: SiteSetting;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  research: ResearchPaper[];
  isLoading: boolean;
  lastSyncedAt: Date | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  siteSetting: DEFAULT_SITE_SETTING,
  education: [],
  experience: [],
  projects: [],
  research: [],
  isLoading: false,
  lastSyncedAt: null,
  refresh: async () => {},
});

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [siteSetting, setSiteSetting] = useState<SiteSetting>(DEFAULT_SITE_SETTING);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [research, setResearch] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data: PortfolioBundle | null = await fetchPortfolioBundle();
      if (data) {
        if (data.site_setting) setSiteSetting(data.site_setting);
        if (data.education) setEducation(data.education);
        if (data.experience) setExperience(data.experience);
        if (data.projects) setProjects(data.projects);
        if (data.research) setResearch(data.research);
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.warn("Portfolio auto-sync error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    loadData();

    // 1. Auto-refresh polling every 5 seconds (Real-time live sync)
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    // 2. Instant sync when returning to tab from Django Admin
    const handleFocus = () => {
      loadData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadData]);

  return (
    <PortfolioContext.Provider
      value={{
        siteSetting,
        education,
        experience,
        projects,
        research,
        isLoading,
        lastSyncedAt,
        refresh: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
