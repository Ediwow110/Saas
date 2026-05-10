"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  CalendarDays,
  HeartPulse,
  Menu,
  ShieldCheck,
  UserRoundPlus,
  Users2,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  user: { name: string; email: string; role: string };
  navigation: NavItem[];
}

export function MobileNav({ user, navigation }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white/80 text-[var(--text)] transition hover:bg-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto rounded-r-[34px] border-r border-[var(--border)] bg-white/96 px-6 py-6 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--border)] bg-white/80 text-[var(--muted)] transition hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

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
        <div className="mt-6 overflow-hidden rounded-[22px] border border-white/70 bg-white/78 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-strong)]">
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

        {/* Nav links */}
        <nav className="mt-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-md shadow-teal-900/15"
                    : "text-[var(--text)] hover:bg-white/88"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-[16px] transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/72 text-[var(--accent-strong)] group-hover:bg-[var(--accent)] group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Focus hint */}
        <div className="mt-6 rounded-[22px] border border-dashed border-[var(--border)] bg-[var(--accent-wash)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]">
            <Activity className="h-4 w-4" />
            Today&apos;s focus
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Keep visits on time, verify reminder delivery, and surface care gaps before they become missed appointments.
          </p>
        </div>

        {/* Sign out */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
          >
            <LogOut className="h-4 w-4 text-[var(--accent-strong)]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
