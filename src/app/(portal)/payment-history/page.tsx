import { PageHeader } from "@/components/portal/page-header";
import { Card, CardHeader } from "@/components/portal/card";
import { StatCard } from "@/components/portal/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { PaymentHistoryTable } from "@/components/portal/payments/payment-history-table";
import { getPaymentHistoryStats, getPayments, getPaymentsTrend } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function PaymentHistoryPage() {
  const [payments, stats, trend] = await Promise.all([
    getPayments(),
    getPaymentHistoryStats(),
    getPaymentsTrend(),
  ]);

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Complete visibility into past payments, status, and applied invoices."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={formatCurrency(stats.totalPaidThisMonth)}
          delta={`${Math.abs(stats.totalPaidChangePct)}% vs last month`}
          deltaDirection={stats.totalPaidChangePct >= 0 ? "up" : "down"}
          subtext="This month"
        />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(stats.pendingAmount)}
          delta={`${Math.abs(stats.pendingChangePct)}% vs last month`}
          deltaDirection={stats.pendingChangePct >= 0 ? "up" : "down"}
          subtext={`${stats.pendingCount} payments`}
        />
        <StatCard
          label="Avg. Payment Time"
          value={`${stats.avgPaymentDays} days`}
          delta={`${Math.abs(stats.avgPaymentDaysChange)} days vs last month`}
          deltaDirection={stats.avgPaymentDaysChange <= 0 ? "up" : "down"}
          subtext="This month"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Paid Amount (USD)" description="Last 6 months" />
          <div className="p-5">
            <LineChart
              data={trend.map((t) => ({ label: t.label, value: t.paidAmount }))}
              color="#2a78d6"
              format="currency"
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Number of Payments" description="Last 6 months" />
          <div className="p-5">
            <BarChart
              data={trend.map((t) => ({ label: t.label, value: t.paymentCount }))}
              color="#4a3aa7"
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <PaymentHistoryTable payments={payments} />
      </div>
    </>
  );
}
