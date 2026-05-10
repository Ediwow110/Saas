import Link from "next/link";
import { BarChart3, CalendarDays, UserRoundPlus, Users2 } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/current-user";

const navigation = [
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/patients", label: "Patients", icon: Users2 },
  { href: "/dashboard", label: "Reports", icon: BarChart3 },
  { href: "/patients/new", label: "Add patient", icon: UserRoundPlus },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] overflow-hidden rounded-[28px] border border-[var(--border)] bg-white/50 shadow-[0_30px_80px_rgba(31,41,55,0.08)] lg:grid-cols-[280px_1fr]">
        <aside className="surface border-b border-[var(--border)] px-6 py-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white">
              CF
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent)]">ClinicFlow</p>
              <p className="text-sm text-[var(--muted)]">Front-desk workspace</p>
            </div>
          </div>

          <div className="mt-8 rounded-[22px] border border-[var(--border)] bg-white/75 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-[var(--text)]">{user.name}</p>
                <p className="text-sm capitalize text-[var(--muted)]">{user.role.toLowerCase()} account</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">Signed in as {user.email}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white/80"
                >
                  <Icon className="h-4 w-4 text-[var(--accent-strong)]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[22px] border border-dashed border-[var(--border)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">
            Keep schedules clean, capture consent early, and check the report view before missed appointments become a pattern.
          </div>

          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="surface border-b border-[var(--border)] px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Operations</p>
                <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">Appointment follow-up and patient comms</h1>
              </div>
              <p className="text-sm text-[var(--muted)]">Calm workspace for booking, reminders, and no-show recovery.</p>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
