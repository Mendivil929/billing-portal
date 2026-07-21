import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { getWeeklyBillingHistory } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function BillingHistoryPage() {
  const weeks = await getWeeklyBillingHistory();

  const totalInvoices = weeks.reduce((sum, w) => sum + w.invoicesIssued, 0);
  const totalBilled = weeks.reduce((sum, w) => sum + w.totalBilled, 0);
  const highest = weeks.reduce((max, w) => (w.totalBilled > max.totalBilled ? w : max), weeks[0]);
  const average = totalBilled / weeks.length;

  return (
    <>
      <PageHeader
        title="Weekly Billing History"
        description="Track billing performance and invoice activity week by week."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Last 8 Weeks"
          value={totalInvoices.toLocaleString()}
          subtext="Invoices issued"
        />
        <StatCard
          label="Highest Billing Week"
          value={formatCurrency(highest.totalBilled)}
          subtext={highest.weekLabel}
        />
        <StatCard
          label="Average Weekly Billing"
          value={formatCurrency(average)}
          subtext="Based on last 8 weeks"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Total Billed (USD)" description="Weekly invoiced amount" />
          <div className="p-5">
            <BarChart
              data={weeks.map((w) => ({ label: w.weekShort, value: w.totalBilled }))}
              color="#2a78d6"
              format="currency"
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Invoices Issued" description="Weekly invoice count" />
          <div className="p-5">
            <LineChart
              data={weeks.map((w) => ({ label: w.weekShort, value: w.invoicesIssued }))}
              color="#1baf7a"
            />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Weekly Billing Summary"
          description="Last 8 weeks of billing activity"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                <th className="px-5 py-3 font-medium">Week</th>
                <th className="px-5 py-3 font-medium">Invoices Issued</th>
                <th className="px-5 py-3 font-medium">Total Billed (USD)</th>
                <th className="px-5 py-3 font-medium">Credits / Adjustments</th>
                <th className="px-5 py-3 font-medium">Collected (USD)</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {weeks
                .slice()
                .reverse()
                .map((w) => (
                  <tr
                    key={w.weekLabel}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{w.weekLabel}</td>
                    <td className="px-5 py-3 tabular-nums text-slate-500 dark:text-slate-400">
                      {w.invoicesIssued}
                    </td>
                    <td className="px-5 py-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatCurrency(w.totalBilled)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-[#d03b3b]">
                      ({formatCurrency(Math.abs(w.creditsAdjustments)).replace("$", "")})
                    </td>
                    <td className="px-5 py-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatCurrency(w.collected)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status="completed" />
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
