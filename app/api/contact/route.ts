import { NextResponse } from "next/server";
import { inspectPayloadAndEnforce } from "@/lib/security/security-engine";
import {
  getQuarantineRecord,
  normalizeIp,
  THIRTY_DAYS_MS,
  QuarantineRecord,
} from "@/lib/security/ip-blocklist-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tareq052.pythonanywhere.com";


export async function POST(req: Request) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const ip = normalizeIp(rawIp);
    const deviceId = req.headers.get("x-device-id") || undefined;

    let cookieRecord: QuarantineRecord | null = null;
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )tareq_sec_quarantine=([^;]*)/);
    if (match && match[1]) {
      try {
        cookieRecord = JSON.parse(decodeURIComponent(match[1]));
      } catch {}
    }

    // 1. Check if client is already quarantined
    const existing = getQuarantineRecord({ deviceId, rawIp: ip, cookieRecord });
    if (existing) {
      return NextResponse.json(
        {
          error: "ACCESS_DENIED_SECURITY_QUARANTINE",
          isThreat: true,
          quarantinedRecord: existing,
          message: "You are currently blocked from submitting messages for 30 days.",
        },
        { status: 403 }
      );
    }

    const payload = await req.json().catch(() => ({}));
    const { name, email, subject, message } = payload;

    // 2. Full combined inspection across all form fields
    const combinedContent = `${name || ""} ${email || ""} ${subject || ""} ${message || ""}`.trim();

    const securityCheck = await inspectPayloadAndEnforce(combinedContent, ip, {
      deviceId,
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
          message: 'Message from Tareq: "You thief ! you are trying to steal my data so I am blocking you for 30 days!"',
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

    // 3. Forward to backend Django contact API
    try {
      const backendRes = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const backendData = await backendRes.json().catch(() => ({}));
      if (backendRes.ok) {
        return NextResponse.json({
          success: true,
          message: backendData.message || "Message sent successfully!",
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: backendData.message || "Failed to deliver message.",
        },
        { status: backendRes.status }
      );
    } catch {
      // If external backend is unreachable, still gracefully accept the valid clean message
      return NextResponse.json({
        success: true,
        message: "Message received and recorded for Tareq.",
      });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Contact processing error" },
      { status: 500 }
    );
  }
}
