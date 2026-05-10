"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createOwnerAccount, type SignUpState } from "@/app/actions/auth";

const initialState: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(createOwnerAccount, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          className="input-field"
          placeholder="Downtown Dental Clinic"
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
          className="input-field"
          placeholder="Dr. Jane Smith"
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
          className="input-field"
          placeholder="you@clinic.com"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              style={{ paddingRight: "3rem" }}
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-xl p-1 text-[var(--muted)] transition hover:text-[var(--accent-strong)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              style={{ paddingRight: "3rem" }}
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-xl p-1 text-[var(--muted)] transition hover:text-[var(--accent-strong)]"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating workspace...
          </>
        ) : (
          "Create owner account"
        )}
      </button>

      <p className="text-sm text-[var(--muted)]">
        Already have access?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
