import "server-only";
import { cookies, headers } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

// Browsers drop Secure cookies on plain-HTTP origins other than localhost,
// so the flag must follow the protocol the request actually arrived on.
export async function isHttpsRequest(): Promise<boolean> {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto")?.split(",")[0].trim();
  if (forwardedProto) return forwardedProto === "https";
  return headerStore.get("origin")?.startsWith("https://") ?? false;
}

function decodeJwtExpiry(token: string): Date | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;

  try {
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    const { exp } = JSON.parse(json) as { exp?: number };
    return exp ? new Date(exp * 1000) : undefined;
  } catch {
    return undefined;
  }
}

export async function createSession(token: string, { persistent }: { persistent: boolean }) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: await isHttpsRequest(),
    sameSite: "lax",
    path: "/",
    expires: persistent ? decodeJwtExpiry(token) : undefined,
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
