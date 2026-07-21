import type { InvoiceStatus, PaymentStatus } from "@/lib/types";

type Status = InvoiceStatus | PaymentStatus;

const STATUS_CONFIG: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  paid: { label: "Paid", dot: "bg-[#0ca30c]", text: "text-[#006300]", bg: "bg-[#0ca30c]/10" },
  completed: { label: "Completed", dot: "bg-[#0ca30c]", text: "text-[#006300]", bg: "bg-[#0ca30c]/10" },
  invoice_ready: { label: "Invoice Ready", dot: "bg-[#2a78d6]", text: "text-[#184f95]", bg: "bg-[#2a78d6]/10" },
  sent: { label: "Sent", dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100" },
  pending: { label: "Pending", dot: "bg-[#fab219]", text: "text-amber-800", bg: "bg-[#fab219]/15" },
  overdue: { label: "Overdue", dot: "bg-[#d03b3b]", text: "text-[#d03b3b]", bg: "bg-[#d03b3b]/10" },
  failed: { label: "Failed", dot: "bg-[#d03b3b]", text: "text-[#d03b3b]", bg: "bg-[#d03b3b]/10" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
