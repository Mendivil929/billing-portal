import type { ArTransaction } from "@/lib/types";

export type StatusTone = "success" | "info" | "warning" | "danger" | "neutral";

export type ArStatusKey =
  | "open"
  | "partially_paid"
  | "overdue"
  | "paid"
  | "applied"
  | "deposited"
  | "undeposited"
  | "unapproved"
  | "voided"
  | "other";

export interface ArStatus {
  key: ArStatusKey;
  label: string;
  tone: StatusTone;
}

const STATUSES: Record<Exclude<ArStatusKey, "other">, ArStatus> = {
  open: { key: "open", label: "Open", tone: "info" },
  partially_paid: { key: "partially_paid", label: "Partially Paid", tone: "warning" },
  overdue: { key: "overdue", label: "Overdue", tone: "danger" },
  paid: { key: "paid", label: "Paid", tone: "success" },
  applied: { key: "applied", label: "Fully Applied", tone: "success" },
  deposited: { key: "deposited", label: "Deposited", tone: "success" },
  undeposited: { key: "undeposited", label: "Not Deposited", tone: "warning" },
  unapproved: { key: "unapproved", label: "Pending Approval", tone: "warning" },
  voided: { key: "voided", label: "Voided", tone: "neutral" },
};

export function isVoided(tx: ArTransaction): boolean {
  return tx.voided || tx.status.code === "V";
}

export function isOpenInvoice(tx: ArTransaction): boolean {
  return (
    tx.type === "CustInvc" &&
    !isVoided(tx) &&
    tx.status.code === "A" &&
    (tx.amounts.foreignUnpaid ?? 0) > 0
  );
}

export function getArStatus(tx: ArTransaction, today: string): ArStatus {
  if (isVoided(tx)) return STATUSES.voided;

  const code = tx.status.code;
  if (tx.type === "CustInvc") {
    if (code === "B") return STATUSES.paid;
    if (code === "A") {
      if (tx.dueDate && tx.dueDate < today) return STATUSES.overdue;
      return (tx.amounts.foreignPaid ?? 0) > 0 ? STATUSES.partially_paid : STATUSES.open;
    }
  }
  if (tx.type === "CustPymt") {
    if (code === "A") return STATUSES.unapproved;
    if (code === "B") return STATUSES.undeposited;
    if (code === "C") return STATUSES.deposited;
  }
  if (tx.type === "CustCred") {
    if (code === "A") return STATUSES.open;
    if (code === "B") return STATUSES.applied;
  }

  return {
    key: "other",
    label: tx.status.name.split(" : ").pop() ?? tx.status.name,
    tone: "neutral",
  };
}

export function matchesStatus(status: ArStatus, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "open") return ["open", "partially_paid", "overdue"].includes(status.key);
  return status.key === filter;
}

function toUtc(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function fromUtc(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

const DAY_MS = 86_400_000;

export function addDays(iso: string, days: number): string {
  return fromUtc(toUtc(iso) + days * DAY_MS);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

export function startOfWeek(iso: string): string {
  const weekday = new Date(toUtc(iso)).getUTCDay();
  return addDays(iso, -((weekday + 6) % 7));
}

export function monthsInRange(from: string, to: string): string[] {
  const months: string[] = [];
  let [year, month] = from.slice(0, 7).split("-").map(Number);
  const end = to.slice(0, 7);
  for (;;) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    if (key > end) break;
    months.push(key);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

export function isIsoDate(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toUtc(value));
}

export interface TransactionRow {
  id: string;
  documentNumber: string;
  date: string;
  dueDate: string | null;
  memo: string | null;
  total: number;
  paid: number | null;
  unpaid: number | null;
  status: ArStatus;
}

export function toTransactionRow(tx: ArTransaction, today: string): TransactionRow {
  return {
    id: tx.id,
    documentNumber: tx.documentNumber,
    date: tx.transactionDate,
    dueDate: tx.dueDate,
    memo: tx.memo,
    total: tx.amounts.foreignTotal,
    paid: tx.type === "CustInvc" ? tx.amounts.foreignPaid : tx.amounts.foreignPaymentUsed,
    unpaid: tx.type === "CustInvc" ? tx.amounts.foreignUnpaid : tx.amounts.foreignPaymentUnused,
    status: getArStatus(tx, today),
  };
}
