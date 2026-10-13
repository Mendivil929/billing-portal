import { TransactionActions } from "@/components/portal/ar/transaction-actions";
import type { TransactionRow } from "@/lib/ar";

export interface TransactionColumn<T extends TransactionRow = TransactionRow> {
  header: string;
  align?: "right";
  render: (row: T) => React.ReactNode;
}

export function TransactionTable<T extends TransactionRow>({
  rows,
  numberHeader,
  columns,
  emptyMessage,
  paidLabel = "Paid",
  balanceLabel = "Balance due",
}: {
  rows: T[];
  numberHeader: string;
  columns: TransactionColumn<T>[];
  emptyMessage: string;
  paidLabel?: string;
  balanceLabel?: string;
}) {
  const actions = (row: T) => (
    <TransactionActions
      row={{
        id: row.id,
        documentNumber: row.documentNumber,
        date: row.date,
        dueDate: row.dueDate,
        memo: row.memo,
        total: row.total,
        paid: row.paid,
        unpaid: row.unpaid,
        status: row.status,
      }}
      paidLabel={paidLabel}
      balanceLabel={balanceLabel}
    />
  );

  return (
    <>
      <ul className="divide-y divide-slate-100 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="px-5 py-4">
            <p className="font-semibold text-brand-700">{row.documentNumber}</p>
            {row.memo ? <p className="truncate text-xs text-slate-400">{row.memo}</p> : null}
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {columns.map((column) => (
                <div key={column.header} className="min-w-0">
                  <dt className="text-xs text-slate-400">{column.header}</dt>
                  <dd className="mt-0.5 tabular-nums text-slate-700">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 border-t border-slate-100 pt-3">{actions(row)}</div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="px-5 py-12 text-center text-sm text-slate-400">{emptyMessage}</li>
        ) : null}
      </ul>

      <div className="relative hidden overflow-x-auto md:block">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="px-5 py-3 font-medium">{numberHeader}</th>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-5 py-3 font-medium ${column.align === "right" ? "text-right" : ""}`}
                >
                  {column.header}
                </th>
              ))}
              <th className="px-5 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3">
                  <p className="font-semibold text-brand-700">{row.documentNumber}</p>
                  {row.memo ? (
                    <p className="max-w-56 truncate text-xs text-slate-400">{row.memo}</p>
                  ) : null}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-5 py-3 text-slate-600 ${column.align === "right" ? "text-right tabular-nums" : ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-5 py-3">{actions(row)}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-5 py-12 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
