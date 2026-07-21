"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";

export interface LineChartPoint {
  label: string;
  value: number;
}

const VIEW_W = 600;
const VIEW_H = 200;
const TOP_PADDING = 16;

export function LineChart({
  data,
  color = "#2a78d6",
  format = "number",
  height = 200,
}: {
  data: LineChartPoint[];
  color?: string;
  format?: "number" | "currency";
  height?: number;
}) {
  const formatValue = format === "currency" ? formatCurrency : (v: number) => v.toLocaleString();
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const plotH = VIEW_H - TOP_PADDING;

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * VIEW_W : VIEW_W / 2;
    const y = TOP_PADDING + plotH - (d.value / max) * plotH;
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${VIEW_H} L ${points[0].x} ${VIEW_H} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const segmentWidth = VIEW_W / data.length;

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
            .map((t) => (
              <span key={t}>{t.toLocaleString()}</span>
            ))}
        </div>

        <div className="relative flex-1">
          {hovered !== null ? (
            <div
              className="pointer-events-none absolute -top-8 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-slate-700"
              style={{ left: `${(points[hovered].x / VIEW_W) * 100}%` }}
            >
              {formatValue(points[hovered].value)}
            </div>
          ) : null}

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            style={{ height, width: "100%" }}
          >
            {ticks.map((t, i) => {
              const y = TOP_PADDING + plotH - (t / max) * plotH;
              return (
                <line
                  key={i}
                  x1={0}
                  x2={VIEW_W}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={1}
                  className="text-slate-100 dark:text-slate-800"
                />
              );
            })}

            <path d={areaPath} fill={color} opacity={0.1} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {points.map((p, i) => (
              <circle
                key={p.label}
                cx={p.x}
                cy={p.y}
                r={hovered === i || i === points.length - 1 ? 4 : 0}
                fill={color}
                stroke="white"
                strokeWidth={2}
                className="dark:stroke-slate-900"
              />
            ))}

            {points.map((p, i) => (
              <rect
                key={`hit-${p.label}`}
                x={i * segmentWidth}
                y={0}
                width={segmentWidth}
                height={VIEW_H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-2 flex pl-11">
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
