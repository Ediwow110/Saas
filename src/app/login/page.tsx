import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Activity, CalendarCheck2, MessageCircleHeart, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1520px] overflow-hidden rounded-[36px] border border-white/70 bg-white/48 shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)] lg:grid-cols-[1.12fr_0.88fr]">
        <section className="clinic-gradient relative overflow-hidden px-8 py-10 sm:px-12 sm:py-12">
          <div className="absolute right-10 top-10 hidden h-28 w-28 rounded-full bg-white/70 blur-2xl lg:block" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Built for calm clinic operations
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">ClinicFlow</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
              A modern front desk for fewer missed appointments.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Give your clinic a clean command center for daily schedules, patient reminders, and no-show recovery without the noisy admin clutter.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 sm:grid-cols-3">
            <FeatureCard icon={CalendarCheck2} title="Smart schedule" copy="See every visit, status, and patient handoff in one scannable day view." />
            <FeatureCard icon={MessageCircleHeart} title="Reminder clarity" copy="Spot sent and failed reminder jobs before they become attendance problems." />
            <FeatureCard icon={Activity} title="Care rhythm" copy="Track completion patterns and keep the team focused on the next best action." />
          </div>

          <div className="relative mt-12 rounded-[30px] border border-white/80 bg-white/72 p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Today&apos;s clinic pulse</p>
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

        <section className="surface flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md rounded-[32px] border border-white/75 bg-white/88 p-8 shadow-[var(--shadow-card)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Sign in</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Open your shared clinic workspace and continue managing today&apos;s patient flow.</p>
            </div>

            <div className="mt-8">
              <LoginForm defaultEmail={defaultEmail} successMessage={successMessage} errorMessage={errorMessage} />
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Setting up a new clinic?{" "}
              <Link href="/signup" className="font-semibold text-[var(--accent-strong)] underline decoration-[var(--accent-soft)] underline-offset-4">
                Create the owner account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, copy }: { icon: typeof CalendarCheck2; title: string; copy: string }) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/72 p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-[var(--accent-wash)] px-4 py-3">
      <p className="text-lg font-semibold text-[var(--accent-strong)]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
    </div>
  );
}
