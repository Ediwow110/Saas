"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        await signOut({ callbackUrl: "/login" });
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white disabled:opacity-60"
    >
      {isPending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-strong)]" />
      ) : (
        <LogOut className="h-4 w-4 text-[var(--accent-strong)]" />
      )}
      <span>{isPending ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
