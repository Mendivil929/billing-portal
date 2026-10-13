import "server-only";

export type SystemStatus = "operational" | "unavailable";

export async function getSystemStatus(): Promise<SystemStatus> {
  const baseUrl = process.env.FCP_API_BASE_URL;
  if (!baseUrl) return "unavailable";

  try {
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return "unavailable";

    const body = (await response.json()) as { status?: string };
    return body.status === "ok" ? "operational" : "unavailable";
  } catch {
    return "unavailable";
  }
}
