import { ThreatCategoryKey, THREAT_TAXONOMY } from "./threat-taxonomy";

export interface QuarantineRecord {
  incidentId: string;
  ip: string;
  deviceId?: string;
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
// Keyed by DEV:{deviceId} or IP:{ip} to isolate client browser vs router WAN IP
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
    deviceId?: string;
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
    deviceId: options?.deviceId,
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

  // 1. Index specifically by deviceId to protect innocent users on the same router
  if (options?.deviceId) {
    globalQuarantineMap.set(`DEV:${options.deviceId}`, record);
  }
  // 2. Also register incident
  globalQuarantineMap.set(`INC:${incidentId}`, record);

  return record;
}

export function getQuarantineRecord(target: {
  deviceId?: string | null;
  rawIp?: string | null;
  cookieRecord?: QuarantineRecord | null;
}): QuarantineRecord | null {
  // 1. Browser persistent cookie verification (highest accuracy for client system)
  if (target.cookieRecord && target.cookieRecord.expiresAt) {
    if (Date.now() <= target.cookieRecord.expiresAt) {
      return target.cookieRecord;
    }
  }

  // 2. Specific device hardware/browser ID check
  if (target.deviceId) {
    const devRecord = globalQuarantineMap.get(`DEV:${target.deviceId}`);
    if (devRecord) {
      if (Date.now() > devRecord.expiresAt) {
        globalQuarantineMap.delete(`DEV:${target.deviceId}`);
        return null;
      }
      return devRecord;
    }
  }

  // NOTE: We deliberately do NOT fallback to blocking the entire rawIp for regular web requests,
  // because multiple devices/family/coworkers share the exact same WAN router IP.
  return null;
}

export function unquarantineTarget(target: {
  deviceId?: string | null;
  rawIp?: string | null;
}): boolean {
  let removed = false;
  if (target.deviceId) {
    if (globalQuarantineMap.delete(`DEV:${target.deviceId}`)) removed = true;
  }
  if (target.rawIp) {
    const ip = normalizeIp(target.rawIp);
    if (globalQuarantineMap.delete(`IP:${ip}`)) removed = true;
  }
  return removed;
}

export function clearAllQuarantines(): void {
  globalQuarantineMap.clear();
}

export function getAllActiveQuarantines(): QuarantineRecord[] {
  const now = Date.now();
  const active: QuarantineRecord[] = [];
  for (const [key, record] of globalQuarantineMap.entries()) {
    if (key.startsWith("DEV:") || key.startsWith("IP:")) {
      if (now <= record.expiresAt) {
        active.push(record);
      } else {
        globalQuarantineMap.delete(key);
      }
    }
  }
  return active;
}
