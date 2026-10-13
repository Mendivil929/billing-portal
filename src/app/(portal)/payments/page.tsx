import { PageHeader } from "@/components/portal/page-header";
import { PaymentsWorkflow } from "@/components/portal/payments/payments-workflow";
import { getOpenInvoices } from "@/lib/accounts-receivable";
import { getCurrentCustomer } from "@/lib/data";
import { todayIso } from "@/lib/filters";

export default async function PaymentsPage() {
  const [openInvoices, customer] = await Promise.all([
    getOpenInvoices(todayIso()),
    getCurrentCustomer(),
  ]);

  const invoices = openInvoices
    .map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.documentNumber,
      invoiceDate: invoice.transactionDate,
      dueDate: invoice.dueDate,
      amount: invoice.amounts.foreignTotal,
      balanceDue: invoice.amounts.foreignUnpaid ?? 0,
    }))
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));

  return (
    <>
      <PageHeader
        title="Payments"
        description="Select open invoices and prepare your payment and remittance details."
      />
      <PaymentsWorkflow
        invoices={invoices}
        customerName={customer.name}
        accountNumber={customer.accountNumber}
      />
    </>
  );
}
