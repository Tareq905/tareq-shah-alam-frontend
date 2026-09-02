"use client";

import { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import { FormattedMarkdown } from "@/components/sub/formatted-markdown";

interface AttachedFile {
  name: string;
  type: "image" | "doc";
  dataUrl?: string; // for image base64
  textContent?: string; // for doc text content
  sizeStr: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
  docName?: string;
}

const ABOUT_SUGGESTIONS = [
  "What are Tareq's core ML & AI skills?",
  "Tell me about his NLP & LangChain experience",
  "How can I contact Tareq or read his blog?",
  "What frameworks does Tareq build with?",
];

const RANDOM_SUGGESTIONS = [
  "Explain Transformers vs CNNs in simple terms",
  "What is the difference between LangChain and LlamaIndex?",
  "How does fine-tuning work in Deep Learning?",
  "Explain RAG (Retrieval-Augmented Generation)",
];

interface AiChatInterfaceProps {
  onLock: () => void;
}

export const AiChatInterface = ({ onLock }: AiChatInterfaceProps) => {
  const [mode, setMode] = useState<"about" | "random">("about");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "👋 Welcome! I am **Tareq's AI Assistant**, powered by **Groq LLM**. Ask me anything about **Md Tareq Shah Alam's** Machine Learning expertise, NLP projects, or switch to **Random Chat** to upload **Images 🖼️ & Documents 📄** for live AI analysis!",
      timestamp: "Online",
    },
  ]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom inside the chat container ONLY (prevents page jump)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, attachment]);

  // Handle file selection (Image or Document)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = `${sizeInKb} KB`;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          name: file.name,
          type: "image",
          dataUrl: event.target?.result as string,
          sizeStr,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Document file (.pdf, .txt, .csv, .json, .md, .py, code)
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAttachment({
          name: file.name,
          type: "doc",
          textContent: text,
          sizeStr,
        });
      };
      reader.readAsText(file);
    }

    // Reset input value so same file can be re-selected if needed
    e.target.value = "";
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if ((!text.trim() && !attachment) || isLoading) return;

    const currentAttachment = attachment;

    // Build user message for UI display
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim() || (currentAttachment?.type === "image" ? "Analyze this attached image" : `Analyze ${currentAttachment?.name}`),
      image: currentAttachment?.type === "image" ? currentAttachment.dataUrl : undefined,
      docName: currentAttachment?.type === "doc" ? currentAttachment.name : undefined,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setAttachment(null);
    setIsLoading(true);

    try {
      // Prepare backend payload with document context if document attached
      const payloadMessages = updatedMessages.map((m) => {
        let contentWithDoc = m.content;
        if (m.docName && currentAttachment?.textContent && m.id === userMessage.id) {
          contentWithDoc = `${m.content}\n\n📄 [Attached Document: ${m.docName}]\n\`\`\`\n${currentAttachment.textContent.slice(0, 15000)}\n\`\`\``;
        }
        return {
          role: m.role,
          content: contentWithDoc,
          image: m.image,
        };
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          mode,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I didn't receive a valid answer. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "⚠️ Network error. Please ensure your dev server is running and Groq API key is valid.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: "about" | "random") => {
    if (newMode === mode) return;
    setMode(newMode);
    setAttachment(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          newMode === "about"
            ? "👤 Switched to **About Tareq** mode. Ask anything about Md Tareq Shah Alam's ML/AI skills, projects, and background!"
            : "⚡ Switched to **Random / General AI Chat** powered by **Groq**. You can upload **Images 🖼️ & Documents 📄** using the 📎 button below!",
        timestamp: "Online",
      },
    ]);
  };

  const suggestions = mode === "about" ? ABOUT_SUGGESTIONS : RANDOM_SUGGESTIONS;

  return (
    <div className="w-full max-w-4xl flex flex-col rounded-3xl bg-[#090224]/85 border border-[#7042f8]/50 backdrop-blur-2xl shadow-2xl shadow-[#2A0E61]/70 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#06011a]/80 gap-3">
        {/* Left: Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#0d0430] p-1 rounded-2xl border border-purple-500/30">
          <button
            onClick={() => handleModeChange("about")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
              mode === "about"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>👤</span>
            <span>About Tareq</span>
          </button>

          <button
            onClick={() => handleModeChange("random")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
              mode === "random"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>⚡</span>
            <span>Random AI Chat</span>
          </button>
        </div>

        {/* Right: Engine badge + Lock button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              Groq • {mode === "about" ? "GPT-OSS 20B" : "GPT-OSS 120B"}
            </span>
          </div>

          <button
            onClick={onLock}
            className="text-xs font-medium text-gray-400 hover:text-cyan-300 border border-gray-700 hover:border-cyan-400/50 bg-[#030014]/80 px-3 py-1.5 rounded-full transition duration-200"
          >
            🔒 Lock Vault
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 sm:p-6 min-h-[350px] max-h-[440px] sm:max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-0.5 flex-shrink-0 mt-1 shadow-lg shadow-purple-500/30 flex items-center justify-center text-xs">
                <span className="animate-pulse">✨</span>
              </div>
            )}

            <div
              className={`max-w-[92%] sm:max-w-[85%] px-5 py-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-tr-none shadow-lg shadow-purple-900/40 border border-purple-400/20"
                  : "bg-[#0b0326]/90 border border-purple-500/30 text-gray-200 rounded-tl-none shadow-2xl backdrop-blur-xl"
              }`}
            >
              {/* If user uploaded an image */}
              {msg.image && (
                <div className="mb-2.5 rounded-2xl overflow-hidden border border-purple-300/30 shadow-md">
                  <img
                    src={msg.image}
                    alt="Attached preview"
                    className="max-h-48 w-auto object-cover rounded-xl"
                  />
                </div>
              )}

              {/* If user uploaded a document */}
              {msg.docName && (
                <div className="mb-2 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-400/40 text-[11px] font-mono text-purple-200 flex items-center gap-1.5 w-fit">
                  <span>📄</span>
                  <span className="font-semibold">{msg.docName}</span>
                </div>
              )}

              {msg.role === "assistant" ? (
                <FormattedMarkdown content={msg.content} />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-white font-medium">
                  {msg.content}
                </div>
              )}

              <div
                className={`text-[10px] mt-2 flex items-center gap-2 ${
                  msg.role === "user" ? "text-purple-200 justify-end" : "text-gray-400 justify-between"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="hover:text-cyan-300 transition text-[10px] opacity-70 hover:opacity-100 flex items-center gap-1 cursor-pointer"
                    title="Copy response"
                  >
                    <span>📋 Copy</span>
                  </button>
                )}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-400/40 p-0.5 flex-shrink-0 mt-1 flex items-center justify-center text-xs text-purple-200 font-bold shadow-md">
                You
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-0.5 flex-shrink-0 flex items-center justify-center text-xs shadow-lg shadow-purple-500/30">
              <span className="animate-spin text-[10px]">✨</span>
            </div>
            <div className="px-5 py-4 rounded-3xl bg-[#0b0326]/90 border border-purple-500/30 text-gray-300 rounded-tl-none flex items-center gap-2.5 shadow-xl backdrop-blur-xl">
              <span className="text-xs text-cyan-300 font-medium">
                {attachment?.type === "image"
                  ? "Vision Model analyzing image"
                  : mode === "about"
                  ? "GPT-OSS 20B is thinking"
                  : "GPT-OSS 120B is reasoning"}
              </span>
              <div className="flex gap-1.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 sm:px-6 py-2 border-t border-purple-500/10 bg-[#07011f]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium">
          💡 Suggestions:
        </span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sug)}
            disabled={isLoading}
            className="px-2.5 py-1 text-[11px] rounded-full bg-[#12053d] border border-purple-500/30 hover:border-cyan-400 hover:text-cyan-300 text-gray-300 whitespace-nowrap transition duration-200 flex-shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Attachment Preview Bar (only in Random Chat mode when file selected) */}
      {mode === "random" && attachment && (
        <div className="px-4 py-2 bg-[#090226] border-t border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-gray-200">
            {attachment.type === "image" ? (
              <img
                src={attachment.dataUrl}
                alt="preview"
                className="w-9 h-9 object-cover rounded-lg border border-cyan-400/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-base">
                📄
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-cyan-300 truncate max-w-[200px] sm:max-w-[320px]">
                {attachment.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {attachment.type === "image" ? "Image attached" : "Document ready to parse"} • {attachment.sizeStr}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 flex items-center justify-center text-xs transition cursor-pointer"
            title="Remove attachment"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-[#06011a]/95 border-t border-purple-500/20 flex items-center gap-2 sm:gap-3"
      >
        {/* Hidden File Input (active only in Random Chat) */}
        {mode === "random" && (
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.csv,.json,.md,.py,.js,.ts,.sql,.html,.css"
            className="hidden"
          />
        )}

        {/* Upload Attachment Button (Visible ONLY in Random Chat) */}
        {mode === "random" && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image or Document"
            className="p-2.5 rounded-2xl bg-[#0e0333] hover:bg-[#18084a] border border-purple-500/40 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 transition shadow-md flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <span className="text-sm">📎</span>
          </button>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "about"
              ? "Ask anything about Md Tareq Shah Alam..."
              : attachment
              ? `Ask a question about ${attachment.name}...`
              : "Ask anything, or attach Image / Document 📎..."
          }
          className="flex-1 bg-[#0c032e] border border-purple-500/40 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
        />

        <button
          type="submit"
          disabled={(!input.trim() && !attachment) || isLoading}
          className="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span>Send</span>
          <span>⚡</span>
        </button>
      </form>
    </div>
  );
};
