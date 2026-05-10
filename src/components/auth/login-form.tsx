"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

export function LoginForm({
  defaultEmail = "",
  successMessage,
  errorMessage,
}: {
  defaultEmail?: string;
  successMessage?: string;
  errorMessage?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inlineError, setInlineError] = useState<string | undefined>(errorMessage);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setInlineError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        startTransition(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/calendar",
          });

          if (!result || result.error) {
            setInlineError("Incorrect email or password.");
            return;
          }

          router.push(result.url || "/calendar");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
        />
      </div>

      {successMessage ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}
      {inlineError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{inlineError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm text-[var(--muted)]">
        New clinic setup?{" "}
        <Link href="/signup" className="font-semibold text-[var(--accent-strong)]">
          Create an owner account
        </Link>
      </p>
    </form>
  );
}
