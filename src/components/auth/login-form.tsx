"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-5"
      aria-describedby={inlineError ? "login-error" : successMessage ? "login-success" : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        setInlineError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        startTransition(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/calendar",
          });

          if (!result || result.error) {
            setInlineError("Incorrect email or password. Check your details and try again.");
            return;
          }

          router.push(result.url || "/calendar");
          router.refresh();
        });
      }}
    >
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
            defaultValue={defaultEmail}
            required
            className="input-field pl-10"
            placeholder="you@clinic.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-bold text-[var(--text)]" htmlFor="password">
            Password
          </label>
          <span className="text-xs font-semibold text-[var(--muted)]">Secure access</span>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input-field pl-10 pr-12"
            placeholder="Your password"
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

      {successMessage ? (
        <p id="login-success" className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </p>
      ) : null}
      {inlineError ? (
        <p id="login-error" className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">
          {inlineError}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className="btn-primary w-full" aria-busy={isPending}>
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in...
          </>
        ) : (
          "Sign in to workspace"
        )}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        New clinic setup?{" "}
        <Link href="/signup" className="font-bold text-[var(--accent-strong)] underline-offset-4 hover:underline">
          Create an owner account
        </Link>
      </p>
    </form>
  );
}
