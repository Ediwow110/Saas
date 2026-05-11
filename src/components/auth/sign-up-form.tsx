"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Building2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { createOwnerAccount, type SignUpState } from "@/app/actions/auth";

const initialState: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(createOwnerAccount, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form action={formAction} className="space-y-5" aria-describedby={state.error ? "signup-error" : undefined}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text)]" htmlFor="clinicName">
          Clinic name
        </label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="clinicName"
            name="clinicName"
            required
            className="input-field pl-10"
            placeholder="Downtown Dental Clinic"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text)]" htmlFor="name">
          Owner name
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="name"
            name="name"
            required
            className="input-field pl-10"
            placeholder="Dr. Jane Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text)]" htmlFor="email">
          Work email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input-field pl-10"
            placeholder="you@clinic.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text)]" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="input-field pl-10 pr-12"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text)]" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              className="input-field pl-10 pr-12"
              placeholder="Repeat password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {state.error ? (
        <p id="signup-error" className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className="btn-primary w-full" aria-busy={isPending}>
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating workspace...
          </>
        ) : (
          "Create owner account"
        )}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        Already have access?{" "}
        <Link href="/login" className="font-bold text-[var(--accent-strong)] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
