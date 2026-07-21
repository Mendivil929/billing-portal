"use client";

import { useState } from "react";
import type { Invoice, PaymentMethod } from "@/lib/types";
import { Card, CardHeader } from "@/components/portal/card";
import { formatCurrency, formatDate } from "@/lib/format";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: "ach", label: "ACH Transfer", description: "Bank-to-bank transfer" },
  { value: "credit_card", label: "Credit/Debit Card", description: "Secure card payment" },
  { value: "wire", label: "Wire Transfer", description: "Domestic or international" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PaymentsWorkflow({
  invoices,
  customerName,
  accountNumber,
}: {
  invoices: Invoice[];
  customerName: string;
  accountNumber: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [method, setMethod] = useState<PaymentMethod>("ach");
  const [fileName, setFileName] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState(today());
  const [amountOverride, setAmountOverride] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedInvoices = invoices.filter((i) => selectedIds.has(i.id));
  const totalSelected = selectedInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const amount = amountOverride ?? totalSelected.toFixed(2);

  function toggleInvoice(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAmountOverride(null);
  }

  function reset() {
    setSelectedIds(new Set());
    setMethod("ach");
    setFileName(null);
    setScheduleDate(today());
    setAmountOverride(null);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0ca30c]/10">
          <span className="text-2xl text-[#0ca30c]">✓</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Payment submitted
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {formatCurrency(Number(amount))} scheduled for {formatDate(scheduleDate)} via{" "}
          {PAYMENT_METHODS.find((m) => m.value === method)?.label}.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Make another payment
        </button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="1. Select Invoices to Pay"
            description={`Customer Account: ${accountNumber} – ${customerName}`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-5 py-3 font-medium">Invoice #</th>
                  <th className="px-5 py-3 font-medium">Invoice Date</th>
                  <th className="px-5 py-3 font-medium">Due Date</th>
                  <th className="px-5 py-3 font-medium">Amount (USD)</th>
                  <th className="px-5 py-3 font-medium">Balance Due (USD)</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(invoice.id)}
                        onChange={() => toggleInvoice(invoice.id)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-5 py-3 font-medium text-teal-700 dark:text-teal-400">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-5 py-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatCurrency(invoice.balanceDue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">
              {selectedIds.size} invoice{selectedIds.size === 1 ? "" : "s"} selected
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Total Balance Selected: {formatCurrency(totalSelected)}
            </span>
          </div>
        </Card>

        <Card>
          <CardHeader title="2. Select Payment Method" />
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  method === m.value
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {m.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader title="3. Remittance Upload" description="Optional" />
            <div className="p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {fileName ?? "Drag and drop files here or browse"}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  PDF, JPG, PNG (Max 10MB)
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>
          </Card>

          <Card>
            <CardHeader title="4. Schedule Payment" description="Optional" />
            <div className="p-5">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Payment Date
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="5. Submit Payment" description="Review details and submit your payment." />
          <div className="flex gap-3 p-5">
            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Review & Submit Payment
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Payment Summary" />
          <dl className="space-y-3 p-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Total Invoices Selected</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {selectedIds.size}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Total Balance Selected</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(totalSelected)}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-slate-500 dark:text-slate-400">Payment Amount (USD)</dt>
              <dd>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmountOverride(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Payment Date</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(scheduleDate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Currency</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">USD</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Need Help?</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Contact our support team for assistance with payments.
          </p>
          <button
            type="button"
            className="mt-3 text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Contact Support →
          </button>
        </Card>
      </div>
    </div>
  );
}
