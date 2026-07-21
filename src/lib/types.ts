export type InvoiceStatus = "invoice_ready" | "sent" | "paid" | "overdue";

export type PaymentMethod = "ach" | "credit_card" | "wire" | "check";

export type PaymentStatus = "completed" | "pending" | "failed";

export interface CurrentCustomer {
  name: string;
  accountNumber: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  billingCycle: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balanceDue: number;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  customerName: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  appliedInvoices: string[];
  status: PaymentStatus;
}

export type AgingBucketKey = "0-15" | "16-30" | "31-45" | "46+";

export interface AgingByCustomer {
  customerName: string;
  buckets: Record<AgingBucketKey, number>;
  totalBalance: number;
}

export interface WeeklyBillingSummary {
  weekLabel: string;
  weekShort: string;
  invoicesIssued: number;
  totalBilled: number;
  creditsAdjustments: number;
  collected: number;
  status: "completed" | "in_progress";
}

export interface DashboardMetrics {
  openBalance: number;
  pastDue: number;
  totalInvoices: number;
  dueThisCycle: number;
}
