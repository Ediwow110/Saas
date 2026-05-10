import Link from "next/link";
import { Activity, BarChart3, CalendarDays, HeartPulse, ShieldCheck, UserRoundPlus, Users2 } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/current-user";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navigation = [
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/patients", label: "Patients", icon: Users2 },
    { href: "/dashboard", label: "Insights", icon: BarChart3 },
    { href: "/patients/new", label: "New patient", icon: UserRoundPlus },
    ...(user.role === "OWNER" ? [{ href: "/team", label: "Team access", icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1640px] overflow-hidden rounded-[34px] border border-white/70 bg-white/46 shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)] lg:grid-cols-[292px_1fr]">
        <aside className="surface border-b border-[var(--border)] px-6 py-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[var(--accent)] text-white shadow-lg shadow-teal-900/10">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">ClinicFlow</p>
              <p className="text-sm text-[var(--muted)]">Care operations hub</p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[26px] border border-white/70 bg-white/78 p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-strong)]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--text)]">{user.name}</p>
                <p className="text-sm capitalize text-[var(--muted)]">{user.role.toLowerCase()} account</p>
              </div>
            </div>
            <p className="mt-3 truncate rounded-2xl bg-[var(--accent-wash)] px-3 py-2 text-xs font-medium text-[var(--accent-strong)]">
              {user.email}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/88 hover:shadow-sm"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/72 text-[var(--accent-strong)] transition group-hover:bg-[var(--accent)] group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[26px] border border-dashed border-[var(--border)] bg-[var(--accent-wash)] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]">
              <Activity className="h-4 w-4" />
              Today&apos;s focus
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Keep visits on time, verify reminder delivery, and surface care gaps before they become missed appointments.
            </p>
          </div>

          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="surface border-b border-[var(--border)] px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Clinic command center</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">Appointments, patients, and reminder health</h1>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-2">HIPAA-minded UI</span>
                <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-2">Fast front desk</span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
