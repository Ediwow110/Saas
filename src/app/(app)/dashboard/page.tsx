import { AlertCircle, CalendarCheck2, CircleOff, TrendingUp } from "lucide-react";
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
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Reports</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">No-show performance</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Last 30 days of appointment outcomes and reminder delivery health.</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
            {failedReminders > 0 ? "Reminder issues need attention" : "Reminder delivery is steady"}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile icon={CalendarCheck2} label="Appointments" value={total} />
          <MetricTile icon={TrendingUp} label="Completion rate" value={`${completionRate}%`} />
          <MetricTile icon={CircleOff} label="No-show rate" value={`${noShowRate}%`} />
          <MetricTile icon={AlertCircle} label="Failed reminders" value={failedReminders} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Outcome mix</p>
              <p className="mt-1 text-sm text-[var(--muted)]">A quick read on how well appointments are being retained.</p>
            </div>
            <p className="text-sm text-[var(--muted)]">30-day window</p>
          </div>

          <div className="mt-6 space-y-5">
            <OutcomeBar label="Completed" value={completed} total={total} tint="bg-emerald-500" />
            <OutcomeBar label="No-shows" value={noShows} total={total} tint="bg-amber-500" />
            <OutcomeBar label="Other statuses" value={Math.max(total - completed - noShows, 0)} total={total} tint="bg-slate-400" />
          </div>
        </div>

        <div className="rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <p className="text-sm font-medium text-[var(--text)]">Suggested follow-up</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-[var(--accent-strong)]">
              {noShowRate >= 15
                ? "Consider calling high-risk patients the day before their visit."
                : "No-show rate is within a manageable range right now."}
            </li>
            <li className="rounded-2xl border border-[var(--border)] px-4 py-3">
              {failedReminders > 0
                ? "Review phone numbers or email settings for failed reminder jobs."
                : "Reminder delivery is healthy with no failures in the current window."}
            </li>
            <li className="rounded-2xl border border-[var(--border)] px-4 py-3">
              {completed < total / 2
                ? "Front-desk follow-through looks low. Confirm tomorrow's schedule earlier in the day."
                : "Completion is strong. Keep consent capture and confirmation habits consistent."}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarCheck2;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}

function OutcomeBar({
  label,
  value,
  total,
  tint,
}: {
  label: string;
  value: number;
  total: number;
  tint: string;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-[var(--text)]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${tint}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{percentage}% of tracked appointments</p>
    </div>
  );
}
