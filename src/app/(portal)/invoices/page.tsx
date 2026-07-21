import { PageHeader } from "@/components/portal/page-header";
import { InvoicesExplorer } from "@/components/portal/invoices/invoices-explorer";
import { getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <PageHeader
        title="Invoices by Cycle"
        description="View current and past invoices by billing cycle with details and statuses."
      />
      <InvoicesExplorer invoices={invoices} />
    </>
  );
}
