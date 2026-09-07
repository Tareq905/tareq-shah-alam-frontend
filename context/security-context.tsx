'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuarantineRecord } from "@/lib/security/ip-blocklist-store";
import { ThreatCategoryKey } from "@/lib/security/threat-taxonomy";
import { SecurityQuarantineModal } from "@/components/sub/security-quarantine-modal";

interface SecurityContextType {
  isQuarantined: boolean;
  quarantineRecord: QuarantineRecord | null;
  deviceId: string;
  triggerQuarantine: (threatCategory: ThreatCategoryKey, reason: string) => Promise<void>;
  inspectPayload: (payload: string) => Promise<{ isThreat: boolean; reason?: string }>;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem("tareq_device_id");
    if (!id) {
      id = "DEV-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
      localStorage.setItem("tareq_device_id", id);
    }
    // Set persistent device ID cookie (1 year)
    document.cookie = `tareq_device_id=${id}; Path=/; Max-Age=31536000; SameSite=Lax;`;
    return id;
  } catch {
    return "DEV-FALLBACK";
  }
}

const SecurityContext = createContext<SecurityContextType>({
  isQuarantined: false,
  quarantineRecord: null,
  deviceId: "DEV-DEFAULT",
  triggerQuarantine: async () => {},
  inspectPayload: async () => ({ isThreat: false }),
});

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [quarantineRecord, setQuarantineRecord] = useState<QuarantineRecord | null>(null);
  const [deviceId, setDeviceId] = useState<string>("DEV-DEFAULT");

  useEffect(() => {
    const currentDeviceId = getOrCreateDeviceId();
    setDeviceId(currentDeviceId);

    // 1. Check local storage for persistent quarantine record
    const checkLocalStorage = () => {
      try {
        const saved = localStorage.getItem("tareq_sec_quarantine");
        if (saved) {
          const parsed = JSON.parse(saved) as QuarantineRecord;
          if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
            setQuarantineRecord(parsed);
            return true;
          } else {
            localStorage.removeItem("tareq_sec_quarantine");
          }
        }
      } catch {
        // Ignore JSON error
      }
      return false;
    };

    // 2. Check cookie for this specific browser
    const checkCookie = () => {
      try {
        const match = document.cookie.match(/(?:^|; )tareq_sec_quarantine=([^;]*)/);
        if (match && match[1]) {
          const parsed = JSON.parse(decodeURIComponent(match[1])) as QuarantineRecord;
          if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
            setQuarantineRecord(parsed);
            return true;
          }
        }
      } catch {
        // Ignore cookie parse error
      }
      return false;
    };

    const isLocalBlocked = checkLocalStorage() || checkCookie();

    // 3. Verify specifically for THIS device with server endpoint (does NOT block other Wi-Fi devices)
    if (!isLocalBlocked) {
      fetch("/api/security/inspect", {
        headers: {
          "x-device-id": currentDeviceId,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isQuarantined && data.record) {
            setQuarantineRecord(data.record);
            localStorage.setItem("tareq_sec_quarantine", JSON.stringify(data.record));
          }
        })
        .catch(() => {});
    }
  }, []);

  const triggerQuarantine = async (
    threatCategory: ThreatCategoryKey,
    reason: string
  ) => {
    const currentDevId = getOrCreateDeviceId();
    try {
      const res = await fetch("/api/security/inspect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": currentDevId,
        },
        body: JSON.stringify({
          deviceId: currentDevId,
          clientReportedThreat: threatCategory,
          reason,
        }),
      });

      const data = await res.json();
      if (data.quarantinedRecord) {
        setQuarantineRecord(data.quarantinedRecord);
        localStorage.setItem(
          "tareq_sec_quarantine",
          JSON.stringify(data.quarantinedRecord)
        );
      }
    } catch {
      // Client-side fallback quarantine record
      const fallbackRecord: QuarantineRecord = {
        incidentId: `SEC-CLI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        ip: "Client Session",
        deviceId: currentDevId,
        threatCategory,
        threatName: threatCategory,
        severity: "CRITICAL",
        reason,
        detectedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        aiModel: "Client Intrusion Detector",
      };
      setQuarantineRecord(fallbackRecord);
      localStorage.setItem(
        "tareq_sec_quarantine",
        JSON.stringify(fallbackRecord)
      );
    }
  };

  const inspectPayload = async (
    payload: string
  ): Promise<{ isThreat: boolean; reason?: string }> => {
    const currentDevId = getOrCreateDeviceId();
    try {
      const res = await fetch("/api/security/inspect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": currentDevId,
        },
        body: JSON.stringify({ payload, deviceId: currentDevId }),
      });

      const data = await res.json();
      if (data.isThreat && data.quarantinedRecord) {
        setQuarantineRecord(data.quarantinedRecord);
        localStorage.setItem(
          "tareq_sec_quarantine",
          JSON.stringify(data.quarantinedRecord)
        );
        return { isThreat: true, reason: data.quarantinedRecord.reason };
      }

      return { isThreat: false };
    } catch {
      return { isThreat: false };
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        isQuarantined: !!quarantineRecord,
        quarantineRecord,
        deviceId,
        triggerQuarantine,
        inspectPayload,
      }}
    >
      {quarantineRecord && (
        <SecurityQuarantineModal
          record={quarantineRecord}
        />
      )}

      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
