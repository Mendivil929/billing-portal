import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterBar } from "@/components/portal/ar/filter-bar";
import { Pagination } from "@/components/portal/ar/pagination";
import { TransactionTable, type TransactionColumn } from "@/components/portal/ar/transaction-table";
import { listAllTransactions } from "@/lib/accounts-receivable";
import { matchesStatus, toTransactionRow, type TransactionRow } from "@/lib/ar";
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

const VIEWS = {
  invoices: {
    kind: "invoices",
    tab: "Invoices",
    noun: "invoices",
    numberHeader: "Invoice #",
    statusOptions: [
      { value: "all", label: "All statuses" },
      { value: "open", label: "Open (incl. overdue)" },
      { value: "overdue", label: "Overdue" },
      { value: "paid", label: "Paid" },
      { value: "voided", label: "Voided" },
    ],
  },
  credits: {
    kind: "credit-memos",
    tab: "Credit memos",
    noun: "credit memos",
    numberHeader: "Credit memo #",
    statusOptions: [
      { value: "all", label: "All statuses" },
      { value: "open", label: "Open" },
      { value: "applied", label: "Fully applied" },
      { value: "voided", label: "Voided" },
    ],
  },
} as const;

function matchesQuery(row: TransactionRow, query: string): boolean {
  const needle = query.toLowerCase();
  return [row.documentNumber, row.memo ?? "", row.total.toFixed(2)].some((value) =>
    value.toLowerCase().includes(needle),
  );
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const today = todayIso();
  const viewKey = param(sp, "type") === "credits" ? "credits" : "invoices";
  const view = VIEWS[viewKey];
  const period = resolvePeriod(sp, today, "6m");
  const requestedStatus = param(sp, "status") ?? "all";
  const status = view.statusOptions.some((o) => o.value === requestedStatus) ? requestedStatus : "all";
  const query = (param(sp, "q") ?? "").trim();

  const transactions = await listAllTransactions(view.kind, period.from, period.to);
  const rows = transactions
    .map((tx) => toTransactionRow(tx, today))
    .filter((row) => matchesStatus(row.status, status) && (!query || matchesQuery(row, query)));
  const { page, totalPages, start, end, pageItems } = paginate(rows, param(sp, "page"), PAGE_SIZE);

  const active = rows.filter((row) => row.status.key !== "voided");
  const totalAmount = active.reduce((sum, row) => sum + Math.abs(row.total), 0);
  const remaining = active.reduce((sum, row) => sum + (row.unpaid ?? 0), 0);

  const typeParam = viewKey === "credits" ? "credits" : undefined;
  const currentQuery = {
    type: typeParam,
    from: period.from,
    to: period.to,
    status: status === "all" ? undefined : status,
    q: query || undefined,
  };

  const columns: TransactionColumn[] =
    viewKey === "invoices"
      ? [
          { header: "Date", render: (row) => formatDate(row.date) },
          { header: "Due date", render: (row) => (row.dueDate ? formatDate(row.dueDate) : "—") },
          { header: "Amount", align: "right", render: (row) => formatCurrency(row.total) },
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
        ]
      : [
          { header: "Date", render: (row) => formatDate(row.date) },
          {
            header: "Credit amount",
            align: "right",
            render: (row) => (
              <span className="font-semibold text-slate-900">
                {formatCurrency(Math.abs(row.total))}
              </span>
            ),
          },
          { header: "Unapplied", align: "right", render: (row) => formatCurrency(row.unpaid ?? 0) },
          {
            header: "Status",
            render: (row) => <StatusBadge label={row.status.label} tone={row.status.tone} />,
          },
        ];

  return (
    <>
      <PageHeader
        title="Invoices & Credits"
        description="Invoices and credit memos issued to your account, straight from NetSuite."
      />

      <div className="mb-5 inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((key) => (
          <Link
            key={key}
            href={buildHref("/invoices", {
              type: key === "credits" ? "credits" : undefined,
              from: period.from,
              to: period.to,
            })}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              key === viewKey ? "bg-brand-600 text-white" : "text-slate-600 hover:text-brand-700"
            }`}
          >
            {VIEWS[key].tab}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={`Total ${view.noun}`} value={active.length.toLocaleString()} subtext="In the selected period" />
        <StatCard
          label={viewKey === "invoices" ? "Total billed" : "Total credited"}
          value={formatCurrency(totalAmount)}
          subtext="Excludes voided documents"
        />
        <StatCard
          label={viewKey === "invoices" ? "Open balance" : "Unapplied credit"}
          value={formatCurrency(remaining)}
          subtext={viewKey === "invoices" ? "Still pending payment" : "Available to apply"}
        />
      </div>

      <div className="mt-6 space-y-6">
        <FilterBar
          action="/invoices"
          period={period}
          keep={{ type: typeParam }}
          statusOptions={[...view.statusOptions]}
          status={status}
          searchPlaceholder="Document #, memo or amount"
          search={query}
        />

        <Card>
          <CardHeader
            title={view.tab}
            description={`${formatDate(period.from)} – ${formatDate(period.to)}`}
          />
          <TransactionTable
            rows={pageItems}
            numberHeader={view.numberHeader}
            columns={columns}
            emptyMessage={`No ${view.noun} match these filters.`}
            paidLabel={viewKey === "invoices" ? "Paid" : "Applied"}
            balanceLabel={viewKey === "invoices" ? "Balance due" : "Unapplied"}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            summary={`Showing ${start}–${end} of ${rows.length} ${view.noun}`}
            hrefForPage={(target) =>
              buildHref("/invoices", { ...currentQuery, page: target > 1 ? String(target) : undefined })
            }
          />
        </Card>
      </div>
    </>
  );
}
