import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { listAllTransactions } from "@/lib/accounts-receivable";
import { addDays, isVoided, startOfWeek } from "@/lib/ar";
import { buildHref, param, todayIso, type SearchParams } from "@/lib/filters";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ArTransaction } from "@/lib/types";

const WEEK_OPTIONS = [4, 8, 12, 26];
const DEFAULT_WEEKS = 8;

function shortDate(iso: string): string {
  return formatDate(iso).replace(/, \d{4}$/, "");
}

function sumByWeek(transactions: ArTransaction[], weekStart: string): { count: number; total: number } {
  const inWeek = transactions.filter(
    (tx) => !isVoided(tx) && startOfWeek(tx.transactionDate) === weekStart,
  );
  return {
    count: inWeek.length,
    total: inWeek.reduce((sum, tx) => sum + tx.amounts.foreignTotal, 0),
  };
}

export default async function BillingHistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const today = todayIso();
  const weekCount = WEEK_OPTIONS.find((w) => String(w) === param(sp, "weeks")) ?? DEFAULT_WEEKS;
  const currentWeek = startOfWeek(today);
  const from = addDays(currentWeek, -7 * (weekCount - 1));

  const [invoices, credits, payments] = await Promise.all([
    listAllTransactions("invoices", from, today),
    listAllTransactions("credit-memos", from, today),
    listAllTransactions("payments", from, today),
  ]);

  const weeks = Array.from({ length: weekCount }, (_, index) => {
    const start = addDays(from, index * 7);
    const end = addDays(start, 6);
    const billed = sumByWeek(invoices, start);
    return {
      start,
      label: `${shortDate(start)} – ${formatDate(end)}`,
      short: shortDate(start),
      invoicesIssued: billed.count,
      totalBilled: billed.total,
      credits: sumByWeek(credits, start).total,
      collected: sumByWeek(payments, start).total,
      inProgress: start === currentWeek,
    };
  });

  const totalInvoices = weeks.reduce((sum, w) => sum + w.invoicesIssued, 0);
  const totalBilled = weeks.reduce((sum, w) => sum + w.totalBilled, 0);
  const highest = weeks.reduce((max, w) => (w.totalBilled > max.totalBilled ? w : max), weeks[0]);

  return (
    <>
      <PageHeader
        title="Weekly Billing History"
        description="Invoices, credits and collections week by week (Monday to Sunday)."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {WEEK_OPTIONS.map((option) => (
          <Link
            key={option}
            href={buildHref("/billing-history", {
              weeks: option === DEFAULT_WEEKS ? undefined : String(option),
            })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              option === weekCount
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700"
            }`}
          >
            Last {option} weeks
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={`Last ${weekCount} weeks`}
          value={totalInvoices.toLocaleString()}
          subtext="Invoices issued"
        />
        <StatCard
          label="Highest billing week"
          value={formatCurrency(highest.totalBilled)}
          subtext={highest.totalBilled > 0 ? highest.label : "No billing in this period"}
        />
        <StatCard
          label="Average weekly billing"
          value={formatCurrency(totalBilled / weekCount)}
          subtext={`Based on last ${weekCount} weeks`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Total billed (USD)" description="Weekly invoiced amount" />
          <div className="p-5">
            <BarChart
              data={weeks.map((w) => ({ label: w.short, value: w.totalBilled }))}
              color="#0b5e60"
              format="currency"
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Invoices issued" description="Weekly invoice count" />
          <div className="p-5">
            <LineChart
              data={weeks.map((w) => ({ label: w.short, value: w.invoicesIssued }))}
              color="#c8411e"
            />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Weekly billing summary" description={`Last ${weekCount} weeks, newest first`} />
        <ul className="divide-y divide-slate-100 md:hidden">
          {weeks
            .slice()
            .reverse()
            .map((w) => (
              <li key={w.start} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-800">{w.label}</p>
                  {w.inProgress ? (
                    <StatusBadge label="In progress" tone="info" />
                  ) : (
                    <StatusBadge label="Closed" tone="success" />
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    ["Invoices issued", String(w.invoicesIssued)],
                    ["Total billed", formatCurrency(w.totalBilled)],
                    ["Credits", w.credits !== 0 ? `(${formatCurrency(Math.abs(w.credits))})` : "—"],
                    ["Collected", formatCurrency(w.collected)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-slate-400">{label}</dt>
                      <dd className="mt-0.5 tabular-nums text-slate-700">{value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
        </ul>
        <div className="relative hidden overflow-x-auto md:block">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Week</th>
                <th className="px-5 py-3 text-right font-medium">Invoices issued</th>
                <th className="px-5 py-3 text-right font-medium">Total billed (USD)</th>
                <th className="px-5 py-3 text-right font-medium">Credits</th>
                <th className="px-5 py-3 text-right font-medium">Collected (USD)</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {weeks
                .slice()
                .reverse()
                .map((w) => (
                  <tr key={w.start} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3 text-slate-700">{w.label}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-500">{w.invoicesIssued}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-900">
                      {formatCurrency(w.totalBilled)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#d03b3b]">
                      {w.credits !== 0 ? `(${formatCurrency(Math.abs(w.credits))})` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-900">
                      {formatCurrency(w.collected)}
                    </td>
                    <td className="px-5 py-3">
                      {w.inProgress ? (
                        <StatusBadge label="In progress" tone="info" />
                      ) : (
                        <StatusBadge label="Closed" tone="success" />
                      )}
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
