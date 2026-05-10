import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Building2, CheckCircle2, ClipboardCheck, UsersRound } from "lucide-react";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authOptions } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1520px] overflow-hidden rounded-[36px] border border-white/70 bg-white/48 shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="surface flex items-center justify-center px-6 py-10 sm:px-10 lg:order-2">
          <div className="w-full max-w-md rounded-[32px] border border-white/75 bg-white/88 p-8 shadow-[var(--shadow-card)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Owner setup</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Create your clinic workspace</h1>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Launch the owner account, then invite staff once your clinic profile and patient workflow are ready.</p>
            </div>

            <div className="mt-8">
              <SignUpForm />
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[var(--accent-strong)] underline decoration-[var(--accent-soft)] underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>
        </section>

        <section className="clinic-gradient px-8 py-10 sm:px-12 sm:py-12 lg:order-1">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] shadow-sm">
              <Building2 className="h-4 w-4" />
              Clinic onboarding made clean
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">ClinicFlow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
              Set up a clinical workspace that feels professional from day one.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Bring scheduling, consent-aware reminders, and patient follow-up into a polished interface designed for busy healthcare teams.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <StepCard icon={CheckCircle2} title="1. Create the owner account" copy="Start with the person responsible for clinic setup and team access." />
            <StepCard icon={UsersRound} title="2. Add patients and staff" copy="Keep key patient details, preferences, and roles organized from the beginning." />
            <StepCard icon={ClipboardCheck} title="3. Run the front desk" copy="Book visits, verify reminder delivery, and monitor no-show trends in one calm view." />
          </div>
        </section>
      </div>
    </div>
  );
}

function StepCard({ icon: Icon, title, copy }: { icon: typeof CheckCircle2; title: string; copy: string }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/72 p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
        </div>
      </div>
    </div>
  );
}
