import { ThreatCategoryKey, THREAT_TAXONOMY } from "./threat-taxonomy";

export interface QuarantineRecord {
  incidentId: string;
  ip: string;
  threatCategory: ThreatCategoryKey;
  threatName: string;
  severity: string;
  reason: string;
  detectedAt: number;
  expiresAt: number;
  aiModel?: string;
  blockedPayloadSnippet?: string;
}

// Global in-memory block registry for the server runtime
const globalQuarantineMap = new Map<string, QuarantineRecord>();

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function normalizeIp(rawIp: string | null | undefined): string {
  if (!rawIp) return "127.0.0.1";
  let ip = rawIp.trim();
  // Handle comma-separated x-forwarded-for
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }
  // Remove IPv6 prefix if IPv4 mapped
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  return ip;
}

export function generateIncidentId(prefix = "SEC-QWEN"): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${time}${rand}`;
}

export function quarantineIp(
  rawIp: string,
  category: ThreatCategoryKey,
  reason: string,
  options?: {
    aiModel?: string;
    payloadSnippet?: string;
    incidentId?: string;
  }
): QuarantineRecord {
  const ip = normalizeIp(rawIp);
  const now = Date.now();
  const expiresAt = now + THIRTY_DAYS_MS;
  const def = THREAT_TAXONOMY[category];
  const incidentId = options?.incidentId || generateIncidentId();

  const record: QuarantineRecord = {
    incidentId,
    ip,
    threatCategory: category,
    threatName: def?.name || category,
    severity: def?.severity || "HIGH",
    reason,
    detectedAt: now,
    expiresAt,
    aiModel: options?.aiModel || "Qwen 3.6 27B Security Core",
    blockedPayloadSnippet: options?.payloadSnippet
      ? options.payloadSnippet.substring(0, 120)
      : undefined,
  };

  globalQuarantineMap.set(ip, record);
  return record;
}

export function getQuarantineRecord(rawIp: string): QuarantineRecord | null {
  const ip = normalizeIp(rawIp);
  const record = globalQuarantineMap.get(ip);
  if (!record) return null;

  // Check if 30-day quarantine has expired
  if (Date.now() > record.expiresAt) {
    globalQuarantineMap.delete(ip);
    return null;
  }

  return record;
}

export function unquarantineIp(rawIp: string): boolean {
  const ip = normalizeIp(rawIp);
  return globalQuarantineMap.delete(ip);
}

export function clearAllQuarantines(): void {
  globalQuarantineMap.clear();
}

export function isIpQuarantined(rawIp: string): boolean {
  return !!getQuarantineRecord(rawIp);
}

export function getAllActiveQuarantines(): QuarantineRecord[] {
  const now = Date.now();
  const active: QuarantineRecord[] = [];
  for (const [ip, record] of globalQuarantineMap.entries()) {
    if (now <= record.expiresAt) {
      active.push(record);
    } else {
      globalQuarantineMap.delete(ip);
    }
  }
  return active;
}

