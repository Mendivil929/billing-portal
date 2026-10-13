import Form from "next/form";
import Link from "next/link";
import { FieldLabel, fieldClassName } from "@/components/ui/field";
import { Card } from "@/components/portal/card";
import { PERIOD_PRESETS, buildHref, type Period } from "@/lib/filters";

export function FilterBar({
  action,
  period,
  keep = {},
  statusOptions,
  status = "all",
  searchPlaceholder,
  search = "",
}: {
  action: string;
  period: Period;
  keep?: Record<string, string | undefined>;
  statusOptions?: { value: string; label: string }[];
  status?: string;
  searchPlaceholder?: string;
  search?: string;
}) {
  return (
    <Card>
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 px-5 py-3">
        {PERIOD_PRESETS.map((preset) => {
          const active = period.preset === preset.key;
          return (
            <Link
              key={preset.key}
              href={buildHref(action, {
                ...keep,
                status: status === "all" ? undefined : status,
                q: search || undefined,
                range: preset.key,
              })}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {preset.label}
            </Link>
          );
        })}
      </div>

      <Form action={action} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr_auto]">
        {Object.entries(keep).map(([key, value]) =>
          value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
        <div>
          <FieldLabel>From</FieldLabel>
          <input type="date" name="from" defaultValue={period.from} className={fieldClassName} />
        </div>
        <div>
          <FieldLabel>To</FieldLabel>
          <input type="date" name="to" defaultValue={period.to} className={fieldClassName} />
        </div>
        {statusOptions ? (
          <div>
            <FieldLabel>Status</FieldLabel>
            <select name="status" defaultValue={status} className={fieldClassName}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {searchPlaceholder ? (
          <div>
            <FieldLabel>Search</FieldLabel>
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder={searchPlaceholder}
              className={fieldClassName}
            />
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <Link
            href={buildHref(action, keep)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Apply
          </button>
        </div>
      </Form>
    </Card>
  );
}
