import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterBar } from "@/components/portal/ar/filter-bar";
import { Pagination } from "@/components/portal/ar/pagination";
import { TransactionTable } from "@/components/portal/ar/transaction-table";
import { listAllTransactions } from "@/lib/accounts-receivable";
import { matchesStatus, monthLabel, monthsInRange, toTransactionRow } from "@/lib/ar";
import {
  buildHref,
  paginate,
  param,
  resolvePeriod,
  todayIso,
  type SearchParams,
} from "@/lib/filters";
import { formatCurrency, formatDate } from "@/lib/format";

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "deposited", label: "Deposited" },
  { value: "undeposited", label: "Not deposited" },
  { value: "unapproved", label: "Pending approval" },
  { value: "voided", label: "Voided" },
];

export default async function PaymentHistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const today = todayIso();
  const period = resolvePeriod(sp, today, "6m");
  const requestedStatus = param(sp, "status") ?? "all";
  const status = STATUS_OPTIONS.some((o) => o.value === requestedStatus) ? requestedStatus : "all";
  const query = (param(sp, "q") ?? "").trim();
  const needle = query.toLowerCase();

  const payments = await listAllTransactions("payments", period.from, period.to);
  const rows = payments
    .map((tx) => toTransactionRow(tx, today))
    .filter(
      (row) =>
        matchesStatus(row.status, status) &&
        (!needle ||
          [row.documentNumber, row.memo ?? "", row.total.toFixed(2)].some((value) =>
            value.toLowerCase().includes(needle),
          )),
    );
  const { page, totalPages, start, end, pageItems } = paginate(rows, param(sp, "page"), PAGE_SIZE);

  const active = rows.filter((row) => row.status.key !== "voided");
  const totalPaid = active.reduce((sum, row) => sum + row.total, 0);
  const latest = active[0];

  const months = monthsInRange(period.from, period.to);
  const monthly = months.map((month) => {
    const inMonth = active.filter((row) => row.date.startsWith(month));
    return {
      label: monthLabel(month),
      amount: inMonth.reduce((sum, row) => sum + row.total, 0),
      count: inMonth.length,
    };
  });

  const currentQuery = {
    from: period.from,
    to: period.to,
    status: status === "all" ? undefined : status,
    q: query || undefined,
  };

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Payments received on your account and how they were applied."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total paid" value={formatCurrency(totalPaid)} subtext="In the selected period" />
        <StatCard label="Payments" value={active.length.toLocaleString()} subtext="Excludes voided payments" />
        <StatCard
          label="Average payment"
          value={formatCurrency(active.length ? totalPaid / active.length : 0)}
        />
        <StatCard
          label="Latest payment"
          value={latest ? formatCurrency(latest.total) : "—"}
          subtext={latest ? formatDate(latest.date) : "No payments in this period"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Paid amount (USD)" description="By month" />
          <div className="p-5">
            <LineChart
              data={monthly.map((m) => ({ label: m.label, value: m.amount }))}
              color="#0b5e60"
              format="currency"
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Number of payments" description="By month" />
          <div className="p-5">
            <BarChart data={monthly.map((m) => ({ label: m.label, value: m.count }))} color="#c8411e" />
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-6">
        <FilterBar
          action="/payment-history"
          period={period}
          statusOptions={STATUS_OPTIONS}
          status={status}
          searchPlaceholder="Payment #, memo or amount"
          search={query}
        />

        <Card>
          <CardHeader
            title="Payments"
            description={`${formatDate(period.from)} – ${formatDate(period.to)}`}
          />
          <TransactionTable
            rows={pageItems}
            numberHeader="Payment #"
            columns={[
              { header: "Date", render: (row) => formatDate(row.date) },
              {
                header: "Amount",
                align: "right",
                render: (row) => (
                  <span className="font-semibold text-slate-900">{formatCurrency(row.total)}</span>
                ),
              },
              { header: "Applied", align: "right", render: (row) => formatCurrency(row.paid ?? 0) },
              { header: "Unapplied", align: "right", render: (row) => formatCurrency(row.unpaid ?? 0) },
              {
                header: "Status",
                render: (row) => <StatusBadge label={row.status.label} tone={row.status.tone} />,
              },
            ]}
            emptyMessage="No payments match these filters."
            paidLabel="Applied"
            balanceLabel="Unapplied"
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            summary={`Showing ${start}–${end} of ${rows.length} payments`}
            hrefForPage={(target) =>
              buildHref("/payment-history", {
                ...currentQuery,
                page: target > 1 ? String(target) : undefined,
              })
            }
          />
        </Card>
      </div>
    </>
  );
}
