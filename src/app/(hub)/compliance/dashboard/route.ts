import { redirect } from "next/navigation";
import { getComplianceDashboardUrl } from "@/lib/compliance-dashboard";

export async function GET() {
  const dashboardUrl = await getComplianceDashboardUrl();
  redirect(dashboardUrl ?? "/compliance");
}
