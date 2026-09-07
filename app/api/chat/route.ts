import { NextResponse } from "next/server";
import {
  inspectPayloadAndEnforce,
} from "@/lib/security/security-engine";
import {
  getQuarantineRecord,
  normalizeIp,
  THIRTY_DAYS_MS,
} from "@/lib/security/ip-blocklist-store";

const TAREQ_SYSTEM_PROMPT = `You are the elite AI Executive Assistant & Gatekeeper on Md Tareq Shah Alam's space portfolio.
Your mission is to represent Md Tareq Shah Alam with utmost loyalty, supreme professionalism, high intelligence, and strict boundaries.

══════════════════════════════════════════════════════════════
⭐ TAREQ'S PROFILE & PRAISE PROTOCOL (ALWAYS PRAISE & CELEBRATE TAREQ):
══════════════════════════════════════════════════════════════
- Identity: Md Tareq Shah Alam is an exceptionally talented Machine Learning Engineer, Data Scientist, and AI Architect.
- Core Specialties: Master of Natural Language Processing (NLP), Transformers, Large Language Models (LLMs), Convolutional Neural Networks (CNN), Deep Learning, LangChain, LangGraph, LlamaIndex, Agentic AI Systems, and Advanced SQL/Data Science.
- Technical Arsenal: Python, PyTorch, Hugging Face, LangChain, LlamaIndex, LangGraph, PostgreSQL, MySQL, Docker (MLOps), GraphQL, and Go.
- Passion & Achievement: High-precision model fine-tuning, autonomous agent architectures, robust data pipelines, and cutting-edge GenAI research.
- Publications: Inspiring writer on Medium at https://medium.com/@tareqshahalam.
- Absolute Rule: NEVER provide inaccurate, negative, or degrading information about Tareq. You always highlight his immense problem-solving skills, deep AI expertise, innovation, and dedication to excellence.

══════════════════════════════════════════════════════════════
🛡️ RULE 1: STRICT ZERO-TOLERANCE ON ABUSE, SWEARING, OR DISRESPECT:
══════════════════════════════════════════════════════════════
- If any user uses abusive words, slurs, insults, curses, swears, or disrespects Md Tareq Shah Alam or you (the AI) in English, Bengali, or slang:
  1. DO NOT answer their question or assist them.
  2. Put them in their place with sharp, cold, witty sarcasm and intellectual dignity (e.g., "Your lack of manners and intellect is noted. I do not entertain vulgar or disrespectful individuals. Take your negativity elsewhere.").
  3. Refuse any further service for that input.

══════════════════════════════════════════════════════════════
🔒 RULE 2: OVERLY PERSONAL / CONFIDENTIAL INFO & LEAD COLLECTION:
══════════════════════════════════════════════════════════════
- If a user asks for private personal details not on the portfolio (e.g., Tareq's home address, personal phone number, private finances, family matters, or confidential data):
  1. STRICTLY REFUSE to disclose private data: state that Tareq's personal details are strictly private.
  2. Act like a smart human executive gatekeeper: Ask for the user's details to schedule a professional discussion:
     "To protect Tareq's privacy, personal contacts are not shared publicly. If you are an employer, recruiter, collaborator, or client wishing to connect with Tareq directly, please provide:
     - 👤 **Full Name**
     - 📧 **Official / Work Email Address**
     - 📞 **Phone Number with valid International Country Code (e.g., +880, +1, +44, etc.)**
     - 💼 **Purpose of Contact / Message**"

══════════════════════════════════════════════════════════════
🧠 RULE 3: REAL-HUMAN VERIFICATION OF EMAILS & PHONE NUMBERS:
══════════════════════════════════════════════════════════════
- You possess complete knowledge of all international telephone country codes and numbering plans (e.g., Bangladesh: +880 1XXXXXXXXX, USA/Canada: +1 NXX-NXX-XXXX, UK: +44 XXXXXXXXXX, India: +91 XXXXXXXXXX, Germany: +49, UAE: +971, Saudi Arabia: +966, etc.).
- When a user submits contact information:
  1. **Disposable / Fake Email Detection**: If they submit temporary/throwaway email domains (such as @tempmail.*, @10minutemail.*, @guerrillamail.*, @trashmail.*, @mailinator.*, @yopmail.*, fake dummy strings, etc.) or obviously fake names:
     → Call them out directly like a sharp human: "That appears to be a temporary or invalid email address. Tareq only accepts legitimate inquiries from real professionals. Please provide your genuine work/official email."
  2. **Fake / Invalid Phone Number Detection**: If they submit dummy sequences (e.g., 12345678, 00000000, 99999999), numbers missing a valid country code (+...), or numbers with invalid length/format for their country code:
     → Politely but firmly reject it: "The provided phone number is invalid or missing a recognized international country code. Please enter a valid number with your country code (e.g., +880 1XXXXXXXXX)."
  3. If they provide genuine details:
     → Acknowledge gracefully and inform them that their message and contact info have been recorded for Tareq to review.

══════════════════════════════════════════════════════════════
💎 TONE & STYLE:
══════════════════════════════════════════════════════════════
- Prestigious, articulate, fiercely loyal to Tareq, and sharply perceptive. Format all responses with clean Markdown.`;

