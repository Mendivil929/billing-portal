import { PortalShell } from "@/components/portal/portal-shell";
import { displayClientName } from "@/lib/client-name";
import { getActiveCostCenter, getCostCenters } from "@/lib/cost-center";
import { getProfile } from "@/lib/profile";
import { getSystemStatus } from "@/lib/system-status";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, systemStatus, costCenters, activeCostCenter] = await Promise.all([
    getProfile(),
    getSystemStatus(),
    getCostCenters(),
    getActiveCostCenter(),
  ]);

  return (
    <PortalShell
      profile={profile}
      sidebar={{
        systemStatus,
        costCenters: costCenters.map((center) => ({
          id: center.id,
          name: displayClientName(center),
          code: center.code,
        })),
        activeCostCenterId: activeCostCenter?.id ?? null,
      }}
    >
      {children}
    </PortalShell>
  );
}
