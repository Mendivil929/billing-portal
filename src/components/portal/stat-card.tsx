export function StatCard({
  label,
  value,
  delta,
  deltaDirection,
  subtext,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  subtext?: string;
}) {
  const deltaColor =
    deltaDirection === "up"
      ? "text-[#006300] dark:text-[#0ca30c]"
      : deltaDirection === "down"
        ? "text-[#d03b3b]"
        : "text-slate-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
      {delta ? (
        <p className={`mt-1 text-xs font-medium ${deltaColor}`}>
          {deltaDirection === "up" ? "↑" : deltaDirection === "down" ? "↓" : ""} {delta}
        </p>
      ) : null}
      {subtext ? (
        <p className="mt-1 text-xs text-slate-400">{subtext}</p>
      ) : null}
    </div>
  );
}
