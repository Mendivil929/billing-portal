import { PageHeader } from "@/components/portal/page-header";
import { PaymentsWorkflow } from "@/components/portal/payments/payments-workflow";
import { getCurrentCustomer, getPayableInvoices } from "@/lib/data";

export default async function PaymentsPage() {
  const [invoices, customer] = await Promise.all([getPayableInvoices(), getCurrentCustomer()]);

  return (
    <>
      <PageHeader
        title="Payments"
        description="A centralized workflow to manage invoice payments and remittance details."
      />
      <PaymentsWorkflow
        invoices={invoices}
        customerName={customer.name}
        accountNumber={customer.accountNumber}
      />
    </>
  );
}
