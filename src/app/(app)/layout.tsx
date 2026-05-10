import Link from "next/link";
import { requireUser } from "@/lib/current-user";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/calendar" className="font-semibold tracking-tight">ClinicFlow</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/calendar">Calendar</Link>
            <Link href="/patients">Patients</Link>
            <Link href="/dashboard">Reports</Link>
            {user.role === "OWNER" ? <Link href="/settings/team">Team</Link> : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
