import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDashboardMetrics, getRecentInvoices } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const [metrics, recentInvoices] = await Promise.all([
    getDashboardMetrics(),
    getRecentInvoices(5),
  ]);

  return (
    <>
      <PageHeader
        title="Billing Dashboard"
        description="Real-time overview of balances, open invoices, and key billing metrics."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Balance" value={formatCurrency(metrics.openBalance)} />
        <StatCard
          label="Past Due"
          value={formatCurrency(metrics.pastDue)}
          delta="Needs attention"
          deltaDirection="down"
        />
        <StatCard label="Invoices" value={metrics.totalInvoices.toString()} />
        <StatCard label="Due This Cycle" value={metrics.dueThisCycle.toString()} />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Recent Invoices"
          description="The most recent invoices on your account."
          action={
            <Link
              href="/invoices"
              className="text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
            >
              View all invoices →
            </Link>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                <th className="px-5 py-3 font-medium">Invoice #</th>
                <th className="px-5 py-3 font-medium">Invoice Date</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="px-5 py-3 font-medium text-teal-700 dark:text-teal-400">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-5 py-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
