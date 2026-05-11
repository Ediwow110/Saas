import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, Building2, CheckCircle2, ClipboardCheck, ShieldCheck, UsersRound } from "lucide-react";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authOptions } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1520px] overflow-hidden rounded-[36px] border border-white/70 bg-white/50 shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="surface flex items-center justify-center px-5 py-10 sm:px-10 lg:order-2">
          <div className="auth-card w-full max-w-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Owner setup</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Create your clinic workspace</h1>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Launch the owner account, then invite staff once your clinic profile and patient workflow are ready.</p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] sm:flex">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--accent-wash)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">Setup takes under 2 minutes</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Use a real clinic email so reminders, staff invites, and schedule ownership stay connected.</p>
            </div>

            <div className="mt-8">
              <SignUpForm />
            </div>

            <p className="mt-8 text-center text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[var(--accent-strong)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-[var(--accent-strong)]">
                Sign in here
              </Link>
            </p>
          </div>
        </section>

        <section className="clinic-gradient relative overflow-hidden px-7 py-9 sm:px-12 sm:py-12 lg:order-1">
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-white/58 blur-3xl" />
          <div className="absolute right-10 top-10 hidden rounded-[32px] border border-white/70 bg-white/58 p-4 shadow-[var(--shadow-card)] backdrop-blur xl:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Workspace health</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniMetric value="3" label="steps" />
              <MiniMetric value="0" label="clutter" />
            </div>
          </div>

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-bold text-[var(--accent-strong)] shadow-sm backdrop-blur">
              <Building2 className="h-4 w-4" />
              Clinic onboarding made clean
            </div>
            <p className="mt-8 eyebrow">ClinicFlow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[var(--text)] sm:text-6xl lg:text-7xl">
              Set up a polished workspace from day one.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Bring scheduling, reminder visibility, and patient follow-up into a simple interface designed for busy healthcare teams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#clinicName" className="btn-primary w-full sm:w-auto">
                Create workspace
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/login" className="btn-secondary w-full sm:w-auto">
                I already have access
              </Link>
            </div>
          </div>

          <div className="relative mt-12 space-y-4">
            <StepCard icon={CheckCircle2} title="1. Create the owner account" copy="Start with the person responsible for clinic setup and team access." />
            <StepCard icon={UsersRound} title="2. Add patients and staff" copy="Keep patient details, preferences, and roles organized from the beginning." />
            <StepCard icon={ClipboardCheck} title="3. Run the front desk" copy="Book visits, verify reminders, and monitor no-show trends in one calm view." />
          </div>
        </section>
      </div>
    </main>
  );
}

function StepCard({ icon: Icon, title, copy }: { icon: typeof CheckCircle2; title: string; copy: string }) {
  return (
    <div className="glass-panel rounded-[28px] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text)]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/72 px-5 py-4 text-center ring-1 ring-white/70">
      <p className="text-2xl font-bold text-[var(--accent-strong)]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
    </div>
  );
}
