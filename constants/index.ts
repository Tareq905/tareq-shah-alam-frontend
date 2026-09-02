import { FaYoutube, FaFacebook } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";
import { SiMedium, SiHuggingface, SiKaggle } from "react-icons/si";


export const SOCIALS = [
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://instagram.com",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: RxTwitterLogo,
    link: "https://x.com/_sanidhyy",
  },
] as const;

export interface SkillItem {
  name: string;
  category: "agentic" | "ml" | "data" | "mlops";
  categoryLabel: string;
  image: string;
  level: "Mastery" | "Production" | "Advanced";
  desc: string;
  glowColor: string;
}

export const SKILL_CATEGORIES = [
  { id: "all", label: "✨ All Technologies" },
  { id: "agentic", label: "🤖 Agentic AI & LLMs" },
  { id: "ml", label: "⚡ Machine Learning & CV" },
  { id: "data", label: "🗄️ Databases & Vector Stores" },
  { id: "mlops", label: "🚀 MLOps & Cloud" },
] as const;

export const ALL_SKILLS: SkillItem[] = [
  // Agentic AI & LLMs
  {
    name: "LangGraph",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "langgraph.png",
    level: "Mastery",
    desc: "Cyclic multi-agent graphs, state persistence, memory checkpointing & tool control.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    name: "LangChain",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "langchain.png",
    level: "Mastery",
    desc: "Autonomous tool orchestration, custom memory schemas & sequential agent pipelines.",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    name: "LLM & Fine-Tuning",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "llm.png",
    level: "Mastery",
    desc: "LoRA / QLoRA parameter-efficient fine-tuning, KV-caching, vLLM & Quantization.",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    name: "AI Agents",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "AI Agent.jpg",
    level: "Mastery",
    desc: "Autonomous multi-step reasoning, goal decomposition, planning & execution loops.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    name: "Hugging Face",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "higgingface.jpg",
    level: "Production",
    desc: "Transformer pipelines, dataset caching, model hub deployment & tokenizers.",
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
  {
    name: "NLP & Tokenization",
    category: "agentic",
    categoryLabel: "Agentic AI",
    image: "nlp.jpg",
    level: "Production",
    desc: "Semantic chunking, vector embedding models, intent parsing & NER classification.",
    glowColor: "rgba(99, 102, 241, 0.5)",
  },

  // Machine Learning & Core
  {
    name: "Python",
    category: "ml",
    categoryLabel: "Core AI Language",
    image: "python.avif",
    level: "Mastery",
    desc: "High-performance NumPy, PyTorch tensor manipulation, and algorithmic modeling.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    name: "Computer Vision",
    category: "ml",
    categoryLabel: "Machine Learning",
    image: "what-is-nlp.avif",
    level: "Advanced",
    desc: "Deep residual CNNs, image feature extraction & visual anomaly detection.",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    name: "TypeScript",
    category: "ml",
    categoryLabel: "Core Fullstack",
    image: "ts.png",
    level: "Production",
    desc: "Type-safe AI client interfaces, streaming wrappers & fullstack integration.",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    name: "Next.js",
    category: "ml",
    categoryLabel: "Core Fullstack",
    image: "next.png",
    level: "Production",
    desc: "Modern SSR web applications, AI chat streaming interfaces & Server Actions.",
    glowColor: "rgba(255, 255, 255, 0.4)",
  },

  // Databases & Vector Stores
  {
    name: "PostgreSQL",
    category: "data",
    categoryLabel: "Database & Vector",
    image: "postgresql.png",
    level: "Mastery",
    desc: "pgvector similarity search, relational schemas & high-throughput ACID storage.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    name: "SQL",
    category: "data",
    categoryLabel: "Database",
    image: "sql.png",
    level: "Mastery",
    desc: "Complex analytical queries, indexing optimization & window functions.",
    glowColor: "rgba(34, 197, 94, 0.5)",
  },
  {
    name: "MongoDB",
    category: "data",
    categoryLabel: "NoSQL DB",
    image: "mongodb.png",
    level: "Production",
    desc: "Flexible JSON document storage, aggregation pipelines & dynamic caching.",
    glowColor: "rgba(34, 197, 94, 0.5)",
  },
  {
    name: "MySQL",
    category: "data",
    categoryLabel: "Database",
    image: "mysql.png",
    level: "Production",
    desc: "Structured data modeling, transaction handling & query optimization.",
    glowColor: "rgba(14, 165, 233, 0.5)",
  },
  {
    name: "GraphQL",
    category: "data",
    categoryLabel: "API Schema",
    image: "graphql.png",
    level: "Advanced",
    desc: "Declarative API queries, schema definitions & real-time subscriptions.",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },

  // MLOps & Infrastructure
  {
    name: "Docker",
    category: "mlops",
    categoryLabel: "MLOps",
    image: "docker.png",
    level: "Mastery",
    desc: "Containerized GPU/CUDA model serving, Dockerfiles & reproducible environments.",
    glowColor: "rgba(14, 165, 233, 0.5)",
  },
  {
    name: "Node.js",
    category: "mlops",
    categoryLabel: "Backend",
    image: "node.png",
    level: "Production",
    desc: "Event-driven asynchronous microservices, streaming endpoints & WebSockets.",
    glowColor: "rgba(34, 197, 94, 0.5)",
  },
  {
    name: "Tailwind CSS",
    category: "mlops",
    categoryLabel: "UI & Styling",
    image: "tailwind.png",
    level: "Mastery",
    desc: "Custom glassmorphism, responsive utility-first design systems & animations.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    name: "Firebase",
    category: "mlops",
    categoryLabel: "Cloud Platform",
    image: "firebase.png",
    level: "Production",
    desc: "Realtime database sync, cloud authentication & edge deployment.",
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
];

export const SKILL_DATA = ALL_SKILLS.map((s) => ({
  skill_name: s.name,
  image: s.image,
  width: 75,
  height: 75,
}));

export const FRONTEND_SKILL = SKILL_DATA.slice(0, 6);
export const BACKEND_SKILL = SKILL_DATA.slice(6, 12);
export const FULLSTACK_SKILL = SKILL_DATA.slice(12, 16);
export const OTHER_SKILL = SKILL_DATA.slice(16);

export const PROJECTS = [
  {
    title: "Autonomous Agentic RAG Pipeline",
    description:
      "Enterprise multi-agent retrieval and reasoning engine combining LangChain, LlamaIndex, and Groq/Llama-3 for high-throughput semantic search and knowledge extraction across dense document vaults.",
    image: "/projects/project-1.png",
    link: "https://medium.com/@tareqshahalam",
    tags: ["LangChain", "LlamaIndex", "RAG", "PyTorch", "Vector DB"],
  },
  {
    title: "Transformer-based Neural NLP Suite",
    description:
      "Production-grade Natural Language Processing architecture featuring custom domain-adapted BERT & RoBERTa models for multi-class intent recognition, entity extraction, and sentiment analytics.",
    image: "/projects/project-2.png",
    link: "https://medium.com/@tareqshahalam",
    tags: ["Transformers", "Hugging Face", "NLP", "PyTorch", "FastAPI"],
  },
  {
    title: "Deep Vision & CNN Anomaly Detector",
    description:
      "Real-time Computer Vision deep learning pipeline utilizing modern Convolutional Neural Networks (CNNs) and transfer learning for high-precision visual inspection and automated anomaly segmentation.",
    image: "/projects/project-3.png",
    link: "https://medium.com/@tareqshahalam",
    tags: ["CNN", "Deep Learning", "Computer Vision", "PyTorch", "Docker"],
  },
] as const;

export const RESEARCH_PAPERS = [
  {
    title: "Optimizing Attention Mechanisms in Modern Transformer Architectures",
    description:
      "An analytical deep-dive into multi-head self-attention efficiency, rotary positional embeddings (RoPE), KV-cache pruning, and memory bandwidth bottlenecks in large-scale generative language models.",
    venue: "Technical Research Article • 8 min read",
    link: "https://medium.com/@tareqshahalam",
    tags: ["Transformer Architecture", "Attention Mechanisms", "LLM Optimization"],
  },
  {
    title: "Agentic AI Workflows: Evaluating Graph-based Orchestration vs Hierarchical RAG",
    description:
      "Empirical benchmark comparing LangGraph state machines with LlamaIndex tree-structured indices for multi-step reasoning, tool execution, and dynamic context retrieval accuracy.",
    venue: "AI & ML Architecture Paper • 6 min read",
    link: "https://medium.com/@tareqshahalam",
    tags: ["Agentic AI", "LangGraph", "Hybrid RAG", "System Design"],
  },
  {
    title: "Deep Residual CNNs for High-Resolution Feature Extraction & Visual Reasoning",
    description:
      "Comprehensive investigation into residual skip-connections, gradient flow stability, and hierarchical feature map representations in deep convolutional networks for computer vision.",
    venue: "Computer Vision Research Series • 7 min read",
    link: "https://medium.com/@tareqshahalam",
    tags: ["CNNs", "Residual Networks", "Representation Learning"],
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Community",
    data: [
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com",
      },
      {
        name: "Medium Articles",
        icon: SiMedium,
        link: "https://medium.com/@tareqshahalam",
      },
      {
        name: "LinkedIn",
        icon: RxLinkedinLogo,
        link: "https://linkedin.com",
      },
      {
        name: "Hugging Face",
        icon: SiHuggingface,
        link: "https://huggingface.co",
      },
    ],
  },
  {
    title: "About",
    data: [
      {
        name: "About Tareq",
        icon: null,
        link: "#about-me",
      },
      {
        name: "AI & ML Projects",
        icon: null,
        link: "#projects",
      },
      {
        name: "Interactive AI Vault",
        icon: null,
        link: "#skills",
      },
      {
        name: "Contact Me",
        icon: null,
        link: "#contact",
      },
    ],
  },
] as const;

export const EXPERIENCES = [
  {
    role: "Lead AI / ML Engineer & Researcher",
    company: "AI Intelligence Labs & Autonomous Systems",
    period: "2024 – Present",
    type: "Full-Time / Research",
    description:
      "Architecting enterprise-grade agentic workflows, multi-agent state machines, and fine-tuning open-weights LLMs for low-latency production deployment and automated reasoning.",
    highlights: [
      "Built multi-agent autonomous decision graph pipelines with LangGraph & LlamaIndex.",
      "Fine-tuned domain-adapted models with LoRA/QLoRA and accelerated with vLLM / TensorRT.",
      "Engineered hybrid semantic-vector RAG retrieval with sub-50ms latency.",
    ],
    skills: ["LangGraph", "LangChain", "PyTorch", "Hugging Face", "vLLM", "Docker", "Agentic AI"],
  },
  {
    role: "Machine Learning Specialist & Data Scientist",
    company: "Neural Vision & Predictive Solutions",
    period: "2022 – 2024",
    type: "Engineering",
    description:
      "Engineered end-to-end deep learning models for NLP semantic search and convolutional neural networks (CNNs) for high-resolution visual feature classification.",
    highlights: [
      "Deployed scalable FastAPI inference microservices handling high-throughput queries.",
      "Constructed automated MLOps pipelines with containerized Docker orchestration.",
      "Conducted empirical research on Transformer attention optimization.",
    ],
    skills: ["Python", "PyTorch", "Transformers", "NLP", "CNN", "FastAPI", "PostgreSQL"],
  },
  {
    role: "Data Intelligence & Analytics Engineer",
    company: "Core Data & Algorithmic Systems",
    period: "2020 – 2022",
    type: "Data Engineering",
    description:
      "Designed robust statistical predictive models, feature engineering pipelines, and optimized relational PostgreSQL schemas for machine learning datasets.",
    highlights: [
      "Optimized complex analytical SQL queries resulting in 4x faster data processing.",
      "Developed regression & clustering pipelines for anomaly detection in large datasets.",
    ],
    skills: ["Python", "SQL", "PostgreSQL", "Scikit-Learn", "Pandas", "Statistical Modeling"],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "Home",
    link: "#",
  },
  {
    title: "About me",
    link: "#about-me",
  },
  {
    title: "Experience",
    link: "#experience",
  },
  {
    title: "Projects & Research",
    link: "#projects",
  },
  {
    title: "Blog",
    link: "https://medium.com/@tareqshahalam",
  },
  {
    title: "Contact",
    link: "#contact",
  },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/sanidhyy/space-portfolio",
  whatsapp: "https://wa.me/8801625801530",
};
