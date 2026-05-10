"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
    >
      <LogOut className="h-4 w-4 text-[var(--accent-strong)]" />
      <span>Sign out</span>
    </button>
  );
}
