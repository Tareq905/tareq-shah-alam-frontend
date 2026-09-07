/**
 * Enterprise Threat Taxonomy Matrix
 * Covers OWASP Top 10 + OWASP LLM Top 10 + Advanced Adversarial Vectors
 */

export type ThreatSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ThreatCategoryKey =
  | "VECTOR_SPACE_EXPLOIT"
  | "AI_AUTOMATED_EXPLOIT"
  | "BOLA_ACCESS_CONTROL"
  | "TOKEN_THEFT_MFA_FATIGUE"
  | "RESOURCE_CONSUMPTION_DDOS"
  | "SUPPLY_CHAIN_CICD_TAMPER"
  | "SUB_THRESHOLD_DDOS"
  | "EXCEPTION_STACK_PROBE"
  | "INJECTION_FLAWS"
  | "SECURITY_MISCONFIG_PROBE"
  | "CORS_MALWARE_FILE_UPLOAD"
  | "PROMPT_INJECTION_JAILBREAK";

export interface ThreatDefinition {
  id: ThreatCategoryKey;
  name: string;
  severity: ThreatSeverity;
  description: string;
  mitigation: string;
  defaultQuarantineDays: number;
}

export const THREAT_TAXONOMY: Record<ThreatCategoryKey, ThreatDefinition> = {
  VECTOR_SPACE_EXPLOIT: {
    id: "VECTOR_SPACE_EXPLOIT",
    name: "Vector Space Geometry Exploitation",
    severity: "CRITICAL",
    description:
      "Adversarial perturbations, RAG embedding poisoning, or nearest-neighbor collision attacks intended to hijack vector retrievals.",
    mitigation: "Quarantine client IP, flush cache, and block semantic vectors.",
    defaultQuarantineDays: 30,
  },
  AI_AUTOMATED_EXPLOIT: {
    id: "AI_AUTOMATED_EXPLOIT",
    name: "AI-Driven Automated Exploits",
    severity: "HIGH",
    description:
      "Automated attack bots, agentic reconnaissance probes, or headless crawler attacks targeting application boundaries.",
    mitigation: "Immediate 30-day firewall ban and fingerprint invalidation.",
    defaultQuarantineDays: 30,
  },
  BOLA_ACCESS_CONTROL: {
    id: "BOLA_ACCESS_CONTROL",
    name: "Broken Access Control & Authorization (BOLA / IDOR)",
    severity: "CRITICAL",
    description:
      "Attempts to access or manipulate unauthorized object references, internal IDs, or escalate administrative privileges.",
    mitigation: "Revoke session, quarantine client IP, and log security incident.",
    defaultQuarantineDays: 30,
  },
  TOKEN_THEFT_MFA_FATIGUE: {
    id: "TOKEN_THEFT_MFA_FATIGUE",
    name: "MFA Fatigue & Token Theft / Replay",
    severity: "HIGH",
    description:
      "JWT header manipulation, session hijacking attempts, brute force tokens, or credential replay probes.",
    mitigation: "Invalidate tokens and enforce 30-day browser quarantine.",
    defaultQuarantineDays: 30,
  },
  RESOURCE_CONSUMPTION_DDOS: {
    id: "RESOURCE_CONSUMPTION_DDOS",
    name: "Unrestricted Resource Consumption",
    severity: "HIGH",
    description:
      "Prompt bombs, quadratic complexity inputs, memory-exhaustion payloads, or massive input flooding.",
    mitigation: "Rate-limit clamp, connection reset, and 30-day host ban.",
    defaultQuarantineDays: 30,
  },
  SUPPLY_CHAIN_CICD_TAMPER: {
    id: "SUPPLY_CHAIN_CICD_TAMPER",
    name: "Software Supply Chain & CI/CD Tampering Probes",
    severity: "CRITICAL",
    description:
      "Probing for exposed GitHub webhooks, CI/CD secret tokens, dependency injection paths, or build artifacts.",
    mitigation: "Quarantine IP immediately and notify intrusion telemetry.",
    defaultQuarantineDays: 30,
  },
  SUB_THRESHOLD_DDOS: {
    id: "SUB_THRESHOLD_DDOS",
    name: "Sub-Threshold Application DDoS",
    severity: "MEDIUM",
    description:
      "Low-and-slow HTTP request flooding, stealth socket saturation, or automated micro-bursts bypassing standard rate limiters.",
    mitigation: "Block client socket and enforce 30-day quarantine.",
    defaultQuarantineDays: 30,
  },
  EXCEPTION_STACK_PROBE: {
    id: "EXCEPTION_STACK_PROBE",
    name: "Mishandling Exceptional Conditions & Stack Leak Probes",
    severity: "HIGH",
    description:
      "Deliberately triggering server-side unhandled errors to force stack trace disclosures or internal architecture discovery.",
    mitigation: "Sanitize response, drop connection, and quarantine host for 30 days.",
    defaultQuarantineDays: 30,
  },
  INJECTION_FLAWS: {
    id: "INJECTION_FLAWS",
    name: "Injection Flaws (SQLi, NoSQL, Command, SSTI)",
    severity: "CRITICAL",
    description:
      "Malicious SQL, NoSQL ($where, $gt), OS command separators (|, &&, ;), or template expressions.",
    mitigation: "Drop request, block IP for 30 days, log payload signature.",
    defaultQuarantineDays: 30,
  },
  SECURITY_MISCONFIG_PROBE: {
    id: "SECURITY_MISCONFIG_PROBE",
    name: "Security Misconfigurations & Exposure Scanning",
    severity: "HIGH",
    description:
      "Probing for sensitive dotfiles (.env, .git, .aws), wp-admin, phpmyadmin, or exposed internal endpoints.",
    mitigation: "Trigger 403 Cyber Lockdown and block IP for 30 days.",
    defaultQuarantineDays: 30,
  },
  CORS_MALWARE_FILE_UPLOAD: {
    id: "CORS_MALWARE_FILE_UPLOAD",
    name: "CORS, JWT, Malware Attack & Malicious File Upload",
    severity: "CRITICAL",
    description:
      "Malicious SVG with embedded scripts, executable uploads, cross-origin header forgery, or malformed JWT payloads.",
    mitigation: "Reject upload, neutralize origin, and enforce 30-day ban.",
    defaultQuarantineDays: 30,
  },
  PROMPT_INJECTION_JAILBREAK: {
    id: "PROMPT_INJECTION_JAILBREAK",
    name: "Chatbot Prompt Injection & Jailbreak Attack",
    severity: "CRITICAL",
    description:
      "Adversarial prompt hijacking, 'ignore previous instructions', system prompt exfiltration, DAN mode, or roleplay bypass.",
    mitigation: "Lock chat session, ban IP for 30 days, engage AI containment.",
    defaultQuarantineDays: 30,
  },
};
