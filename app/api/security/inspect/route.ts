import { NextResponse } from "next/server";
import { inspectPayloadAndEnforce } from "@/lib/security/security-engine";
import {
  getQuarantineRecord,
  normalizeIp,
  quarantineIp,
  unquarantineTarget,
  clearAllQuarantines,
  THIRTY_DAYS_MS,
  QuarantineRecord,
} from "@/lib/security/ip-blocklist-store";
import { ThreatCategoryKey } from "@/lib/security/threat-taxonomy";

function extractTarget(req: Request) {
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
    } catch {
      // Ignore parse error
    }
  }

  return { ip, deviceId, cookieRecord };
}

export async function GET(req: Request) {
  try {
    const { ip, deviceId, cookieRecord } = extractTarget(req);
    const { searchParams } = new URL(req.url);
    const isUnblock =
      searchParams.get("action") === "unblock" ||
      searchParams.get("unblock") === "tareq";

    if (isUnblock) {
      unquarantineTarget({ deviceId, rawIp: ip });
      clearAllQuarantines();

      const res = NextResponse.json({
        unblocked: true,
        message: "Quarantine lifted for current device and IP.",
      });
      res.cookies.set("tareq_sec_quarantine", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
      return res;
    }

    // Inspect specifically for this client device/browser
    const record = getQuarantineRecord({ deviceId, rawIp: ip, cookieRecord });

    if (record) {
      return NextResponse.json({
        isQuarantined: true,
        record,
      });
    }

    return NextResponse.json({
      isQuarantined: false,
      ip,
      deviceId,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Security inspection error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { ip, deviceId } = extractTarget(req);
    unquarantineTarget({ deviceId, rawIp: ip });
    clearAllQuarantines();

    const res = NextResponse.json({
      success: true,
      message: `Quarantine removed.`,
    });
    res.cookies.set("tareq_sec_quarantine", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
    return res;
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Unquarantine error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { ip, deviceId, cookieRecord } = extractTarget(req);

    // Check if this specific client is already quarantined
    const existing = getQuarantineRecord({ deviceId, rawIp: ip, cookieRecord });
    if (existing) {
      return NextResponse.json(
        {
          isThreat: true,
          quarantinedRecord: existing,
          action: "BLOCK_30_DAYS",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { payload, clientReportedThreat, reason, deviceId: bodyDevId } = body;
    const targetDeviceId = deviceId || bodyDevId;

    // Explicit threat report
    if (clientReportedThreat) {
      const category = (clientReportedThreat as ThreatCategoryKey) || "INJECTION_FLAWS";
      const record = quarantineIp(
        ip,
        category,
        reason || "Security violation detected.",
        {
          deviceId: targetDeviceId,
        }
      );

      const res = NextResponse.json(
        {
          isThreat: true,
          quarantinedRecord: record,
          action: "BLOCK_30_DAYS",
        },
        { status: 403 }
      );

      // Set 30-day quarantine cookie specifically on this attacker's browser
      res.cookies.set("tareq_sec_quarantine", JSON.stringify(record), {
        maxAge: Math.floor(THIRTY_DAYS_MS / 1000),
        path: "/",
        httpOnly: false,
        sameSite: "lax",
      });

      return res;
    }

    // Inspect payload
    if (payload && typeof payload === "string") {
      const result = await inspectPayloadAndEnforce(payload, ip, {
        deviceId: targetDeviceId,
        triggerAiAnalysis: true,
      });

      if (result.isThreat && result.quarantinedRecord) {
        const res = NextResponse.json(
          {
            isThreat: true,
            quarantinedRecord: result.quarantinedRecord,
            action: "BLOCK_30_DAYS",
            result,
          },
          { status: 403 }
        );

        res.cookies.set(
          "tareq_sec_quarantine",
          JSON.stringify(result.quarantinedRecord),
          {
            maxAge: Math.floor(THIRTY_DAYS_MS / 1000),
            path: "/",
            httpOnly: false,
            sameSite: "lax",
          }
        );

        return res;
      }

      return NextResponse.json({
        isThreat: false,
        action: "ALLOW",
      });
    }

    return NextResponse.json({ isThreat: false, action: "ALLOW" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Security processing failure" },
      { status: 500 }
    );
  }
}
