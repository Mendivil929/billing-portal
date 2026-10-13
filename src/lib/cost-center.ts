import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import type { AuthCostCenter } from "@/lib/types";

export const COST_CENTER_COOKIE_NAME = "fcp_cost_center";

export const getCostCenters = cache(async (): Promise<AuthCostCenter[]> => {
  const session = await getSession();
  return session?.me.costCenters ?? [];
});

export const getActiveCostCenter = cache(async (): Promise<AuthCostCenter | null> => {
  const costCenters = await getCostCenters();
  const selectedId = (await cookies()).get(COST_CENTER_COOKIE_NAME)?.value;
  return costCenters.find((center) => center.id === selectedId) ?? costCenters[0] ?? null;
});
