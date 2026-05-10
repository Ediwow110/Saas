import { subDays } from "date-fns";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export default async function DashboardPage() {
  const user = await requireUser();
  const since = subDays(new Date(), 30);

  const [total, completed, noShows, failedReminders] = await Promise.all([
    db.appointment.count({ where: { clinicId: user.clinicId, startsAt: { gte: since } } }),
    db.appointment.count({ where: { clinicId: user.clinicId, startsAt: { gte: since }, status: "COMPLETED" } }),
    db.appointment.count({ where: { clinicId: user.clinicId, startsAt: { gte: since }, status: "NO_SHOW" } }),
    db.reminderJob.count({ where: { clinicId: user.clinicId, createdAt: { gte: since }, status: "FAILED" } }),
  ]);

  const noShowRate = total === 0 ? 0 : Math.round((noShows / total) * 100);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">No-show reporting</h1>
        <p className="text-sm text-slate-500">Last 30 days</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Appointments" value={total} />
        <MetricCard label="Completed" value={completed} />
        <MetricCard label="No-shows" value={noShows} />
        <MetricCard label="No-show rate" value={`${noShowRate}%`} />
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-700">Reminder health</p>
        <p className="mt-2 text-sm text-slate-500">{failedReminders} failed reminder jobs in the last 30 days.</p>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
