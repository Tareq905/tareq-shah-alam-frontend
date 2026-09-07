import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Static asset ignore pattern
const PUBLIC_FILE = /\.(.*)$/;

const MALICIOUS_PATH_PATTERNS = [
  /\/\.env(?:\.local|\.prod|\.backup)?$/i,
  /\/\.git(?:\/.*)?$/i,
  /\/\.aws\//i,
  /\/\.ssh\//i,
  /\/wp-admin/i,
  /\/phpmyadmin/i,
  /\/etc\/passwd/i,
  /\/win\.ini/i,
  /(?:union\s+select|<script\b|--\s*$)/i,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip static Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/security") ||
    pathname.startsWith("/skills/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 1. Check for Active 30-Day Quarantine Cookie
  const quarantineCookie = request.cookies.get("tareq_sec_quarantine");
  if (quarantineCookie?.value) {
    try {
      const record = JSON.parse(quarantineCookie.value);
      if (record && record.expiresAt && Date.now() < record.expiresAt) {
        // If requesting API endpoint, return immediate 403
        if (pathname.startsWith("/api/")) {
          return new NextResponse(
            JSON.stringify({
              error: "ACCESS_DENIED_SECURITY_QUARANTINE",
              message: "Your IP and browser have been quarantined for 30 days due to detected malicious activity.",
              incidentId: record.incidentId,
              threatCategory: record.threatCategory,
              expiresAt: record.expiresAt,
            }),
            {
              status: 403,
              headers: {
                "Content-Type": "application/json",
                "X-Quarantine-Incident": record.incidentId || "SEC-ACTIVE",
                "X-Quarantine-Expires": String(record.expiresAt),
              },
            }
          );
        }

        // For page requests, pass quarantine header so frontend can render lockdown HUD
        const response = NextResponse.next();
        response.headers.set("x-security-quarantined", "1");
        response.headers.set("x-quarantine-data", encodeURIComponent(quarantineCookie.value));
        return response;
      }
    } catch {
      // Ignore parse failure
    }
  }

  // 2. Real-time Path & Query Exploit Inspection
  const fullTarget = `${pathname}${search}`;
  for (const pattern of MALICIOUS_PATH_PATTERNS) {
    if (pattern.test(fullTarget)) {
      const incidentId = `SEC-WAF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      const quarantineData = {
        incidentId,
        threatCategory: "SECURITY_MISCONFIG_PROBE",
        threatName: "Security Misconfigurations & Exploit Probe",
        severity: "CRITICAL",
        reason: `Hostile request path or query exploit detected: ${pathname.substring(0, 50)}`,
        detectedAt: Date.now(),
        expiresAt,
        aiModel: "Enterprise Edge WAF Inspector",
      };

      const res = new NextResponse(
        JSON.stringify({
          error: "ACCESS_DENIED_SECURITY_QUARANTINE",
          message: "Hostile exploit pattern detected. Your host is locked out for 30 days.",
          incidentId,
          expiresAt,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Quarantine-Incident": incidentId,
          },
        }
      );

      res.cookies.set("tareq_sec_quarantine", JSON.stringify(quarantineData), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });

      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
