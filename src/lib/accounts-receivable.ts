import "server-only";
import { cache } from "react";
import { apiFetch } from "@/lib/api-client";
import { requireSession } from "@/lib/auth";
import { getActiveCostCenter } from "@/lib/cost-center";
import { isOpenInvoice } from "@/lib/ar";
import type { ArKind, ArListResponse, ArTransaction } from "@/lib/types";

const MAX_PAGE_SIZE = 200;
const HISTORY_START = "2000-01-01";

async function fetchPage(
  kind: ArKind,
  from: string,
  to: string,
  page: number,
  pageSize: number,
): Promise<ArListResponse | null> {
  const [session, costCenter] = await Promise.all([requireSession(), getActiveCostCenter()]);
  if (!costCenter) return null;

  const query = new URLSearchParams({ from, to, page: String(page), pageSize: String(pageSize) });
  return apiFetch<ArListResponse>(`/api/v1/accounts-receivable/${kind}?${query}`, {
    token: session.token,
    headers: { "X-Cost-Center-Id": costCenter.id },
  });
}

// The backend answers 500 for pages past totalPages, so stop at totalPages.
export const listAllTransactions = cache(
  async (kind: ArKind, from: string, to: string): Promise<ArTransaction[]> => {
    const first = await fetchPage(kind, from, to, 1, MAX_PAGE_SIZE);
    if (!first) return [];

    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.pagination.totalPages - 1) }, (_, index) =>
        fetchPage(kind, from, to, index + 2, MAX_PAGE_SIZE),
      ),
    );

    return [first, ...rest]
      .flatMap((response) => response?.items ?? [])
      .sort(
        (a, b) =>
          b.transactionDate.localeCompare(a.transactionDate) || Number(b.id) - Number(a.id),
      );
  },
);

export function getInvoiceHistory(today: string): Promise<ArTransaction[]> {
  return listAllTransactions("invoices", HISTORY_START, today);
}

export async function getOpenInvoices(today: string): Promise<ArTransaction[]> {
  return (await getInvoiceHistory(today)).filter(isOpenInvoice);
}
