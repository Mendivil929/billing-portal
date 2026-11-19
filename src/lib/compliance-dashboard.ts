import "server-only";
import { cache } from "react";
import { requireSession } from "@/lib/auth";

// Temporary static ClicData links per client until the Finances API provides them.
// Clients are matched by name because these clients don't have API accounts yet.
const STATIC_DASHBOARDS = [
  { client: /legrand/i, url: "https://tecma.clicdata.com/v/AEcM6LhNPn40" },
];

export const getComplianceDashboardUrl = cache(async (): Promise<string | null> => {
  const { me } = await requireSession();
  const names = [
    me.client?.name,
    ...me.costCenters.flatMap((center) => [center.name, center.client.name]),
  ].filter((name): name is string => !!name);

  return STATIC_DASHBOARDS.find(({ client }) => names.some((name) => client.test(name)))?.url ?? null;
});
