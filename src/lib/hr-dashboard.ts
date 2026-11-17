import "server-only";
import { requireSession } from "@/lib/auth";

const DASHBOARD_URL = process.env.CLICDATA_HR_DASHBOARD_URL;

// The client always comes from the session, never from the request, so a user
// cannot point the dashboard at another client's data.
export async function getHrDashboardUrl(): Promise<string | null> {
  const session = await requireSession();
  const client = session.me.clicdataClient?.trim();
  if (!DASHBOARD_URL || !client) return null;

  const url = new URL(DASHBOARD_URL);
  url.search = "";
  url.searchParams.set("Cliente", client);
  return url.toString();
}
