import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

// Pages can't delete cookies, so a stale session is cleared here. Without this,
// proxy.ts keeps sending the stale cookie from /login back to /home in a loop.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
