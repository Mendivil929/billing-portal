import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { getSessionToken } from "@/lib/session";
import type { MeResponse } from "@/lib/types";

export interface Session {
  token: string;
  me: MeResponse;
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const me = await apiFetch<MeResponse>("/api/v1/auth/me", { token });
    return { token, me };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
