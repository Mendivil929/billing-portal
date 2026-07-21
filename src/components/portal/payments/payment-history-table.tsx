"use client";

import { useMemo, useState } from "react";
import type { Payment } from "@/lib/types";
import { Card, CardHeader } from "@/components/portal/card";
import { Select, TextField } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";

const METHOD_LABELS: Record<Payment["method"], string> = {
  ach: "ACH",
  credit_card: "Credit Card",
  wire: "Wire Transfer",
  check: "Check",
};

const PAGE_SIZE = 8;

export function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!query) return true;
      return (
        p.paymentNumber.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.appliedInvoices.some((inv) => inv.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query)
      );
    });
  }, [payments, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Card>
      <CardHeader title="Payment History" description="Complete visibility into past payments" />
      <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-5 sm:grid-cols-3 dark:border-slate-800">
        <div className="sm:col-span-2">
          <TextField
            label="Search"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by Payment ID, Customer, Invoice #, or Amount"
          />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">Payment ID</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Applied Invoices</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-5 py-3 font-medium text-teal-700 dark:text-teal-400">
                  {p.paymentNumber}
                </td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {formatDate(p.date)}
                </td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{p.customerName}</td>
                <td className="px-5 py-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {METHOD_LABELS[p.method]}
                </td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {p.appliedInvoices.join(", ")}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                  No payments match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
        <span className="text-xs text-slate-400">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} payments
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
  );
}
