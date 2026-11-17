import { redirect } from "next/navigation";
import { getHrDashboardUrl } from "@/lib/hr-dashboard";

// Query parameters are ignored on purpose: the client always comes from the session.
export async function GET() {
  const dashboardUrl = await getHrDashboardUrl();
  redirect(dashboardUrl ?? "/human-resources");
}
