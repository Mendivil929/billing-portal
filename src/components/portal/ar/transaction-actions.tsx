"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { PdfButton } from "@/components/portal/ar/pdf-button";
import { formatCurrency, formatDate } from "@/lib/format";
import type { TransactionRow } from "@/lib/ar";

export function TransactionActions({
  row,
  paidLabel,
  balanceLabel,
}: {
  row: TransactionRow;
  paidLabel: string;
  balanceLabel: string;
}) {
  const [open, setOpen] = useState(false);

  const details = [
    { label: "Date", value: formatDate(row.date) },
    row.dueDate ? { label: "Due date", value: formatDate(row.dueDate) } : null,
    { label: "Total", value: formatCurrency(row.total) },
    row.paid !== null ? { label: paidLabel, value: formatCurrency(row.paid) } : null,
    row.unpaid !== null ? { label: balanceLabel, value: formatCurrency(row.unpaid) } : null,
    {
      label: "Status",
      value: <StatusBadge label={row.status.label} tone={row.status.tone} />,
    },
  ].filter((detail) => detail !== null);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-brand-700 hover:underline"
      >
        Details
      </button>
      <PdfButton transactionId={row.id} fileName={row.documentNumber} />

      {open ? (
        <Modal title={row.documentNumber} onClose={() => setOpen(false)}>
          <dl className="space-y-3 text-sm">
            {details.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-900">{value}</dd>
              </div>
            ))}
            {row.memo ? (
              <div className="border-t border-slate-100 pt-3">
                <dt className="text-slate-500">Memo</dt>
                <dd className="mt-1 text-slate-800">{row.memo}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-4">
            <PdfButton transactionId={row.id} fileName={row.documentNumber} variant="button" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Close
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
