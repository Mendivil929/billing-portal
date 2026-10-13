"use client";

import { OfficeBackground } from "@/components/brand/office-background";
import { TecmaLogo } from "@/components/brand/tecma-logo";

export default function ErrorPage({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-4">
      <OfficeBackground />
      <div className="w-full max-w-md rounded-2xl bg-white px-10 py-9 text-center shadow-2xl shadow-black/20">
        <TecmaLogo className="mx-auto h-11 w-auto" />
        <h1 className="mt-6 text-xl font-bold text-slate-900">Service temporarily unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">
          We couldn&apos;t reach the portal services. Your session is safe — please try again in a
          moment.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-7 w-full rounded-lg bg-accent-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-accent-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
