export interface CliProject {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface CliSkillCategory {
  category: string;
  skills: string[];
}

export const CLI_PROFILE = {
  name: "Md Tareq Shah Alam",
  role: "Machine Learning Engineer & Data Scientist",
  location: "Dhaka, Bangladesh (Available for Global Remote Roles & Collaborations)",
  focus: [
    "Artificial Intelligence & Autonomous Agentic Workflows",
    "Large Language Models (LLMs) & Transformer Architectures",
    "Natural Language Processing (NLP) & Semantic Search (RAG)",
    "Deep Learning & Convolutional Neural Networks (CNNs)",
    "High-Performance Machine Learning Pipelines & MLOps",
  ],
  bio: `I am an ML/AI Engineer dedicated to transforming complex data into intelligent, autonomous systems. 
My engineering philosophy centers on rigorous mathematical foundations, clean production architecture, and building cutting-edge LLM & Vision solutions that solve high-impact real-world problems.`,
  contact: {
    email: "tareqshah.027@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    medium: "https://medium.com/@tareqshahalam",
  },
};

export const CLI_SKILLS: CliSkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "SQL (PostgreSQL / MySQL)", "Go", "C/C++ basics"],
  },
  {
    category: "Machine Learning & Deep Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "CNNs",
      "Residual Networks",
      "Transfer Learning",
    ],
  },
  {
    category: "NLP & Generative AI",
    skills: [
      "Transformers",
      "Hugging Face",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "Hybrid RAG",
      "Agentic AI",
      "Groq LLM Inference",
    ],
  },
  {
    category: "Data Engineering & Analytics",
    skills: ["Pandas", "NumPy", "GraphQL", "Vector Databases (Chroma / Pinecone)", "Dataform"],
  },
  {
    category: "MLOps & Engineering",
    skills: ["Docker", "FastAPI", "Git / GitHub", "REST APIs", "CI/CD Pipelines"],
  },
];

export const CLI_PROJECTS: CliProject[] = [
  {
    id: 1,
    title: "Autonomous Agentic RAG Pipeline",
    category: "Generative AI & Semantic Retrieval",
    description:
      "Enterprise-grade multi-agent retrieval and reasoning engine combining LangChain, LlamaIndex, and Groq/Llama-3 for high-throughput semantic search and knowledge extraction over dense document vaults.",
    technologies: ["Python", "LangChain", "LlamaIndex", "PyTorch", "Vector DB", "Groq API"],
    githubUrl: "https://github.com",
    liveUrl: "https://medium.com/@tareqshahalam",
    featured: true,
  },
  {
    id: 2,
    title: "Transformer-based Neural NLP Suite",
    category: "Natural Language Processing",
    description:
      "Production-grade Natural Language Processing architecture featuring custom domain-adapted BERT & RoBERTa models for multi-class intent recognition, entity extraction, and sentiment analytics.",
    technologies: ["Transformers", "Hugging Face", "NLP", "PyTorch", "FastAPI"],
    githubUrl: "https://github.com",
    liveUrl: "https://medium.com/@tareqshahalam",
    featured: true,
  },
  {
    id: 3,
    title: "Deep Vision & CNN Anomaly Detector",
    category: "Computer Vision & Deep Learning",
    description:
      "Real-time Computer Vision deep learning pipeline utilizing modern Convolutional Neural Networks (CNNs) and transfer learning for high-precision visual inspection and automated anomaly segmentation.",
    technologies: ["CNN", "Deep Learning", "Computer Vision", "PyTorch", "Docker"],
    githubUrl: "https://github.com",
    liveUrl: "https://medium.com/@tareqshahalam",
    featured: true,
  },
];

export const CLI_VIRTUAL_FILES: Record<string, string> = {
  "about.txt": `[ABOUT TAREQ]
Name: Md Tareq Shah Alam
Title: Machine Learning Engineer & Data Scientist
Location: Dhaka, Bangladesh (Global Remote & Hybrid Available)
Focus: LLMs, Transformer Architectures, NLP Semantic RAG, Computer Vision (CNNs), MLOps.
Summary: AI Engineer with a passion for building scalable machine learning pipelines, fine-tuned agentic models, and mathematical deep learning solutions.`,

  "skills.json": `{
  "languages": ["Python", "SQL", "Go", "C/C++"],
  "machine_learning": ["PyTorch", "TensorFlow", "Scikit-Learn", "CNNs", "Transfer Learning"],
  "nlp_and_genai": ["Transformers", "Hugging Face", "LangChain", "LangGraph", "LlamaIndex", "RAG", "Groq Inference"],
  "data_engineering": ["Pandas", "NumPy", "PostgreSQL", "Vector DBs", "GraphQL"],
  "mlops_and_backend": ["Docker", "FastAPI", "REST APIs", "Git/GitHub", "Linux Workstations"]
}`,

  "contact.md": `# Contact Information
- Email: tareqshah.027@gmail.com
- Medium: https://medium.com/@tareqshahalam
- GitHub: https://github.com
- LinkedIn: https://linkedin.com`,

  "resume.pdf": `[BINARY FILE: resume.pdf]
Type 'resume' or click the download link to view Tareq's verified resume.`,
};

export const CLI_ENV_VARS: Record<string, string> = {
  USER: "tareq",
  HOME: "/home/tareq",
  SHELL: "/bin/tareqsh",
  TERM: "xterm-256color",
  CUDA_VISIBLE_DEVICES: "0,1",
  TORCH_CUDA_ARCH_LIST: "8.9;9.0",
  PYTHON_VERSION: "3.11.8",
  DEFAULT_LLM: "openai/gpt-oss-120b",
  FAST_LLM: "openai/gpt-oss-20b",
  ML_FRAMEWORK: "PyTorch 2.3.0+cu121",
  AGENT_ORCHESTRATOR: "LangGraph / LlamaIndex",
  PORTFOLIO_ENV: "production",
};

export const CLI_WITTY_RESPONSES: Record<string, string> = {
  dance: "bash: dance: command not found.\nEven state-of-the-art AI models need better prompts than that.",
  hack: "Nice try.\nMy firewall is trained on 10,000 epochs of 'no.'",
  "rm -rf /": "Whoa there.\nOverfitting isn't the only thing that can destroy a model — careful with that command.",
  del: "Access denied.\nWindows system files and AI weights are protected against deletion.",
  love: "404: Emotion module not found.\nTry 'contact' instead — humans handle that part.",
  exit: "There is no exit from the neural matrix. Type 'clear' or 'cls' to reset screen.",
  quit: "You cannot quit an interactive workstation shell. Try 'clear' or 'help'.",
};

export const CLI_DEFAULT_COMMAND_NOT_FOUND = [
  (cmd: string) => `bash / cmd: '${cmd}' is not recognized as an internal or external command.\nType 'help' to see all available commands.`,
  (cmd: string) => `Command '${cmd}' not found in Tareq hybrid Linux/Windows shell.\nDid you mean 'help', 'projects', 'cls', or 'dir'?`,
  (cmd: string) => `Unknown instruction: '${cmd}'.\nTry 'help' or 'man' for the complete command registry.`,
];
