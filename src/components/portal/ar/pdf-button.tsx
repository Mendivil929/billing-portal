"use client";

import { useState } from "react";

const ERROR_MESSAGES: Record<number, string> = {
  404: "PDF not found",
  503: "PDF not available yet",
};

export function PdfButton({
  transactionId,
  fileName,
  variant = "link",
}: {
  transactionId: string;
  fileName: string;
  variant?: "link" | "button";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/${transactionId}/pdf`);
      if (!response.ok) {
        setError(ERROR_MESSAGES[response.status] ?? "Couldn't load the PDF");
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${fileName}.pdf`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setError("Couldn't load the PDF");
    } finally {
      setLoading(false);
    }
  }

  const className =
    variant === "button"
      ? "rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      : "text-xs font-semibold text-slate-500 hover:text-brand-700 hover:underline disabled:opacity-50";

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={download} disabled={loading} className={className}>
        {loading ? "Loading…" : variant === "button" ? "Download PDF" : "PDF"}
      </button>
      {error ? <span className="text-xs text-[#d03b3b]">{error}</span> : null}
    </span>
  );
}
