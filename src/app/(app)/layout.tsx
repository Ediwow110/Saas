import Link from "next/link";
import {
  Activity,
  BarChart3,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  UserRoundPlus,
  Users2,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "@/components/ui/nav-link";
import { MobileNav } from "@/components/ui/mobile-nav";
import { PageHeader } from "@/components/ui/page-header";
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

  const userForClient = { name: user.name, email: user.email, role: user.role };

  return (
    <div className="min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1640px] overflow-hidden rounded-[34px] border border-white/70 bg-white/46 shadow-soft ring-1 ring-[var(--border)] lg:grid-cols-[292px_1fr]">
        {/* ── Desktop Sidebar ── */}
        <aside className="surface hidden border-r border-[var(--border)] px-6 py-6 lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[var(--accent)] text-white shadow-lg shadow-teal-900/10">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">ClinicFlow</p>
              <p className="text-sm text-[var(--muted)]">Care operations hub</p>
            </div>
          </div>

          {/* User card */}
          <div className="mt-8 overflow-hidden rounded-[22px] border border-white/70 bg-white/78 p-4 shadow-card">
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

          {/* Nav */}
          <nav className="mt-8 space-y-1.5" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </nav>

          {/* Focus hint */}
          <div className="mt-auto pt-8">
            <div className="rounded-[22px] border border-dashed border-[var(--border)] bg-[var(--accent-wash)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]">
                <Activity className="h-4 w-4" />
                Today&apos;s focus
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Keep visits on time, verify reminder delivery, and surface care gaps before they become missed appointments.
              </p>
            </div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="surface border-b border-[var(--border)] px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <PageHeader />
              <div className="flex items-center gap-3">
                <div className="hidden flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] xl:flex">
                  <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-1.5">HIPAA-minded</span>
                  <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-1.5">Fast front desk</span>
                </div>
                {/* Mobile hamburger */}
                <MobileNav user={userForClient} navigation={navigation} />
              </div>
            </div>
          </header>

          <main className="page-enter flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
