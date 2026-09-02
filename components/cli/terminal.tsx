"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CLI_PROFILE,
  CLI_PROJECTS,
  CLI_SKILLS,
  CLI_VIRTUAL_FILES,
  CLI_ENV_VARS,
  CLI_WITTY_RESPONSES,
  CLI_DEFAULT_COMMAND_NOT_FOUND,
} from "@/constants/cli-data";

interface HistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp?: string;
}

const AUTOCOMPLETE_COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "resume",
  "contact",
  "clear",
  "cls",
  "ls",
  "dir",
  "cat",
  "type",
  "pwd",
  "cd",
  "whoami",
  "hostname",
  "uname",
  "systeminfo",
  "nvidia-smi",
  "ps",
  "top",
  "tasklist",
  "ipconfig",
  "ifconfig",
  "ping",
  "curl",
  "date",
  "time",
  "echo",
  "env",
  "set",
  "history",
  "theme",
  "ver",
  "version",
  "sudo",
  "neofetch",
  "matrix",
  "ml",
  "nlp",
  "transformer",
];

const BOOT_LINES = [
  "Initializing Tareq Hybrid Linux/Windows Kernel 6.8...",
  "Mounting /dev/nvme0n1 (Virtual ML Workstation FileSystem)...",
  "Loading CUDA 12.1 Drivers & TensorRT Core...",
  "Loading PyTorch & Transformers Inference Engine...",
  "Loading LangGraph & LlamaIndex Agent Registry...",
  "Network interfaces initialized (eth0, neural0, loopback).",
  "System ready.",
  "",
  "Tareq CLI v1.0.0 — Hybrid Linux/Windows ML Engineer Shell",
  "Type 'help' or 'man' to explore available commands.",
];

