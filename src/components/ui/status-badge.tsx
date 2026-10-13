import type { StatusTone } from "@/lib/ar";

const TONES: Record<StatusTone, { dot: string; text: string; bg: string }> = {
  success: { dot: "bg-[#0ca30c]", text: "text-[#006300]", bg: "bg-[#0ca30c]/10" },
  info: { dot: "bg-brand-500", text: "text-brand-700", bg: "bg-brand-50" },
  warning: { dot: "bg-[#fab219]", text: "text-amber-800", bg: "bg-[#fab219]/15" },
  danger: { dot: "bg-[#d03b3b]", text: "text-[#d03b3b]", bg: "bg-[#d03b3b]/10" },
  neutral: { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100" },
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const config = TONES[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}
