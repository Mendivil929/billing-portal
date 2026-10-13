import { addDays, isIsoDate } from "@/lib/ar";

export type SearchParams = Record<string, string | string[] | undefined>;

export function param(searchParams: SearchParams, key: string): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

export const PERIOD_PRESETS = [
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "6m", label: "Last 6 months", days: 182 },
  { key: "12m", label: "Last 12 months", days: 365 },
  { key: "ytd", label: "This year", days: null },
] as const;

export type PeriodPresetKey = (typeof PERIOD_PRESETS)[number]["key"];

export interface Period {
  from: string;
  to: string;
  preset: PeriodPresetKey | null;
}

function presetRange(key: PeriodPresetKey, today: string): Period {
  const preset = PERIOD_PRESETS.find((p) => p.key === key)!;
  const from = preset.days === null ? `${today.slice(0, 4)}-01-01` : addDays(today, -preset.days);
  return { from, to: today, preset: key };
}

export function resolvePeriod(
  searchParams: SearchParams,
  today: string,
  fallback: PeriodPresetKey,
): Period {
  const from = param(searchParams, "from");
  const to = param(searchParams, "to");
  if (isIsoDate(from) && isIsoDate(to)) {
    const [start, end] = from <= to ? [from, to] : [to, from];
    const match = PERIOD_PRESETS.find((p) => {
      const range = presetRange(p.key, today);
      return range.from === start && range.to === end;
    });
    return { from: start, to: end, preset: match?.key ?? null };
  }

  const range = param(searchParams, "range");
  const preset = PERIOD_PRESETS.find((p) => p.key === range);
  return presetRange(preset?.key ?? fallback, today);
}

export function buildHref(path: string, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export function paginate<T>(items: T[], pageParam: string | undefined, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  return {
    page,
    totalPages,
    start: items.length === 0 ? 0 : (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, items.length),
    pageItems: items.slice((page - 1) * pageSize, page * pageSize),
  };
}
