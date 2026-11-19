import { ShieldCheckIcon } from "@/components/icons";
import { ModuleComingSoon } from "@/components/portal/module-coming-soon";
import { ModuleDashboard } from "@/components/portal/module-dashboard";
import { getComplianceDashboardUrl } from "@/lib/compliance-dashboard";

export default async function CompliancePage() {
  if (!(await getComplianceDashboardUrl())) {
    return (
      <ModuleComingSoon
        title="Customs and Compliance"
        Icon={ShieldCheckIcon}
        iconClass="bg-neutral-100 text-neutral-600"
      />
    );
  }

  return (
    <ModuleDashboard
      module="Customs and Compliance"
      subtitle="Movements, inventory and regulatory compliance."
      cardTitle="Customs dashboard"
      cardDescription="Your movements and inventory dashboard, prepared for your account. It opens in a new tab."
      href="/compliance/dashboard"
      iconClass="bg-neutral-100 text-neutral-600"
      buttonClass="bg-neutral-600 hover:bg-neutral-700"
    />
  );
}
