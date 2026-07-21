export interface StackedBarSegment {
  label: string;
  value: number;
  color: string;
}

export function StackedBar({
  segments,
  formatValue = (v: number) => v.toLocaleString(),
}: {
  segments: StackedBarSegment[];
  formatValue?: (value: number) => string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div>
      <div className="flex h-7 gap-[2px] overflow-hidden rounded-md">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: ${formatValue(s.value)}`}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
            <span className="ml-auto font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {formatValue(s.value)}
            </span>
            <span className="w-12 text-right text-xs text-slate-400 tabular-nums">
              {((s.value / total) * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
