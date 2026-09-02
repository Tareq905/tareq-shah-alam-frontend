import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Md Tareq Shah Alam | Machine Learning & Data Science Portfolio",
  description: "Machine Learning Engineer & Data Scientist specializing in NLP, Transformers, Deep Learning (CNN), LangChain, LlamaIndex, and Data Analytics.",
  keywords: [
    "Machine Learning",
    "Data Science",
    "NLP",
    "Transformers",
    "CNN",
    "LangChain",
    "LlamaIndex",
    "Deep Learning",
    "Generative AI",
    "Python",
    "PyTorch",
    "SQL",
    "Tareq Shah Alam",
    "AI Engineer",
  ] as Array<string>,
  authors: {
    name: "Md Tareq Shah Alam",
    url: "https://medium.com/@tareqshahalam",
  },
  icons: {
    icon: "/skills/tareq-logo-clean.png",
    shortcut: "/skills/tareq-logo-clean.png",
    apple: "/app/apple-icon.png",
  },
} as const;
