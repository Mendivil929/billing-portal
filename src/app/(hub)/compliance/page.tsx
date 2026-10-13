import { ShieldCheckIcon } from "@/components/icons";
import { ModuleComingSoon } from "@/components/portal/module-coming-soon";

export default function CompliancePage() {
  return (
    <ModuleComingSoon
      title="Compliance"
      Icon={ShieldCheckIcon}
      iconClass="bg-neutral-100 text-neutral-600"
    />
  );
}
