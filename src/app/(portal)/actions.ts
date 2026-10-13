"use server";

import { cookies } from "next/headers";
import { COST_CENTER_COOKIE_NAME, getCostCenters } from "@/lib/cost-center";
import { isHttpsRequest } from "@/lib/session";

export async function selectCostCenter(formData: FormData) {
  const id = String(formData.get("costCenterId") ?? "");
  const costCenters = await getCostCenters();
  if (!costCenters.some((center) => center.id === id)) return;

  (await cookies()).set(COST_CENTER_COOKIE_NAME, id, {
    httpOnly: true,
    secure: await isHttpsRequest(),
    sameSite: "lax",
    path: "/",
  });
}
