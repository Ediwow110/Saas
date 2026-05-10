"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Team page error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="clinic-card max-w-md rounded-[26px] px-8 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text)]">Team page failed to load</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {error.message || "Something went wrong while loading the team settings. Your data is safe."}
        </p>
        <button
          onClick={reset}
          className="btn-primary mx-auto mt-6 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