interface TerminalProps {
  onClose?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const [booting, setBooting] = useState(true);
  const [bootOutput, setBootOutput] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [accentTheme, setAccentTheme] = useState<"cyan" | "emerald" | "purple" | "amber">("cyan");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of terminal content only (without jumping page)
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, bootOutput, booting, isMatrixActive]);

  // Boot sequence animation with safe bounds
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LINES.length) {
        const nextLine = BOOT_LINES[currentLine];
        if (typeof nextLine === "string") {
          setBootOutput((prev) => [...prev, nextLine]);
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setBooting(false);
        setTimeout(() => {
          inputRef.current?.focus({ preventScroll: true });
          scrollToBottom();
        }, 50);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleContainerClick = () => {
    if (!booting) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const handleSkipBoot = () => {
    if (booting) {
      setBootOutput(BOOT_LINES);
      setBooting(false);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        scrollToBottom();
      }, 50);
    }
  };

  // Color theme mapper
  const getAccentColors = () => {
    switch (accentTheme) {
      case "emerald":
        return {
          text: "text-emerald-400",
          border: "border-emerald-500/40",
          glow: "shadow-emerald-500/20",
          prompt: "text-emerald-400",
          badge: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
        };
      case "purple":
        return {
          text: "text-purple-400",
          border: "border-purple-500/40",
          glow: "shadow-purple-500/20",
          prompt: "text-purple-400",
          badge: "bg-purple-950/60 text-purple-300 border-purple-500/30",
        };
      case "amber":
        return {
          text: "text-amber-400",
          border: "border-amber-500/40",
          glow: "shadow-amber-500/20",
          prompt: "text-amber-400",
          badge: "bg-amber-950/60 text-amber-300 border-amber-500/30",
        };
      case "cyan":
      default:
        return {
          text: "text-cyan-400",
          border: "border-cyan-500/40",
          glow: "shadow-cyan-500/20",
          prompt: "text-cyan-400",
          badge: "bg-cyan-950/60 text-cyan-300 border-cyan-500/30",
        };
    }
  };

  const themeColors = getAccentColors();

  // Command Execution Engine
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          command: "",
          output: null,
        },
      ]);
      return;
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ").trim();

    let outputNode: React.ReactNode = null;

    switch (mainCommand) {
      // 1. HELP / MAN
      case "help":
      case "man":
        outputNode = (
          <div className="space-y-3 my-2 text-xs sm:text-sm font-mono">
            <p className="text-gray-300 font-bold border-b border-purple-500/20 pb-1">
              [+] Tareq CLI — Linux & Windows Hybrid Command Manual:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Portfolio Commands */}
              <div className="p-3 rounded-xl bg-[#08021f] border border-purple-500/20 space-y-1.5">
                <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">
                  📁 Portfolio & Navigation
                </p>
                <div className="space-y-1 text-xs">
                  <div><span className="text-cyan-400 font-bold w-20 inline-block">about</span><span className="text-gray-400">→ Who is Tareq & specializations</span></div>
                  <div><span className="text-cyan-400 font-bold w-20 inline-block">skills</span><span className="text-gray-400">→ ML, NLP, AI & Tech Stack</span></div>
                  <div><span className="text-cyan-400 font-bold w-20 inline-block">projects</span><span className="text-gray-400">→ AI/ML Projects (&apos;projects 1&apos;)</span></div>
                  <div><span className="text-cyan-400 font-bold w-20 inline-block">resume</span><span className="text-gray-400">→ Download official CV</span></div>
                  <div><span className="text-cyan-400 font-bold w-20 inline-block">contact</span><span className="text-gray-400">→ Direct channels & social links</span></div>
                </div>
              </div>

              {/* Linux & Windows Utilities */}
              <div className="p-3 rounded-xl bg-[#08021f] border border-purple-500/20 space-y-1.5">
                <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                  ⚡ Linux & Windows Shell Tools
                </p>
                <div className="space-y-1 text-xs">
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">clear / cls</span><span className="text-gray-400">→ Clear terminal screen</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">ls / dir</span><span className="text-gray-400">→ List virtual files & directories</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">cat / type</span><span className="text-gray-400">→ Read file (&apos;cat about.txt&apos;)</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">pwd / cd</span><span className="text-gray-400">→ Print working directory</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">echo</span><span className="text-gray-400">→ Print text arguments</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">env / set</span><span className="text-gray-400">→ Display environment variables</span></div>
                </div>
              </div>

              {/* Hardware & Diagnostics */}
              <div className="p-3 rounded-xl bg-[#08021f] border border-purple-500/20 space-y-1.5">
                <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  🖥️ Diagnostics & Hardware
                </p>
                <div className="space-y-1 text-xs">
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">nvidia-smi</span><span className="text-gray-400">→ GPU status & vRAM usage</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">top / ps</span><span className="text-gray-400">→ Active ML inference processes</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">tasklist</span><span className="text-gray-400">→ Windows process list</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">systeminfo</span><span className="text-gray-400">→ OS & Neural Kernel specs</span></div>
                  <div><span className="text-cyan-400 font-bold w-24 inline-block">uname -a</span><span className="text-gray-400">→ Kernel release & architecture</span></div>
                </div>
              </div>

              {/* Networking & Customization */}
              <div className="p-3 rounded-xl bg-[#08021f] border border-purple-500/20 space-y-1.5">
                <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  🌐 Network, Themes & Fun
                </p>
                <div className="space-y-1 text-xs">
                  <div><span className="text-cyan-400 font-bold w-28 inline-block">ipconfig/ifconfig</span><span className="text-gray-400">→ Network adapter config</span></div>
                  <div><span className="text-cyan-400 font-bold w-28 inline-block">ping &lt;host&gt;</span><span className="text-gray-400">→ Send ICMP test packets</span></div>
                  <div><span className="text-cyan-400 font-bold w-28 inline-block">curl &lt;url&gt;</span><span className="text-gray-400">→ Inspect HTTP headers/data</span></div>
                  <div><span className="text-cyan-400 font-bold w-28 inline-block">theme &lt;name&gt;</span><span className="text-gray-400">→ cyan, emerald, purple, amber</span></div>
                  <div><span className="text-cyan-400 font-bold w-28 inline-block">history</span><span className="text-gray-400">→ View executed commands</span></div>
                  <div><span className="text-purple-400 font-bold w-28 inline-block">sudo / neofetch</span><span className="text-gray-400">→ System easter eggs</span></div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      // 2. CLEAR SCREEN (Linux & Windows)
      case "clear":
      case "cls":
        setBootOutput([]);
        setHistory([]);
        setInput("");
        return;

      // CLOSE / EXIT TERMINAL
      case "exit":
      case "quit":
      case "close":
        if (onClose) {
          onClose();
          return;
        }
        outputNode = (
          <p className="text-yellow-400 text-xs font-mono my-1">
            Workstation shell active. Click &apos;Return to Web GUI&apos; or type &apos;clear&apos;.
          </p>
        );
        break;

      // 3. DIRECTORY LISTING (Linux ls, ll & Windows dir)
      case "ls":
      case "ll":
      case "dir":
        outputNode = (
          <div className="my-2 space-y-2 font-mono text-xs">
            <p className="text-gray-400">Directory of /home/tareq/ai-workstation:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span>📁</span> <span>projects/</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span>📁</span> <span>research/</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span>📁</span> <span>models/</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-300">
                <span>📄</span> <span>about.txt</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400">
                <span>📄</span> <span>skills.json</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400">
                <span>📄</span> <span>contact.md</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span>📕</span> <span>resume.pdf</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Use &apos;cat &lt;file&gt;&apos; or &apos;type &lt;file&gt;&apos; to read file contents.
            </p>
          </div>
        );
        break;

      // 4. READ FILE (Linux cat & Windows type)
      case "cat":
      case "type":
        if (!args) {
          outputNode = (
            <p className="text-yellow-400 text-xs font-mono">
              Usage: {mainCommand} &lt;filename&gt; (e.g. &apos;{mainCommand} about.txt&apos;, &apos;{mainCommand} skills.json&apos;)
            </p>
          );
          break;
        }

        const fileName = args.toLowerCase();
        if (CLI_VIRTUAL_FILES[fileName]) {
          outputNode = (
            <div className="my-2 p-3.5 rounded-xl bg-[#08021f] border border-purple-500/25 text-gray-200 text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {CLI_VIRTUAL_FILES[fileName]}
            </div>
          );
        } else {
          outputNode = (
            <p className="text-red-400 text-xs font-mono">
              {mainCommand}: {args}: No such file or directory. Type &apos;ls&apos; or &apos;dir&apos; to view existing files.
            </p>
          );
        }
        break;

      // 5. WORKING DIRECTORY (Linux pwd & Windows cd with no args)
      case "pwd":
        outputNode = (
          <p className="text-gray-300 text-xs font-mono my-1">
            /home/tareq/ai-workstation
          </p>
        );
        break;

      case "cd":
        if (!args || args === "~" || args === "/") {
          outputNode = (
            <p className="text-gray-300 text-xs font-mono my-1">
              /home/tareq/ai-workstation
            </p>
          );
        } else {
          outputNode = (
            <p className="text-gray-400 text-xs font-mono my-1">
              Switched directory to /home/tareq/ai-workstation/{args}
            </p>
          );
        }
        break;

      // 6. ECHO
      case "echo":
        outputNode = (
          <p className="text-gray-200 text-xs font-mono my-1">
            {args || ""}
          </p>
        );
        break;

      // 7. SYSTEM INFORMATION (Windows systeminfo, Linux uname / hostname)
      case "systeminfo":
        outputNode = (
          <div className="my-2 p-3.5 rounded-xl bg-[#08021f] border border-cyan-500/30 text-xs font-mono space-y-1">
            <p className="text-cyan-300 font-bold mb-1">[+] Windows/Linux Hybrid System Configuration:</p>
            <p><span className="text-purple-400">Host Name:</span> TAREQ-ML-NODE-01</p>
            <p><span className="text-purple-400">OS Name:</span> TareqML AI Workstation v1.0.0</p>
            <p><span className="text-purple-400">OS Architecture:</span> x86_64 / TensorRT v9.2</p>
            <p><span className="text-purple-400">Processor:</span> 24 Cores Neural Hybrid CPU @ 4.80GHz</p>
            <p><span className="text-purple-400">Total Physical Memory:</span> 128,492 MB RAM</p>
            <p><span className="text-purple-400">Available Virtual Memory:</span> 104,180 MB</p>
            <p><span className="text-purple-400">ML Primary Framework:</span> PyTorch 2.3.0 + CUDA 12.1</p>
            <p><span className="text-purple-400">Status:</span> Fully Operational & Ready for Inference</p>
          </div>
        );
        break;

      case "uname":
        outputNode = (
          <p className="text-gray-200 text-xs font-mono my-1">
            Linux tareq-ml-workstation 6.8.0-tareq-ai #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
          </p>
        );
        break;

      case "hostname":
      case "whoami":
        outputNode = (
          <p className="text-cyan-300 text-xs font-mono my-1">
            {mainCommand === "hostname" ? "tareq-ml-workstation" : "tareq (Md Tareq Shah Alam — Machine Learning Engineer)"}
          </p>
        );
        break;

      // 8. GPU MONITOR (nvidia-smi)
      case "nvidia-smi":
        outputNode = (
          <div className="my-3 p-3.5 rounded-xl bg-[#050114] border border-emerald-500/40 font-mono text-[11px] sm:text-xs overflow-x-auto text-emerald-400 leading-tight">
            <pre>{`+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.1     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA RTX 4090 / A100 Tensor  On  | 00000000:01:00.0   Off |                    0 |
| 35%   48C    P2             185W / 450W |   18432MiB / 24576MiB  |    88%       Default |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      8412      C   python -m langchain_agent.py                 8192MiB |
|    0   N/A  N/A      9021      C   vllm_llama3_inference_engine                 9216MiB |
|    0   N/A  N/A      9440      C   torch_distributed_training                   1024MiB |
+-----------------------------------------------------------------------------------------+`}</pre>
          </div>
        );
        break;

      // 9. PROCESS MONITORS (Linux top, ps & Windows tasklist)
      case "top":
      case "htop":
      case "ps":
      case "tasklist":
        outputNode = (
          <div className="my-2 p-3 rounded-xl bg-[#08021f] border border-purple-500/30 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div className="flex justify-between border-b border-purple-500/20 pb-1 text-cyan-300 font-bold">
              <span>PID</span>
              <span>USER</span>
              <span>CPU%</span>
              <span>MEM%</span>
              <span>COMMAND / IMAGE NAME</span>
            </div>
            <div className="flex justify-between text-gray-300"><span>1042</span><span>tareq</span><span>14.2</span><span>18.4</span><span>python -m vllm.entrypoints.api</span></div>
            <div className="flex justify-between text-gray-300"><span>2089</span><span>tareq</span><span>32.6</span><span>12.1</span><span>torch_agentic_rag.py</span></div>
            <div className="flex justify-between text-gray-300"><span>3140</span><span>tareq</span><span>4.1</span><span>6.8</span><span>fastapi_neural_gateway</span></div>
            <div className="flex justify-between text-gray-300"><span>4291</span><span>tareq</span><span>0.4</span><span>2.2</span><span>groq_inference_client</span></div>
            <div className="flex justify-between text-gray-400"><span>5001</span><span>tareq</span><span>0.1</span><span>0.8</span><span>tareqsh (Interactive Shell)</span></div>
          </div>
        );
        break;

      // 10. NETWORK INTERFACES (Windows ipconfig & Linux ifconfig / ip a)
      case "ipconfig":
      case "ifconfig":
      case "ip":
        outputNode = (
          <div className="my-2 p-3.5 rounded-xl bg-[#08021f] border border-cyan-500/30 text-xs font-mono space-y-1.5">
            <p className="text-cyan-300 font-bold mb-1">[+] Virtual Network Adapter Configuration:</p>
            <p className="text-purple-300 font-semibold">// Ethernet Adapter eth0 (Primary WAN):</p>
            <p className="pl-4 text-gray-300">IPv4 Address . . . . . : 192.168.1.104</p>
            <p className="pl-4 text-gray-300">Subnet Mask . . . . . . : 255.255.255.0</p>
            <p className="pl-4 text-gray-300">Default Gateway . . . . : 192.168.1.1</p>

            <p className="text-purple-300 font-semibold mt-2">// Neural Tensor Adapter neural0 (Local AI Mesh):</p>
            <p className="pl-4 text-gray-300">IPv4 Address . . . . . : 10.0.0.1</p>
            <p className="pl-4 text-gray-300">Latency to Groq LPU . : 0.04 ms (High Throughput)</p>
          </div>
        );
        break;

      // 11. PING
      case "ping":
        const targetHost = args || "tareq.ai";
        outputNode = (
          <div className="my-2 space-y-1 text-xs font-mono">
            <p className="text-gray-300">PING {targetHost} (104.21.72.18) 56(84) bytes of data.</p>
            <p className="text-emerald-400">64 bytes from {targetHost}: icmp_seq=1 ttl=58 time=8.24 ms</p>
            <p className="text-emerald-400">64 bytes from {targetHost}: icmp_seq=2 ttl=58 time=7.92 ms</p>
            <p className="text-emerald-400">64 bytes from {targetHost}: icmp_seq=3 ttl=58 time=8.10 ms</p>
            <p className="text-gray-400 pt-1">--- {targetHost} ping statistics ---</p>
            <p className="text-cyan-300">3 packets transmitted, 3 received, 0% packet loss, time 2004ms</p>
          </div>
        );
        break;

      // 12. CURL / FETCH
      case "curl":
      case "fetch":
        outputNode = (
          <div className="my-2 p-3 rounded-xl bg-[#08021f] border border-cyan-500/30 text-xs font-mono space-y-1">
            <p className="text-emerald-400">HTTP/2 200 OK</p>
            <p className="text-gray-400">content-type: application/json; charset=utf-8</p>
            <p className="text-gray-400">server: tareq-neural-edge-v1</p>
            <pre className="text-cyan-300 mt-2 text-[11px] whitespace-pre-wrap">{`{
  "engineer": "Md Tareq Shah Alam",
  "status": "Available for High-Impact AI/ML Roles",
  "models": ["Autonomous RAG", "Transformer NLP", "CNN Vision"],
  "groq_enabled": true
}`}</pre>
          </div>
        );
        break;

      // 13. ENVIRONMENT VARIABLES (Linux env & Windows set)
      case "env":
      case "set":
      case "export":
        outputNode = (
          <div className="my-2 p-3 rounded-xl bg-[#08021f] border border-purple-500/20 text-xs font-mono space-y-1 text-gray-300">
            {Object.entries(CLI_ENV_VARS).map(([k, v]) => (
              <div key={k}>
                <span className="text-cyan-400">{k}</span>
                <span className="text-gray-500">=</span>
                <span className="text-purple-300">{v}</span>
              </div>
            ))}
          </div>
        );
        break;

      // 14. DATE & TIME (Linux date & Windows time)
      case "date":
      case "time":
        outputNode = (
          <p className="text-cyan-300 text-xs font-mono my-1">
            {new Date().toUTCString()} (Standard Workstation Time)
          </p>
        );
        break;

      // 15. VERSION (Windows ver / version)
      case "ver":
      case "version":
        outputNode = (
          <p className="text-gray-200 text-xs font-mono my-1">
            Tareq CLI OS [Version 1.0.0.2026 - Hybrid Linux/Windows Kernel 6.8]
          </p>
        );
        break;

      // 16. HISTORY (Linux history & Windows doskey)
      case "history":
      case "doskey":
        outputNode = (
          <div className="my-2 space-y-0.5 text-xs font-mono text-gray-300">
            {commandHistory.map((cmd, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-gray-500 w-6 text-right">{idx + 1}</span>
                <span className="text-cyan-300">{cmd}</span>
              </div>
            ))}
          </div>
        );
        break;

      // 17. THEME & COLOR (Windows color & Theme command)
      case "theme":
      case "color":
        const targetTheme = args.toLowerCase();
        if (targetTheme === "emerald" || targetTheme === "green" || targetTheme === "0a") {
          setAccentTheme("emerald");
          outputNode = <p className="text-emerald-400 text-xs font-mono my-1">Switched terminal theme to Emerald / Matrix Green (color 0a).</p>;
        } else if (targetTheme === "purple" || targetTheme === "0d") {
          setAccentTheme("purple");
          outputNode = <p className="text-purple-400 text-xs font-mono my-1">Switched terminal theme to Cosmic Purple (color 0d).</p>;
        } else if (targetTheme === "amber" || targetTheme === "06") {
          setAccentTheme("amber");
          outputNode = <p className="text-amber-400 text-xs font-mono my-1">Switched terminal theme to Solar Amber (color 06).</p>;
        } else if (targetTheme === "cyan" || targetTheme === "0b") {
          setAccentTheme("cyan");
          outputNode = <p className="text-cyan-400 text-xs font-mono my-1">Switched terminal theme to Default Cyber Cyan (color 0b).</p>;
        } else {
          outputNode = (
            <p className="text-yellow-400 text-xs font-mono my-1">
              Available themes: &apos;theme cyan&apos;, &apos;theme emerald&apos;, &apos;theme purple&apos;, &apos;theme amber&apos; (or Windows &apos;color 0a&apos;).
            </p>
          );
        }
        break;

      // PORTFOLIO COMMANDS
      case "about":
        outputNode = (
          <div className="space-y-3 my-3 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-purple-500/20 pb-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {CLI_PROFILE.name}
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                {CLI_PROFILE.role}
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
              {CLI_PROFILE.bio}
            </p>
            <div>
              <p className="text-xs font-mono text-purple-300 font-semibold mb-1">
                Core Specializations:
              </p>
              <ul className="space-y-1 text-xs text-gray-300">
                {CLI_PROFILE.focus.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-cyan-400">▹</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-gray-400 pt-1">
              📍 <span>{CLI_PROFILE.location}</span>
            </div>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="space-y-4 my-3">
            <p className="text-xs text-gray-400 font-mono">
              [+] Machine Learning, AI & Engineering Technical Stack:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLI_SKILLS.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#08021f]/80 border border-purple-500/25"
                >
                  <h4 className="text-xs font-mono font-bold text-cyan-300 mb-2 uppercase tracking-wide">
                    // {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-[#130538] border border-purple-500/30 text-purple-200 text-xs font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "projects":
        if (args === "1" || args === "2" || args === "3") {
          const pId = parseInt(args);
          const p = CLI_PROJECTS.find((item) => item.id === pId);
          if (p) {
            outputNode = (
              <div className="my-3 p-4 rounded-xl bg-[#08021f]/90 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    [{p.id.toString().padStart(2, "0")}] {p.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 font-mono">
                    Featured Project
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {p.description}
                </p>
                <div>
                  <span className="text-xs text-gray-400 font-mono">Tech Stack: </span>
                  <span className="text-xs text-purple-300 font-mono font-semibold">
                    {p.technologies.join(" • ")}
                  </span>
                </div>
                <div className="flex gap-4 pt-2 border-t border-purple-500/20 text-xs">
                  <a
                    href={p.liveUrl || p.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1 font-mono"
                  >
                    <span>View Project Article / Case Study ↗</span>
                  </a>
                </div>
              </div>
            );
            break;
          }
        }

        outputNode = (
          <div className="space-y-3 my-3">
            <p className="text-xs text-gray-400 font-mono">
              [+] AI & Machine Learning Projects Registry (Type &apos;projects 1&apos;, &apos;projects 2&apos; for details):
            </p>
            <div className="space-y-3">
              {CLI_PROJECTS.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#08021f]/70 border border-purple-500/25 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold font-mono text-xs">
                      [{p.id.toString().padStart(2, "0")}]
                    </span>
                    <span className="text-white font-bold text-sm">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono ml-auto hidden sm:inline">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-purple-950/60 text-[10px] text-purple-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={p.liveUrl || p.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline underline-offset-2"
                    >
                      Open Link ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "resume":
        outputNode = (
          <div className="my-3 space-y-2.5 p-4 rounded-xl bg-[#08021f] border border-cyan-500/30">
            <p className="text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="animate-spin">⚙️</span>
              <span>Preparing Md Tareq Shah Alam&apos;s Curriculum Vitae...</span>
            </p>
            <p className="text-xs text-gray-300">
              Resume packaging complete. Click below to view and download:
            </p>
            <div className="pt-2">
              <a
                href="https://medium.com/@tareqshahalam"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-500/30 transition transform hover:scale-105"
              >
                <span>[ 📥 Download / View Tareq Resume ]</span>
              </a>
            </div>
          </div>
        );
        break;

      case "contact":
        outputNode = (
          <div className="my-3 p-4 rounded-xl bg-[#08021f] border border-purple-500/30 space-y-3 font-mono text-xs sm:text-sm">
            <p className="text-cyan-300 font-bold">
              // Direct Communications & Social Channels:
            </p>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-purple-400 font-semibold w-24">Email:</span>
                <a
                  href={`mailto:${CLI_PROFILE.contact.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {CLI_PROFILE.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400 font-semibold w-24">Medium:</span>
                <a
                  href={CLI_PROFILE.contact.medium}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-cyan-400 hover:underline"
                >
                  medium.com/@tareqshahalam
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400 font-semibold w-24">GitHub:</span>
                <a
                  href={CLI_PROFILE.contact.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-cyan-400 hover:underline"
                >
                  github.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400 font-semibold w-24">LinkedIn:</span>
                <a
                  href={CLI_PROFILE.contact.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-cyan-400 hover:underline"
                >
                  linkedin.com
                </a>
              </div>
            </div>
          </div>
        );
        break;

      case "sudo":
        outputNode = (
          <div className="my-2 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs sm:text-sm">
            <p>Permission denied: you are not root... yet.</p>
            <p className="text-gray-400 mt-1">
              Try &apos;contact&apos; to become my collaborator instead.
            </p>
          </div>
        );
        break;

      case "neofetch":
        outputNode = (
          <div className="my-3 p-4 rounded-xl bg-[#06011c] border border-cyan-500/30 flex flex-col sm:flex-row gap-6 font-mono text-xs">
            <pre className="text-cyan-400 leading-none select-none text-[10px] sm:text-xs">
{`   /\\_/\\  
  ( o.o ) 
   > ^ <  
  [TAREQ] 
  [ML/AI] `}
            </pre>
            <div className="space-y-1 text-gray-300">
              <p className="text-purple-300 font-bold">
                tareq@hybrid-workstation-v1.0
              </p>
              <p className="text-gray-500">---------------------------------</p>
              <p><span className="text-cyan-400">OS:</span> Hybrid Linux/Windows Kernel 6.8</p>
              <p><span className="text-cyan-400">Host:</span> Neural Tensor Core v2.4</p>
              <p><span className="text-cyan-400">Kernel:</span> 6.8.0-tareq-ml-ai</p>
              <p><span className="text-cyan-400">Uptime:</span> 99.98% Model Availability</p>
              <p><span className="text-cyan-400">Packages:</span> PyTorch, Transformers, LangChain, LlamaIndex</p>
              <p><span className="text-cyan-400">Shell:</span> tareqsh (bash & cmd)</p>
              <p><span className="text-cyan-400">Memory:</span> 128GB Unified Tensor RAM</p>
            </div>
          </div>
        );
        break;

      case "matrix":
        setIsMatrixActive(true);
        setTimeout(() => setIsMatrixActive(false), 2400);
        outputNode = (
          <p className="text-green-400 font-mono text-xs my-1 animate-pulse">
            [+] Matrix stream protocol executed. Returning to shell...
          </p>
        );
        break;

      case "ml":
        outputNode = (
          <p className="text-cyan-300 font-mono text-xs my-2">
            🧠 Machine Learning modules loaded: PyTorch, Scikit-learn, CNNs, CUDA Acceleration active.
          </p>
        );
        break;

      case "nlp":
        outputNode = (
          <p className="text-purple-300 font-mono text-xs my-2">
            📖 NLP module ready: Domain Tokenizers initialized, Vector Embedding models online.
          </p>
        );
        break;

      case "transformer":
        outputNode = (
          <p className="text-cyan-300 font-mono text-xs my-2">
            ⚡ Transformer Architecture: Multi-Head Self-Attention, Rotary Positional Embeddings (RoPE), KV-cache optimization enabled.
          </p>
        );
        break;

      default:
        if (CLI_WITTY_RESPONSES[trimmed.toLowerCase()]) {
          outputNode = (
            <div className="my-2 text-yellow-300/90 font-mono text-xs whitespace-pre-line">
              {CLI_WITTY_RESPONSES[trimmed.toLowerCase()]}
            </div>
          );
        } else {
          const randomIndex = Math.floor(
            Math.random() * CLI_DEFAULT_COMMAND_NOT_FOUND.length
          );
          const fallbackFn = CLI_DEFAULT_COMMAND_NOT_FOUND[randomIndex];
          outputNode = (
            <div className="my-2 text-red-400 font-mono text-xs whitespace-pre-line">
              {fallbackFn(trimmed)}
            </div>
          );
        }
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: outputNode,
      },
    ]);
    setInput("");
  };

  // Keyboard navigation & Shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete on Tab
    if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;
      const match = AUTOCOMPLETE_COMMANDS.find((cmd) =>
        cmd.startsWith(current)
      );
      if (match) {
        setInput(match);
      }
      return;
    }

    // Command History Navigation (Arrow Up / Down)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
      return;
    }

    // Ctrl+L (Clear screen)
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setBootOutput([]);
      setHistory([]);
      setInput("");
      return;
    }

    // Ctrl+C (Cancel current line)
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          command: `${input}^C`,
          output: null,
        },
      ]);
      setInput("");
      return;
    }

    // Execute on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      suppressHydrationWarning
      className={`w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-[#060214]/95 border ${themeColors.border} backdrop-blur-2xl shadow-2xl shadow-[#2A0E61]/70 overflow-hidden font-mono flex flex-col relative z-20 min-h-[580px] max-h-[85vh]`}
    >
      {/* Matrix Stream Glitch Overlay */}
      {isMatrixActive && (
        <div className="absolute inset-0 bg-black/90 z-50 p-6 font-mono text-green-400 text-xs overflow-hidden flex flex-col justify-around select-none pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="animate-pulse tracking-widest truncate">
              {`010101 TAREQ_ML_MODEL_TENSOR_WEIGHT_MATRIX_${i} -> 110010101010010101011100101010101010101010101010`}
            </div>
          ))}
        </div>
      )}

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0a0324] border-b border-purple-500/25 select-none relative z-30">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose) onClose();
            }}
            title={onClose ? "Close Terminal" : "Linux/macOS Window Control"}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 border border-red-600 shadow-sm flex items-center justify-center text-[9px] text-black font-bold opacity-80 hover:opacity-100 transition cursor-pointer"
          >
            ✕
          </button>
          <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 border border-yellow-600 shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-green-500/90 border border-green-600 shadow-sm" />
        </div>

        {/* Center Title */}
        <div className="text-xs font-semibold text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>tareq@ml-workstation:~ (bash & cmd)</span>
        </div>

        {/* Right shortcut / GUI back link */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {onClose ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white transition cursor-pointer font-mono font-semibold"
            >
              <span>✕ Close Terminal</span>
            </button>
          ) : (
            <Link
              href="/"
              className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-cyan-300 hover:text-white transition"
            >
              ← Return to Web GUI
            </Link>
          )}
        </div>
      </div>

      {/* Terminal Content Area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-3 text-xs sm:text-sm"
      >
        {/* Boot sequence */}
        <div className="space-y-1 text-gray-300 leading-relaxed">
          {bootOutput.map((line, idx) => (
            <div
              key={idx}
              className={
                line && typeof line === "string" && line.startsWith("Tareq CLI")
                  ? "text-cyan-300 font-bold"
                  : ""
              }
            >
              {line}
            </div>
          ))}
          {booting && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs mt-2">
              <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
              <button
                onClick={handleSkipBoot}
                className="text-[10px] text-gray-500 hover:text-gray-300 underline"
              >
                [Click to skip boot animation]
              </button>
            </div>
          )}
        </div>

        {/* Command History Outputs */}
        {!booting &&
          history.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <div className="flex items-center gap-2 text-gray-200">
                <span className={`${themeColors.prompt} font-bold select-none`}>
                  tareq@ml:~$
                </span>
                <span className="text-white font-medium">{entry.command}</span>
              </div>
              {entry.output && (
                <div className="pl-0 sm:pl-2">{entry.output}</div>
              )}
            </div>
          ))}

        {/* Current Active Input Prompt */}
        {!booting && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCommand(input);
            }}
            className="flex items-center gap-2 text-gray-200 pt-1"
          >
            <span className={`${themeColors.prompt} font-bold select-none whitespace-nowrap`}>
              tareq@ml:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs sm:text-sm caret-cyan-400"
            />
          </form>
        )}
      </div>

      {/* Mobile Friendly Command Action Chips */}
      {!booting && (
        <div className="px-4 py-2.5 bg-[#040114] border-t border-purple-500/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
            Quick Run:
          </span>
          {["help", "cls", "dir", "ls", "about", "skills", "projects", "nvidia-smi", "systeminfo", "contact"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-[#110438] hover:bg-[#1f095e] border border-purple-500/30 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 font-mono whitespace-nowrap transition cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
