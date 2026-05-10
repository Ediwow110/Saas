import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authOptions } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-[32px] border border-[var(--border)] bg-white/55 shadow-[0_30px_90px_rgba(31,41,55,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface flex items-center justify-center px-6 py-10 sm:px-10 lg:order-2">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-white/85 p-8 shadow-[0_18px_60px_rgba(31,41,55,0.08)]">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Owner setup</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Create your clinic workspace</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">Start with the clinic owner account. Staff accounts can follow once the workspace is live.</p>
            </div>

            <div className="mt-8">
              <SignUpForm />
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[var(--accent-strong)]">
                Sign in here
              </Link>
            </p>
          </div>
        </section>

        <section className="bg-[var(--bg-strong)] px-8 py-10 sm:px-12 sm:py-12 lg:order-1">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">ClinicFlow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Build a front-desk system your team can actually keep tidy.
            </h2>
            <p className="mt-4 max-w-lg text-base text-[var(--muted)]">
              Start with one owner account, capture patient consent early, and keep reminders visible before they affect revenue.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-sm font-medium text-[var(--text)]">1. Create the workspace</p>
              <p className="mt-2 text-sm text-[var(--muted)]">The owner account sets up the clinic and unlocks scheduling.</p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-sm font-medium text-[var(--text)]">2. Add patients and consent</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Store reminder preferences once so every booking inherits the right channel.</p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-sm font-medium text-[var(--text)]">3. Track no-shows early</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Use the report view to see where reminder or attendance habits are slipping.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
