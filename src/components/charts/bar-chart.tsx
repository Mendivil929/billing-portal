"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";

export interface BarChartPoint {
  label: string;
  value: number;
}

export function BarChart({
  data,
  color = "#0b5e60",
  format = "number",
  height = 192,
}: {
  data: BarChartPoint[];
  color?: string;
  format?: "number" | "currency";
  height?: number;
}) {
  const formatValue = format === "currency" ? formatCurrency : (v: number) => v.toLocaleString();
  const [hovered, setHovered] = useState<number | null>(null);
  // A floor of 4 keeps the five rounded ticks distinct for small counts.
  const max = Math.max(...data.map((d) => d.value), 4);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div>
      <div className="flex gap-3">
        <div
          className="flex flex-col justify-between text-right text-[11px] text-slate-400 tabular-nums"
          style={{ height }}
        >
          {ticks
            .slice()
            .reverse()
            .map((t, i) => (
              <span key={i}>{t.toLocaleString()}</span>
            ))}
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((_, i) => (
              <div key={i} className="border-t border-slate-100 dark:border-slate-800" />
            ))}
          </div>

          <div className="relative flex items-end gap-2" style={{ height }}>
            {data.map((d, i) => {
              const pct = (d.value / max) * 100;
              return (
                <div
                  key={d.label}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === i ? (
                    <div className="absolute -top-8 z-10 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-slate-700">
                      {formatValue(d.value)}
                    </div>
                  ) : null}
                  <div
                    className="w-full max-w-6 rounded-t-[4px] transition-[filter] group-hover:brightness-110"
                    style={{ height: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2 pl-11">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 truncate text-center text-[11px] text-slate-400"
          >
            {d.label}
          </span>
        ))}
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400">
          View as table
        </summary>
        <table className="mt-2 w-full text-left text-xs">
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-1 pr-3 text-slate-500">{d.label}</td>
                <td className="py-1 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                  {formatValue(d.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
