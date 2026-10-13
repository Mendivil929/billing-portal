import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StackedBar } from "@/components/charts/stacked-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { TransactionTable } from "@/components/portal/ar/transaction-table";
import { getOpenInvoices } from "@/lib/accounts-receivable";
import { daysBetween, toTransactionRow, type TransactionRow } from "@/lib/ar";
import { buildHref, param, todayIso, type SearchParams } from "@/lib/filters";
import { formatCurrency, formatDate } from "@/lib/format";

const BUCKETS = [
  { key: "current", label: "Current", detail: "Not yet due", min: -Infinity, max: 0, color: "#a3d1d1" },
  { key: "1-15", label: "1–15 days", detail: "Past due", min: 1, max: 15, color: "#3d9899" },
  { key: "16-30", label: "16–30 days", detail: "Past due", min: 16, max: 30, color: "#0b5e60" },
  { key: "31-45", label: "31–45 days", detail: "Past due", min: 31, max: 45, color: "#ee5a2e" },
  { key: "46+", label: "46+ days", detail: "Past due", min: 46, max: Infinity, color: "#a83518" },
] as const;

type AgedRow = TransactionRow & { daysPastDue: number; bucket: (typeof BUCKETS)[number] };

export default async function AgingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const today = todayIso();
  const openInvoices = await getOpenInvoices(today);

  const aged: AgedRow[] = openInvoices
    .map((tx) => {
      const row = toTransactionRow(tx, today);
      const daysPastDue = row.dueDate ? daysBetween(row.dueDate, today) : 0;
      const bucket = BUCKETS.find((b) => daysPastDue >= b.min && daysPastDue <= b.max)!;
      return { ...row, daysPastDue, bucket };
    })
    .sort((a, b) => b.daysPastDue - a.daysPastDue);

  const totals = BUCKETS.map((bucket) => {
    const inBucket = aged.filter((row) => row.bucket.key === bucket.key);
    return {
      ...bucket,
      count: inBucket.length,
      amount: inBucket.reduce((sum, row) => sum + (row.unpaid ?? 0), 0),
    };
  });
  const grandTotal = totals.reduce((sum, bucket) => sum + bucket.amount, 0);

  const selectedKey = BUCKETS.find((b) => b.key === param(sp, "bucket"))?.key;
  const visible = selectedKey ? aged.filter((row) => row.bucket.key === selectedKey) : aged;
  const pastDue = grandTotal - totals[0].amount;

  return (
    <>
      <PageHeader
        title="Aging Summary"
        description={`Open balance by days past due, as of ${formatDate(today)}.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {totals.map((bucket) => (
          <Link
            key={bucket.key}
            href={buildHref("/aging", { bucket: selectedKey === bucket.key ? undefined : bucket.key })}
            className={`rounded-2xl border bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:border-brand-300 ${
              selectedKey === bucket.key ? "border-brand-600 ring-2 ring-brand-600/20" : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: bucket.color }} />
              <p className="text-sm font-semibold text-slate-500">{bucket.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(bucket.amount)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {bucket.count} invoice{bucket.count === 1 ? "" : "s"} ·{" "}
              {grandTotal ? Math.round((bucket.amount / grandTotal) * 100) : 0}% · {bucket.detail}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader title="Aging distribution" description={`Open balance ${formatCurrency(grandTotal)}`} />
          <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1fr_260px] lg:items-center 2xl:grid-cols-1">
            <StackedBar
              segments={totals.map((b) => ({ label: b.label, value: b.amount, color: b.color }))}
              formatValue={(value) => formatCurrency(value)}
            />
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="text-slate-500">Past due</p>
              <p className={`mt-1 text-xl font-bold ${pastDue > 0 ? "text-[#d03b3b]" : "text-slate-900"}`}>
                {formatCurrency(pastDue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="min-w-0">
          <CardHeader
            title={selectedKey ? `Open invoices · ${BUCKETS.find((b) => b.key === selectedKey)!.label}` : "Open invoices"}
            description="Click a bucket above to filter. Sorted by days past due."
            action={
              selectedKey ? (
                <Link href="/aging" className="text-xs font-semibold text-brand-700 hover:underline">
                  Show all
                </Link>
              ) : undefined
            }
          />
          <TransactionTable
            rows={visible}
            numberHeader="Invoice #"
            columns={[
              { header: "Due date", render: (row) => (row.dueDate ? formatDate(row.dueDate) : "—") },
              {
                header: "Days past due",
                align: "right",
                render: (row) => {
                  const days = row.daysPastDue;
                  return days > 0 ? (
                    <span className="font-semibold text-[#d03b3b]">{days}</span>
                  ) : (
                    <span className="text-slate-400">Due in {Math.abs(days)}d</span>
                  );
                },
              },
              {
                header: "Balance due",
                align: "right",
                render: (row) => (
                  <span className="font-semibold text-slate-900">{formatCurrency(row.unpaid ?? 0)}</span>
                ),
              },
              {
                header: "Status",
                render: (row) => <StatusBadge label={row.status.label} tone={row.status.tone} />,
              },
            ]}
            emptyMessage={
              aged.length === 0 ? "You have no open invoices. Nice!" : "No open invoices in this bucket."
            }
          />
        </Card>
      </div>
    </>
  );
}