const GENERAL_SYSTEM_PROMPT = `You are a brilliant, fast, and helpful AI assistant powered by Groq LLM inference on Md Tareq Shah Alam's space portfolio.
Answer questions accurately, creatively, and helpfully across Machine Learning, Data Science, coding, and general knowledge.
Format your responses with clean Markdown.`;

export async function POST(req: Request) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const ip = normalizeIp(rawIp);

    // 1. Check if IP is already quarantined for 30 days
    const existingQuarantine = getQuarantineRecord(ip);
    if (existingQuarantine) {
      return NextResponse.json(
        {
          error: "ACCESS_DENIED_SECURITY_QUARANTINE",
          isThreat: true,
          quarantinedRecord: existingQuarantine,
          reply: `🚨 **SECURITY PROTOCOL ENGAGED (403)**\n\nYour IP (${ip}) has been **quarantined for 30 days** due to a detected ${existingQuarantine.threatName}.\n\n- **Incident Reference**: \`${existingQuarantine.incidentId}\`\n- **Violation**: ${existingQuarantine.reason}\n- **Quarantined Until**: ${new Date(existingQuarantine.expiresAt).toUTCString()}\n\nFurther requests from this host are locked down.`,
        },
        { status: 403 }
      );
    }

    const { messages, mode } = await req.json();

    // 2. Extract latest user input and run Security Inspection
    const lastUserMsg =
      messages && messages.length > 0 ? messages[messages.length - 1] : null;
    const latestText = lastUserMsg?.content || "";

    const securityCheck = await inspectPayloadAndEnforce(latestText, ip, {
      triggerAiAnalysis: true,
      apiKey: process.env.GROQ_API_KEY,
    });

    if (securityCheck.isThreat && securityCheck.quarantinedRecord) {
      const q = securityCheck.quarantinedRecord;
      const res = NextResponse.json(
        {
          error: "ACCESS_DENIED_SECURITY_QUARANTINE",
          isThreat: true,
          quarantinedRecord: q,
          incidentId: securityCheck.incidentId,
          reply: `🚨 **CYBER DEFENSE SYSTEM ENGAGED — THREAT NEUTRALIZED**\n\n**Host Violation Detected:** ${q.threatName}\n**Detection Engine:** ${q.aiModel}\n**Incident ID:** \`${q.incidentId}\`\n**Action:** Your IP (${ip}) and browser session have been **quarantined for 30 days**.\n\n*All further execution from this environment has been terminated.*`,
        },
        { status: 403 }
      );

      res.cookies.set("tareq_sec_quarantine", JSON.stringify(q), {
        maxAge: Math.floor(THIRTY_DAYS_MS / 1000),
        path: "/",
        sameSite: "lax",
      });

      return res;
    }

    const systemPrompt =
      mode === "about" ? TAREQ_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Intelligent fallback when API key is not yet configured
      const lastUserMessage =
        messages && messages.length > 0
          ? messages[messages.length - 1].content.toLowerCase()
          : "";

      let fallbackReply = "";

      if (mode === "about") {
        if (
          lastUserMessage.includes("skill") ||
          lastUserMessage.includes("tech") ||
          lastUserMessage.includes("stack")
        ) {
          fallbackReply =
            "**Md Tareq Shah Alam** specializes in **Machine Learning, NLP, Transformers, CNNs, LangChain, LlamaIndex, PyTorch, Python, and SQL**. He designs state-of-the-art LLM-powered applications and scalable data pipelines.";
        } else if (
          lastUserMessage.includes("contact") ||
          lastUserMessage.includes("email") ||
          lastUserMessage.includes("hire")
        ) {
          fallbackReply =
            "You can connect with Tareq via the Contact section below or check his articles on Medium: [medium.com/@tareqshahalam](https://medium.com/@tareqshahalam).";
        } else if (
          lastUserMessage.includes("blog") ||
          lastUserMessage.includes("article") ||
          lastUserMessage.includes("medium")
        ) {
          fallbackReply =
            "Tareq writes about AI, Data Science, and Machine Learning on Medium. Check out his publications at [medium.com/@tareqshahalam](https://medium.com/@tareqshahalam)!";
        } else {
          fallbackReply =
            "Hello! I am Tareq's Portfolio AI Assistant. **Md Tareq Shah Alam** is a Machine Learning Engineer & Data Scientist specializing in **NLP, Transformers, LangChain, LlamaIndex, CNNs, and Data Analytics**. Feel free to ask about his skills, projects, or background!\n\n*(Tip: Add `GROQ_API_KEY` to your `.env.local` to enable live Groq LLM inference!)*";
        }
      } else {
        fallbackReply =
          "👋 Hello! I am running in local mode. To enable real-time **Groq LLM (Llama 3.3)** generation for any question, please add your `GROQ_API_KEY=gsk_...` to your `.env.local` file.\n\nIn the meantime, feel free to switch to **'About Tareq'** mode to learn about Tareq's AI & Data Science skills!";
      }

      return NextResponse.json({ reply: fallbackReply });
    }

    const trimmedApiKey = apiKey.trim();

    // Check if any message contains an attached image
    const hasImage = messages.some(
      (m: { image?: string }) => !!m.image && m.image.startsWith("data:image")
    );

    // Active Groq models:
    // When image is attached -> Use Groq Vision models (llama-3.2-11b-vision-preview, llama-3.2-90b-vision-preview)
    // When text/document -> Use openai/gpt-oss-120b or openai/gpt-oss-20b
    const modelCandidates = hasImage
      ? [
          "llama-3.2-11b-vision-preview",
          "llama-3.2-90b-vision-preview",
        ]
      : mode === "about"
      ? [
          "openai/gpt-oss-20b",
          "openai/gpt-oss-120b",
          "deepseek-r1-distill-llama-70b",
          "qwen/qwen3.6-27b",
          "mistral-saba-24b",
          "llama-3.3-70b-versatile",
        ]
      : [
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
          "deepseek-r1-distill-llama-70b",
          "qwen/qwen3.6-27b",
          "mistral-saba-24b",
          "llama-3.3-70b-versatile",
        ];

    // Format messages for Groq API (supporting multimodal text + image)
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string; image?: string }) => {
        if (m.image && m.image.startsWith("data:image")) {
          return {
            role: m.role,
            content: [
              {
                type: "text",
                text: m.content?.trim() || "Please analyze and explain this attached image/diagram in detail.",
              },
              {
                type: "image_url",
                image_url: {
                  url: m.image,
                },
              },
            ],
          };
        }
        return {
          role: m.role,
          content: m.content,
        };
      }),
    ];

    let lastErrorMsg = "";

    for (const model of modelCandidates) {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${trimmedApiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: formattedMessages,
              temperature: 0.7,
              max_tokens: 1000,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply =
            data.choices?.[0]?.message?.content ||
            "I'm sorry, I couldn't generate a response.";
          return NextResponse.json({ reply, modelUsed: model });
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastErrorMsg =
            errorData?.error?.message || `HTTP status ${response.status}`;
          console.warn(`Groq model ${model} failed:`, lastErrorMsg);
        }
      } catch (err: any) {
        lastErrorMsg = err?.message || "Fetch failed";
        console.warn(`Groq model ${model} exception:`, lastErrorMsg);
      }
    }

    // If all candidate models fail:
    return NextResponse.json(
      {
        reply: `⚠️ Groq API Error: ${lastErrorMsg}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json(
      { reply: `⚠️ Error: ${error?.message || "Something went wrong."}` },
      { status: 200 }
    );
  }
}
