"use client";

import { useMemo, useState } from "react";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import { Select, TextField } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "invoice_ready", label: "Invoice Ready" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

const PAGE_SIZE = 10;

export function InvoicesExplorer({ invoices }: { invoices: Invoice[] }) {
  const cycles = useMemo(
    () => Array.from(new Set(invoices.map((i) => i.billingCycle))),
    [invoices],
  );

  const [cycle, setCycle] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      if (cycle !== "all" && invoice.billingCycle !== cycle) return false;
      if (status !== "all" && invoice.status !== (status as InvoiceStatus)) return false;
      if (dateFrom && invoice.invoiceDate < dateFrom) return false;
      if (dateTo && invoice.invoiceDate > dateTo) return false;
      return true;
    });
  }, [invoices, cycle, status, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalBilled = filtered.reduce((sum, i) => sum + i.amount, 0);
  const readyForReview = filtered.filter((i) => i.status === "invoice_ready").length;

  function applyFilters() {
    setPage(1);
  }

  function clearFilters() {
    setCycle("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <Card>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <Select label="Billing Cycle" value={cycle} onChange={setCycle}>
              <option value="all">All Cycles</option>
              {cycles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select label="Invoice Status" value={status} onChange={setStatus}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <TextField label="From" type="date" value={dateFrom} onChange={setDateFrom} />
            <TextField label="To" type="date" value={dateTo} onChange={setDateTo} />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              Apply
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Invoices"
            description={`Showing ${filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} invoices`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Invoice No.</th>
                  <th className="px-5 py-3 font-medium">Billing Cycle</th>
                  <th className="px-5 py-3 font-medium">Invoice Date</th>
                  <th className="px-5 py-3 font-medium">Due Date</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-3 font-medium text-teal-700 dark:text-teal-400">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {invoice.billingCycle}
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
                    <td className="px-5 py-3">
                      <div className="flex gap-3 text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setSelected(invoice)}
                          className="text-teal-700 hover:underline dark:text-teal-400"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelected(invoice)}
                          className="text-slate-500 hover:underline dark:text-slate-400"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                      No invoices match these filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <StatCard label="Total Invoices" value={filtered.length.toString()} />
        <StatCard label="Total Billed Amount" value={formatCurrency(totalBilled)} />
        <StatCard label="Ready for Review" value={readyForReview.toString()} />
      </div>

      {selected ? (
        <Modal title={selected.invoiceNumber} onClose={() => setSelected(null)}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Billing Cycle</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {selected.billingCycle}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Invoice Date</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(selected.invoiceDate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Due Date</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(selected.dueDate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(selected.amount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Balance Due</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(selected.balanceDue)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd>
                <StatusBadge status={selected.status} />
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
