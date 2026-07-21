import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StackedBar } from "@/components/charts/stacked-bar";
import { getAgingByCustomer } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { AgingBucketKey } from "@/lib/types";

const BUCKET_LABELS: { key: AgingBucketKey; label: string; color: string }[] = [
  { key: "0-15", label: "0–15 Days", color: "#86b6ef" },
  { key: "16-30", label: "16–30 Days", color: "#5598e7" },
  { key: "31-45", label: "31–45 Days", color: "#2a78d6" },
  { key: "46+", label: "46+ Days", color: "#184f95" },
];

export default async function AgingPage() {
  const customers = await getAgingByCustomer();

  const bucketTotals: Record<AgingBucketKey, number> = {
    "0-15": 0,
    "16-30": 0,
    "31-45": 0,
    "46+": 0,
  };
  for (const c of customers) {
    for (const key of Object.keys(bucketTotals) as AgingBucketKey[]) {
      bucketTotals[key] += c.buckets[key];
    }
  }
  const grandTotal = Object.values(bucketTotals).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        title="Aging Summary"
        description="Monitor outstanding balances and prioritize collection follow-up."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BUCKET_LABELS.map((bucket) => (
          <div
            key={bucket.key}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: bucket.color }}
              />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {bucket.label}
              </p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(bucketTotals[bucket.key])}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {((bucketTotals[bucket.key] / grandTotal) * 100).toFixed(0)}% of total
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader
            title="Aging Distribution"
            description={`Total balance ${formatCurrency(grandTotal)}`}
          />
          <div className="p-5">
            <StackedBar
              segments={BUCKET_LABELS.map((b) => ({
                label: b.label,
                value: bucketTotals[b.key],
                color: b.color,
              }))}
              formatValue={(v) => formatCurrency(v)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Aging by Customer" description="Outstanding balance by customer and age bucket" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  {BUCKET_LABELS.map((b) => (
                    <th key={b.key} className="px-5 py-3 text-right font-medium">
                      {b.label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right font-medium">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.customerName}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      {c.customerName}
                    </td>
                    {BUCKET_LABELS.map((b) => (
                      <td
                        key={b.key}
                        className="px-5 py-3 text-right tabular-nums text-slate-500 dark:text-slate-400"
                      >
                        {c.buckets[b.key] > 0 ? formatCurrency(c.buckets[b.key]) : "—"}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatCurrency(c.totalBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 font-semibold dark:border-slate-700">
                  <td className="px-5 py-3 text-slate-900 dark:text-slate-100">Total</td>
                  {BUCKET_LABELS.map((b) => (
                    <td
                      key={b.key}
                      className="px-5 py-3 text-right tabular-nums text-slate-900 dark:text-slate-100"
                    >
                      {formatCurrency(bucketTotals[b.key])}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
