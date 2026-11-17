import "server-only";
import { cache } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { requireSession } from "@/lib/auth";
import { getActiveCostCenter } from "@/lib/cost-center";

interface ClicDataLink {
  provider: string;
  costCenterId: string;
  url: string;
}

// Only ever redirect to ClicData itself, even if the backend returned something else.
function isClicDataUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".clicdata.com");
  } catch {
    return false;
  }
}

// The backend builds and authorizes the link for the session's cost center, so the
// client can never be chosen from the request.
export const getHrDashboardUrl = cache(async (): Promise<string | null> => {
  const [session, costCenter] = await Promise.all([requireSession(), getActiveCostCenter()]);
  if (!costCenter) return null;

  try {
    const link = await apiFetch<ClicDataLink>("/api/v1/external-access/clicdata", {
      token: session.token,
      headers: { "X-Cost-Center-Id": costCenter.id },
    });
    return isClicDataUrl(link.url) ? link.url : null;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) return null;
    throw error;
  }
});
