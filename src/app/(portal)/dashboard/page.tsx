import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TransactionTable } from "@/components/portal/ar/transaction-table";
import { getInvoiceHistory, listAllTransactions } from "@/lib/accounts-receivable";
import { addDays, isOpenInvoice, isVoided, toTransactionRow } from "@/lib/ar";
import { todayIso } from "@/lib/filters";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ArTransaction } from "@/lib/types";

function sumUnpaid(invoices: ArTransaction[]): number {
  return invoices.reduce((sum, invoice) => sum + (invoice.amounts.foreignUnpaid ?? 0), 0);
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export default async function DashboardPage() {
  const today = todayIso();
  const nextWeek = addDays(today, 7);
  const [invoices, recentPayments] = await Promise.all([
    getInvoiceHistory(today),
    listAllTransactions("payments", addDays(today, -30), today),
  ]);

  const open = invoices.filter(isOpenInvoice);
  const pastDue = open.filter((invoice) => invoice.dueDate && invoice.dueDate < today);
  const dueSoon = open.filter(
    (invoice) => invoice.dueDate && invoice.dueDate >= today && invoice.dueDate <= nextWeek,
  );
  const paid = recentPayments.filter((payment) => !isVoided(payment));
  const pastDueAmount = sumUnpaid(pastDue);

  return (
    <>
      <PageHeader
        title="Billing Dashboard"
        description={`Live overview of your balances and recent activity, as of ${formatDate(today)}.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open balance"
          value={formatCurrency(sumUnpaid(open))}
          subtext={plural(open.length, "open invoice")}
        />
        <StatCard
          label="Past due"
          value={formatCurrency(pastDueAmount)}
          delta={pastDueAmount > 0 ? "Needs attention" : undefined}
          deltaDirection={pastDueAmount > 0 ? "down" : undefined}
          subtext={pastDue.length ? plural(pastDue.length, "invoice") : "You're all caught up"}
        />
        <StatCard
          label="Due in the next 7 days"
          value={formatCurrency(sumUnpaid(dueSoon))}
          subtext={plural(dueSoon.length, "invoice")}
        />
        <StatCard
          label="Paid in the last 30 days"
          value={formatCurrency(paid.reduce((sum, payment) => sum + payment.amounts.foreignTotal, 0))}
          subtext={plural(paid.length, "payment")}
        />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Recent invoices"
          description="The latest invoices issued to your account."
          action={
            <Link href="/invoices" className="text-xs font-semibold text-brand-700 hover:underline">
              View all invoices →
            </Link>
          }
        />
        <TransactionTable
          rows={invoices.slice(0, 6).map((invoice) => toTransactionRow(invoice, today))}
          numberHeader="Invoice #"
          columns={[
            { header: "Date", render: (row) => formatDate(row.date) },
            { header: "Due date", render: (row) => (row.dueDate ? formatDate(row.dueDate) : "—") },
            {
              header: "Amount",
              align: "right",
              render: (row) => (
                <span className="font-semibold text-slate-900">{formatCurrency(row.total)}</span>
              ),
            },
            {
              header: "Status",
              render: (row) => <StatusBadge label={row.status.label} tone={row.status.tone} />,
            },
          ]}
          emptyMessage="No invoices yet."
        />
      </Card>
    </>
  );
}
