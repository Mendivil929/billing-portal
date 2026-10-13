import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  summary,
  hrefForPage,
}: {
  page: number;
  totalPages: number;
  summary: string;
  hrefForPage: (page: number) => string;
}) {
  const linkClass =
    "rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50";
  const disabledClass =
    "pointer-events-none rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-300";

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
      <span className="text-xs text-slate-500">{summary}</span>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-slate-400 sm:inline">
          Page {page} of {totalPages}
        </span>
        {page > 1 ? (
          <Link href={hrefForPage(page - 1)} className={linkClass}>
            Previous
          </Link>
        ) : (
          <span className={disabledClass}>Previous</span>
        )}
        {page < totalPages ? (
          <Link href={hrefForPage(page + 1)} className={linkClass}>
            Next
          </Link>
        ) : (
          <span className={disabledClass}>Next</span>
        )}
      </div>
    </div>
  );
}
