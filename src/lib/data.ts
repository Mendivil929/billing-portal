import "server-only";
import { requireSession } from "@/lib/auth";
import { displayClientName, displayUserName } from "@/lib/client-name";
import type { CurrentCustomer } from "@/lib/types";

export async function getCurrentCustomer(): Promise<CurrentCustomer> {
  const session = await requireSession();
  const client = session.me.client ?? session.me.costCenters[0]?.client ?? null;

  return {
    name: client ? displayClientName(client) : displayUserName(session.me.user.displayName),
    accountNumber: client?.code ?? "—",
  };
}
