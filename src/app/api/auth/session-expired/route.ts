import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

// Pages can't delete cookies, so a stale session is cleared here. Without this,
// proxy.ts keeps sending the stale cookie from /login back to /home in a loop.
// The Location is relative on purpose: behind the server's reverse proxy the
// request URL is the internal localhost:50022 address, not business.tecma.com.
export function GET() {
  const response = new NextResponse(null, { status: 307, headers: { Location: "/login" } });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
