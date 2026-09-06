export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tareq052.pythonanywhere.com";

/**
 * Resolves project and media image URLs safely across development & production.
 * Handles /media/ uploads from Django backend as well as absolute URLs.
 */
export function getValidImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return "/projects/project1.png";
  }
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return "/projects/project1.png";
  }

  // Already a full external or data URL
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:")
  ) {
    return cleanUrl;
  }

  // If it's a Django media upload path (/media/projects/...)
  if (cleanUrl.startsWith("/media/")) {
    const base = API_BASE_URL.replace(/\/+$/, "");
    return `${base}${cleanUrl}`;
  }

  // If it's an uploaded file path without leading slash (e.g. projects/...)
  if (cleanUrl.startsWith("projects/") && !cleanUrl.startsWith("/projects/")) {
    const base = API_BASE_URL.replace(/\/+$/, "");
    return `${base}/media/${cleanUrl}`;
  }

  // Standard Next.js public static asset (e.g. /projects/project1.png)
  return cleanUrl;
}

export interface SiteSetting {
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  whatsapp_number: string;
  location: string;
  blog_url: string;
  github_url: string;
  linkedin_url: string;
  kaggle_url: string;
  twitter_url: string;
  resume_url: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  start_year: string;
  end_year: string;
  grade_or_cgpa: string;
  field_of_study: string;
  thesis_or_description: string;
  order: number;
  is_active: boolean;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  job_type: string;
  description: string;
  technologies: string;
  technologies_list: string[];
  order: number;
  is_active: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  image_file?: string | null;
  image_url?: string;
  live_url: string;
  github_url: string;
  tech_stack: string;
  tech_stack_list: string[];
  is_featured: boolean;
  order: number;
}

export interface ResearchPaper {
  id: number;
  title: string;
  publisher: string;
  publication_date: string;
  abstract: string;
  paper_url: string;
  pdf_url: string;
  tags: string;
  tags_list: string[];
  citations_count: number;
  order: number;
}

export interface PortfolioBundle {
  site_setting: SiteSetting;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  research: ResearchPaper[];
}

// Default Fallback Data (Guarantees 100% uptime even if API is starting)
export const DEFAULT_SITE_SETTING: SiteSetting = {
  full_name: "Md Tareq Shah Alam",
  headline: "Machine Learning Engineer & Data Scientist",
  bio: "Passionate about extracting actionable insights from data and architecting cutting-edge AI solutions. Specializing in NLP, Transformers, CNNs, LangChain, LlamaIndex, and advanced SQL workflows to solve complex real-world challenges.",
  email: "tareqshah.027@gmail.com",
  whatsapp_number: "+8801625801530",
  location: "Dhaka, Bangladesh",
  blog_url: "https://medium.com/@tareqshahalam",
  github_url: "https://github.com/tareqshah027",
  linkedin_url: "https://www.linkedin.com/in/md-tareq-shah-alam/",
  kaggle_url: "https://www.kaggle.com",
  twitter_url: "https://twitter.com",
  resume_url: "",
};

export const FALLBACK_PRODUCTION_API_URL = "https://tareq052.pythonanywhere.com";

export async function fetchPortfolioBundle(): Promise<PortfolioBundle | null> {
  // 1. Primary: Try configured API_BASE_URL (defaults to http://127.0.0.1:8000 for local backend)
  try {
    const res = await fetch(`${API_BASE_URL}/api/all/`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // If local dev server is unreachable, fall through to fallback
  }

  // 2. Secondary: If primary fails and was not production, fallback to production live backend
  if (API_BASE_URL !== FALLBACK_PRODUCTION_API_URL) {
    try {
      const res = await fetch(`${FALLBACK_PRODUCTION_API_URL}/api/all/`, {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Both unavailable
    }
  }

  return null;
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  const endpoints = [API_BASE_URL];
  if (API_BASE_URL !== FALLBACK_PRODUCTION_API_URL) {
    endpoints.push(FALLBACK_PRODUCTION_API_URL);
  }

  for (const base of endpoints) {
    try {
      const res = await fetch(`${base}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          message: data.message || "Message sent successfully!",
        };
      }
    } catch {
      continue;
    }
  }

  return {
    success: false,
    message: "Network error connecting to backend. Please check connection.",
    error: "Network error",
  };
}
