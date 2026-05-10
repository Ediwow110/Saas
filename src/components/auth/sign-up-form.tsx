"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createOwnerAccount, type SignUpState } from "@/app/actions/auth";

const initialState: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(createOwnerAccount, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="clinicName">
          Clinic name
        </label>
        <input
          id="clinicName"
          name="clinicName"
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="name">
          Owner name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
          />
        </div>
      </div>

      {state.error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Creating workspace..." : "Create owner account"}
      </button>

      <p className="text-sm text-[var(--muted)]">
        Already have access?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent-strong)]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
