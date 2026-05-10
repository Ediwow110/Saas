"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function CalendarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-enter flex flex-col items-center justify-center rounded-[26px] border border-rose-200 bg-rose-50 px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[26px] bg-rose-100 text-rose-600">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-rose-900">Calendar failed to load</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-rose-700">
        {error.message || "Could not load appointment data. Please try again."}
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
