"use client";

import { selectCostCenter } from "@/app/(portal)/actions";

export interface CostCenterOption {
  id: string;
  name: string;
  code: string;
}

export function CostCenterSwitcher({
  costCenters,
  activeId,
}: {
  costCenters: CostCenterOption[];
  activeId: string | null;
}) {
  const active = costCenters.find((center) => center.id === activeId);
  if (!active) return null;

  return (
    <div className="mt-3 px-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Cost center
      </p>
      {costCenters.length > 1 ? (
        <form action={selectCostCenter}>
          <select
            name="costCenterId"
            defaultValue={active.id}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            aria-label="Cost center"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {costCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name} · {center.code}
              </option>
            ))}
          </select>
        </form>
      ) : (
        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
          {active.name} <span className="font-normal text-slate-400">· {active.code}</span>
        </p>
      )}
    </div>
  );
}
