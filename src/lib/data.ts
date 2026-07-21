import type {
  AgingByCustomer,
  CurrentCustomer,
  DashboardMetrics,
  Invoice,
  InvoiceStatus,
  Payment,
  WeeklyBillingSummary,
} from "@/lib/types";

/**
 * Static mock data standing in for the future NetSuite-backed API.
 * Every export below is `async` so callers already treat this as a network
 * boundary — swapping a function body for a real `fetch` later won't touch
 * any component code.
 */

const currentCustomer: CurrentCustomer = {
  name: "Acme Corporation",
  accountNumber: "100123",
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

const dashboardMetrics: DashboardMetrics = {
  openBalance: 125430.0,
  pastDue: 18760.0,
  totalInvoices: 24,
  dueThisCycle: 5,
};

// ---------------------------------------------------------------------------
// Invoices by Cycle (24 invoices, newest first)
// ---------------------------------------------------------------------------

const knownInvoices: Invoice[] = [
  { id: "inv-567", invoiceNumber: "INV-2024-000567", customerName: "Acme Corporation", billingCycle: "Jun 2024", invoiceDate: "2024-06-25", dueDate: "2024-07-15", amount: 12450.0, balanceDue: 12450.0, status: "invoice_ready" },
  { id: "inv-566", invoiceNumber: "INV-2024-000566", customerName: "Acme Corporation", billingCycle: "May 2024", invoiceDate: "2024-05-25", dueDate: "2024-06-14", amount: 11230.75, balanceDue: 0, status: "paid" },
  { id: "inv-565", invoiceNumber: "INV-2024-000565", customerName: "Acme Corporation", billingCycle: "Apr 2024", invoiceDate: "2024-04-25", dueDate: "2024-05-15", amount: 10987.2, balanceDue: 0, status: "paid" },
  { id: "inv-564", invoiceNumber: "INV-2024-000564", customerName: "Acme Corporation", billingCycle: "Mar 2024", invoiceDate: "2024-03-25", dueDate: "2024-04-15", amount: 9875.5, balanceDue: 0, status: "paid" },
  { id: "inv-563", invoiceNumber: "INV-2024-000563", customerName: "Acme Corporation", billingCycle: "Feb 2024", invoiceDate: "2024-02-25", dueDate: "2024-03-15", amount: 8760.3, balanceDue: 8760.3, status: "overdue" },
  { id: "inv-562", invoiceNumber: "INV-2024-000562", customerName: "Acme Corporation", billingCycle: "Jan 2024", invoiceDate: "2024-01-25", dueDate: "2024-02-14", amount: 8430.0, balanceDue: 0, status: "paid" },
];

const olderCycleLabels = [
  "Dec 2023", "Nov 2023", "Oct 2023", "Sep 2023", "Aug 2023", "Jul 2023",
  "Jun 2023", "May 2023", "Apr 2023", "Mar 2023", "Feb 2023", "Jan 2023",
  "Dec 2022", "Nov 2022", "Oct 2022", "Sep 2022", "Aug 2022", "Jul 2022",
];

const olderReadyIndexes = new Set([0, 6, 12]);

const olderInvoices: Invoice[] = olderCycleLabels.map((cycle, i) => {
  const invoiceNumber = 561 - i;
  const [monthName, year] = cycle.split(" ");
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const invoiceDate = new Date(Number(year), monthIndex, 25);
  const dueDate = new Date(Number(year), monthIndex + 1, 14);
  const amount = 7800 + ((i * 431) % 4200);
  const status: InvoiceStatus = olderReadyIndexes.has(i) ? "invoice_ready" : "paid";

  return {
    id: `inv-${invoiceNumber}`,
    invoiceNumber: `INV-${year}-${String(invoiceNumber).padStart(6, "0")}`,
    customerName: "Acme Corporation",
    billingCycle: cycle,
    invoiceDate: invoiceDate.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    amount,
    balanceDue: status === "invoice_ready" ? amount : 0,
    status,
  };
});

const invoices: Invoice[] = [...knownInvoices, ...olderInvoices];

// ---------------------------------------------------------------------------
// Payments module — open invoices for the current customer account
// ---------------------------------------------------------------------------

const payableInvoices: Invoice[] = [
  { id: "pay-inv-567", invoiceNumber: "INV-2024-000567", customerName: "Acme Corporation", billingCycle: "May 2024", invoiceDate: "2024-05-01", dueDate: "2024-05-31", amount: 5200.0, balanceDue: 5200.0, status: "sent" },
  { id: "pay-inv-568", invoiceNumber: "INV-2024-000568", customerName: "Acme Corporation", billingCycle: "May 2024", invoiceDate: "2024-05-10", dueDate: "2024-06-09", amount: 3450.0, balanceDue: 3450.0, status: "sent" },
  { id: "pay-inv-569", invoiceNumber: "INV-2024-000569", customerName: "Acme Corporation", billingCycle: "May 2024", invoiceDate: "2024-05-20", dueDate: "2024-06-19", amount: 2150.0, balanceDue: 2150.0, status: "sent" },
];

// ---------------------------------------------------------------------------
// Payment History
// ---------------------------------------------------------------------------

const payments: Payment[] = [
  { id: "pay-987", paymentNumber: "PAY-000987", customerName: "Acme Corporation", date: "2025-05-14", amount: 12450.0, method: "ach", appliedInvoices: ["INV-10456", "INV-10457"], status: "completed" },
  { id: "pay-986", paymentNumber: "PAY-000986", customerName: "Global Industries", date: "2025-05-12", amount: 8900.0, method: "credit_card", appliedInvoices: ["INV-10454"], status: "completed" },
  { id: "pay-985", paymentNumber: "PAY-000985", customerName: "Summit Partners", date: "2025-05-09", amount: 5200.0, method: "ach", appliedInvoices: ["INV-10453"], status: "completed" },
  { id: "pay-984", paymentNumber: "PAY-000984", customerName: "Northwind Traders", date: "2025-05-06", amount: 3750.0, method: "wire", appliedInvoices: ["INV-10452"], status: "completed" },
  { id: "pay-983", paymentNumber: "PAY-000983", customerName: "Bright Future LLC", date: "2025-05-02", amount: 2150.0, method: "credit_card", appliedInvoices: ["INV-10451"], status: "completed" },
  { id: "pay-982", paymentNumber: "PAY-000982", customerName: "Delta Solutions", date: "2025-04-30", amount: 7600.0, method: "ach", appliedInvoices: ["INV-10449", "INV-10450"], status: "pending" },
  { id: "pay-981", paymentNumber: "PAY-000981", customerName: "Innovate Co.", date: "2025-04-28", amount: 4300.0, method: "check", appliedInvoices: ["INV-10448"], status: "pending" },
  { id: "pay-980", paymentNumber: "PAY-000980", customerName: "Blue Horizon Inc.", date: "2025-04-25", amount: 6120.0, method: "ach", appliedInvoices: ["INV-10446", "INV-10447"], status: "failed" },
];

export interface PaymentHistoryStats {
  totalPaidThisMonth: number;
  totalPaidChangePct: number;
  pendingAmount: number;
  pendingCount: number;
  pendingChangePct: number;
  avgPaymentDays: number;
  avgPaymentDaysChange: number;
}

const paymentHistoryStats: PaymentHistoryStats = {
  totalPaidThisMonth: 186450.0,
  totalPaidChangePct: 12.4,
  pendingAmount: 18070.0,
  pendingCount: 3,
  pendingChangePct: -8.1,
  avgPaymentDays: 18.6,
  avgPaymentDaysChange: -2.3,
};

export interface PaymentsTrendPoint {
  label: string;
  paidAmount: number;
  paymentCount: number;
}

const paymentsTrend: PaymentsTrendPoint[] = [
  { label: "Dec 2024", paidAmount: 34500, paymentCount: 44 },
  { label: "Jan 2025", paidAmount: 48200, paymentCount: 63 },
  { label: "Feb 2025", paidAmount: 31800, paymentCount: 39 },
  { label: "Mar 2025", paidAmount: 38900, paymentCount: 47 },
  { label: "Apr 2025", paidAmount: 29700, paymentCount: 34 },
  { label: "May 2025", paidAmount: 52300, paymentCount: 71 },
];

// ---------------------------------------------------------------------------
// Accounts Receivable Aging
// ---------------------------------------------------------------------------

const agingByCustomer: AgingByCustomer[] = [
  { customerName: "Alpha Retail Inc.", buckets: { "0-15": 18450, "16-30": 12300, "31-45": 8150, "46+": 32600 }, totalBalance: 71500 },
  { customerName: "BrightWorks LLC", buckets: { "0-15": 22780, "16-30": 15640, "31-45": 9210, "46+": 45120 }, totalBalance: 92750 },
  { customerName: "Coastal Supplies Co.", buckets: { "0-15": 9650, "16-30": 6820, "31-45": 4230, "46+": 28460 }, totalBalance: 49160 },
  { customerName: "Delta Manufacturing", buckets: { "0-15": 31120, "16-30": 20340, "31-45": 12980, "46+": 67310 }, totalBalance: 131750 },
  { customerName: "Evergreen Services", buckets: { "0-15": 14230, "16-30": 9190, "31-45": 5840, "46+": 31780 }, totalBalance: 61040 },
  { customerName: "Global Components", buckets: { "0-15": 29200, "16-30": 18000, "31-45": 8000, "46+": 64600 }, totalBalance: 119800 },
  { customerName: "Harbor Solutions", buckets: { "0-15": 0, "16-30": 4000, "31-45": 1000, "46+": 0 }, totalBalance: 5000 },
  { customerName: "Summit Partners", buckets: { "0-15": 0, "16-30": 0, "31-45": 13000, "46+": 0 }, totalBalance: 13000 },
];

// ---------------------------------------------------------------------------
// Weekly Billing History (last 8 weeks)
// ---------------------------------------------------------------------------

const weeklyBillingHistory: WeeklyBillingSummary[] = [
  { weekLabel: "Apr 21 – Apr 27, 2025 (Week 17)", weekShort: "Apr 21", invoicesIssued: 122, totalBilled: 145150, creditsAdjustments: -3480, collected: 141670, status: "completed" },
  { weekLabel: "Apr 28 – May 4, 2025 (Week 18)", weekShort: "Apr 28", invoicesIssued: 138, totalBilled: 155270, creditsAdjustments: -4120, collected: 151150, status: "completed" },
  { weekLabel: "May 5 – May 11, 2025 (Week 19)", weekShort: "May 5", invoicesIssued: 152, totalBilled: 168040, creditsAdjustments: -4990, collected: 163050, status: "completed" },
  { weekLabel: "May 12 – May 18, 2025 (Week 20)", weekShort: "May 12", invoicesIssued: 165, totalBilled: 189750, creditsAdjustments: -6230, collected: 183520, status: "completed" },
  { weekLabel: "May 19 – May 25, 2025 (Week 21)", weekShort: "May 19", invoicesIssued: 187, totalBilled: 211340, creditsAdjustments: -7850, collected: 203490, status: "completed" },
  { weekLabel: "May 26 – Jun 1, 2025 (Week 22)", weekShort: "May 26", invoicesIssued: 176, totalBilled: 179620, creditsAdjustments: -5210, collected: 174410, status: "completed" },
  { weekLabel: "Jun 2 – Jun 8, 2025 (Week 23)", weekShort: "Jun 2", invoicesIssued: 198, totalBilled: 201430, creditsAdjustments: -6110, collected: 195320, status: "completed" },
  { weekLabel: "Jun 9 – Jun 15, 2025 (Week 24)", weekShort: "Jun 9", invoicesIssued: 214, totalBilled: 227850, creditsAdjustments: -8320, collected: 219530, status: "completed" },
];

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export async function getCurrentCustomer(): Promise<CurrentCustomer> {
  return currentCustomer;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return dashboardMetrics;
}

export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  return invoices.slice(0, limit);
}

export async function getInvoices(): Promise<Invoice[]> {
  return invoices;
}

export async function getPayableInvoices(): Promise<Invoice[]> {
  return payableInvoices;
}

export async function getPayments(): Promise<Payment[]> {
  return payments;
}

export async function getPaymentHistoryStats(): Promise<PaymentHistoryStats> {
  return paymentHistoryStats;
}

export async function getPaymentsTrend(): Promise<PaymentsTrendPoint[]> {
  return paymentsTrend;
}

export async function getAgingByCustomer(): Promise<AgingByCustomer[]> {
  return agingByCustomer;
}

export async function getWeeklyBillingHistory(): Promise<WeeklyBillingSummary[]> {
  return weeklyBillingHistory;
}
