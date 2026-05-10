import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
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
  const successMessage = params?.created === "1" ? "Account created. Sign in to open your front-desk workspace." : undefined;
  const errorMessage = params?.error === "CredentialsSignin" ? "Incorrect email or password." : undefined;

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-[32px] border border-[var(--border)] bg-white/55 shadow-[0_30px_90px_rgba(31,41,55,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-[var(--bg-strong)] px-8 py-10 sm:px-12 sm:py-12">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">ClinicFlow</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Keep every appointment moving before it turns into a no-show.
            </h1>
            <p className="mt-4 max-w-lg text-base text-[var(--muted)]">
              One calm workspace for bookings, reminder follow-up, and front-desk decisions your team can scan in seconds.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/75 p-4">
              <p className="text-sm font-medium text-[var(--text)]">Daily calendar</p>
              <p className="mt-2 text-sm text-[var(--muted)]">View the full day without bouncing between tools.</p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4">
              <p className="text-sm font-medium text-[var(--text)]">Reminder health</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Catch failed SMS and email jobs before they pile up.</p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4">
              <p className="text-sm font-medium text-[var(--text)]">No-show reporting</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Turn missed visits into patterns your staff can actually act on.</p>
            </div>
          </div>
        </section>

        <section className="surface flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-white/85 p-8 shadow-[0_18px_60px_rgba(31,41,55,0.08)]">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Sign in</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Use your clinic account to open the shared front-desk workspace.</p>
            </div>

            <div className="mt-8">
              <LoginForm defaultEmail={defaultEmail} successMessage={successMessage} errorMessage={errorMessage} />
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Setting up a new clinic?{" "}
              <Link href="/signup" className="font-semibold text-[var(--accent-strong)]">
                Create the owner account here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
