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
      ? "text-[#006300]"
      : deltaDirection === "down"
        ? "text-accent-700"
        : "text-slate-500";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {delta ? (
        <p className={`mt-1.5 text-xs font-semibold ${deltaColor}`}>
          {deltaDirection === "up" ? "↑" : deltaDirection === "down" ? "↓" : ""} {delta}
        </p>
      ) : null}
      {subtext ? <p className="mt-1 text-xs text-slate-400">{subtext}</p> : null}
    </div>
  );
}
