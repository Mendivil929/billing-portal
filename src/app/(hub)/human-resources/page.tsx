import { UsersIcon } from "@/components/icons";
import { ModuleComingSoon } from "@/components/portal/module-coming-soon";

export default function HumanResourcesPage() {
  return (
    <ModuleComingSoon
      title="Human Resources"
      Icon={UsersIcon}
      iconClass="bg-accent-50 text-accent-600"
    />
  );
}
