import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentCustomer } from "@/lib/data";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();

  return (
    <PortalShell customerName={customer.name} accountNumber={customer.accountNumber}>
      {children}
    </PortalShell>
  );
}
