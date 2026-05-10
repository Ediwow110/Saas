"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";

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
          className="input-field"
          placeholder="you@clinic.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input-field pr-12"
            placeholder="Your password"
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

      {successMessage ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ {successMessage}
        </p>
      ) : null}
      {inlineError ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
          {inlineError}
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
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-sm text-[var(--muted)]">
        New clinic setup?{" "}
        <Link href="/signup" className="font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline">
          Create an owner account
        </Link>
      </p>
    </form>
  );
}
