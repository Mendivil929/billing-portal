import { redirect } from "next/navigation";
import { UsersIcon } from "@/components/icons";
import { ModuleComingSoon } from "@/components/portal/module-coming-soon";
import { ModuleDashboard } from "@/components/portal/module-dashboard";
import { getHrDashboardUrl } from "@/lib/hr-dashboard";

export default async function HumanResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The page takes no parameters: any attempt to pick a client (?Cliente=...) lands
  // back on the clean URL, which always serves the signed-in client's dashboard.
  if (Object.keys(await searchParams).length > 0) redirect("/human-resources");

  if (!(await getHrDashboardUrl())) {
    return (
      <ModuleComingSoon
        title="Human Resources"
        Icon={UsersIcon}
        iconClass="bg-accent-50 text-accent-600"
      />
    );
  }

  return (
    <ModuleDashboard
      module="Human Resources"
      subtitle="Your team's workforce information."
      cardTitle="Workforce dashboard"
      cardDescription="Your Human Resources dashboard, prepared for your account. It opens in a new tab."
      href="/human-resources/dashboard"
      iconClass="bg-accent-50 text-accent-600"
      buttonClass="bg-accent-600 hover:bg-accent-700"
    />
  );
}
