'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuarantineRecord } from "@/lib/security/ip-blocklist-store";
import { ThreatCategoryKey } from "@/lib/security/threat-taxonomy";
import { SecurityQuarantineModal } from "@/components/sub/security-quarantine-modal";

interface SecurityContextType {
  isQuarantined: boolean;
  quarantineRecord: QuarantineRecord | null;
  triggerQuarantine: (threatCategory: ThreatCategoryKey, reason: string) => Promise<void>;
  inspectPayload: (payload: string) => Promise<{ isThreat: boolean; reason?: string }>;
}

const SecurityContext = createContext<SecurityContextType>({
  isQuarantined: false,
  quarantineRecord: null,
  triggerQuarantine: async () => {},
  inspectPayload: async () => ({ isThreat: false }),
});

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [quarantineRecord, setQuarantineRecord] = useState<QuarantineRecord | null>(null);

  useEffect(() => {
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

    // 2. Check cookie
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

    // 3. Verify with server IP quarantine endpoint
    if (!isLocalBlocked) {
      fetch("/api/security/inspect")
        .then((res) => res.json())
        .then((data) => {
          if (data.isQuarantined && data.record) {
            setQuarantineRecord(data.record);
            localStorage.setItem("tareq_sec_quarantine", JSON.stringify(data.record));
          }
        })
        .catch(() => {});
    }

    // 4. Client-side anti-tamper listener for XSS script tag injection
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            const tagName = node.tagName.toLowerCase();
            if (
              tagName === "script" &&
              !node.getAttribute("src")?.includes("/_next/") &&
              !node.innerText.includes("self.__next_f")
            ) {
              triggerQuarantine(
                "CORS_MALWARE_FILE_UPLOAD",
                "Unauthorized inline script DOM injection detected."
              );
            }
          }
        }
      }
    });

    try {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch {
      // Ignore in unsupported environments
    }

    return () => observer.disconnect();
  }, []);

  const triggerQuarantine = async (
    threatCategory: ThreatCategoryKey,
    reason: string
  ) => {
    try {
      const res = await fetch("/api/security/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    try {
      const res = await fetch("/api/security/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      if (res.status === 403) {
        const data = await res.json();
        if (data.quarantinedRecord) {
          setQuarantineRecord(data.quarantinedRecord);
          localStorage.setItem(
            "tareq_sec_quarantine",
            JSON.stringify(data.quarantinedRecord)
          );
        }
        return { isThreat: true, reason: data.quarantinedRecord?.reason };
      }

      const data = await res.json();
      return { isThreat: !!data.isThreat, reason: data.reason };
    } catch {
      return { isThreat: false };
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        isQuarantined: !!quarantineRecord,
        quarantineRecord,
        triggerQuarantine,
        inspectPayload,
      }}
    >
      {quarantineRecord && (
        <SecurityQuarantineModal record={quarantineRecord} />
      )}
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
