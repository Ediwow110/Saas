import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Activity, ArrowRight, CalendarCheck2, CheckCircle2, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    created?: string;
    email?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/calendar");
  }

  const params = searchParams ? await searchParams : undefined;
  const defaultEmail = typeof params?.email === "string" ? params.email : "";
  const successMessage = params?.created === "1" ? "Account created. Sign in to open your clinic workspace." : undefined;
  const errorMessage = params?.error === "CredentialsSignin" ? "Incorrect email or password." : undefined;

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1520px] overflow-hidden rounded-[36px] border border-white/70 bg-white/50 shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="clinic-gradient relative overflow-hidden px-7 py-9 sm:px-12 sm:py-12">
          <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute right-10 top-10 hidden h-28 w-28 rounded-full bg-white/70 blur-2xl lg:block" />
          <div className="absolute bottom-10 right-12 hidden w-72 rounded-[34px] border border-white/70 bg-white/52 p-4 shadow-[var(--shadow-card)] backdrop-blur xl:block">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Live queue</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">On track</span>
            </div>
            <div className="mt-4 space-y-3">
              <QueueItem name="A. Santos" detail="Cleaning · 9:30 AM" status="Confirmed" />
              <QueueItem name="M. Cruz" detail="Consult · 10:15 AM" status="Reminder sent" />
              <QueueItem name="J. Reyes" detail="Follow-up · 11:00 AM" status="Needs review" />
            </div>
          </div>

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-bold text-[var(--accent-strong)] shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Calm clinic operations, beautifully organized
            </div>
            <p className="mt-8 eyebrow">ClinicFlow</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[var(--text)] sm:text-6xl lg:text-7xl">
              A cleaner front desk for fewer missed appointments.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Give your team a focused command center for schedules, reminders, and follow-up work without the noisy admin clutter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary w-full sm:w-auto">
                Start clinic setup
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#login-form" className="btn-secondary w-full sm:w-auto">
                Sign in now
              </a>
            </div>
          </div>

          <div className="relative mt-12 grid gap-4 sm:grid-cols-3">
            <FeatureCard icon={CalendarCheck2} title="Smart schedule" copy="Scan every visit, status, and handoff in one calm day view." />
            <FeatureCard icon={MessageCircleHeart} title="Reminder clarity" copy="Catch sent, pending, and failed reminders before they cause no-shows." />
            <FeatureCard icon={Activity} title="Care rhythm" copy="Track completion patterns so the team knows the next best action." />
          </div>

          <div className="relative mt-12 rounded-[30px] border border-white/80 bg-white/72 p-5 shadow-[var(--shadow-card)] backdrop-blur">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--text)]">Today&apos;s clinic pulse</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Appointments, confirmations, and follow-ups stay visible.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Stat value="24" label="visits" />
                <Stat value="96%" label="sent" />
                <Stat value="3" label="review" />
              </div>
            </div>
          </div>
        </section>

        <section className="surface flex items-center justify-center px-5 py-10 sm:px-10">
          <div id="login-form" className="auth-card w-full max-w-md scroll-mt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Sign in</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Open your shared clinic workspace and continue managing today&apos;s patient flow.</p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] sm:flex">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8">
              <LoginForm defaultEmail={defaultEmail} successMessage={successMessage} errorMessage={errorMessage} />
            </div>

            <p className="mt-8 text-center text-sm text-[var(--muted)]">
              Setting up a new clinic?{" "}
              <Link href="/signup" className="font-bold text-[var(--accent-strong)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-[var(--accent-strong)]">
                Create the owner account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, copy }: { icon: typeof CalendarCheck2; title: string; copy: string }) {
  return (
    <div className="glass-panel rounded-[26px] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-bold text-[var(--text)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-[var(--accent-wash)] px-4 py-3 ring-1 ring-white/70">
      <p className="text-lg font-bold text-[var(--accent-strong)]">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
    </div>
  );
}

function QueueItem({ name, detail, status }: { name: string; detail: string; status: string }) {
  return (
    <div className="rounded-2xl bg-white/74 p-3 ring-1 ring-white/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--text)]">{name}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{detail}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-xs font-bold text-[var(--accent-strong)]">{status}</p>
    </div>
  );
}
