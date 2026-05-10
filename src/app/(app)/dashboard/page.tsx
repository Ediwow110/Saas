import type { Metadata } from "next";
import { AlertCircle, CalendarCheck2, CircleOff, TrendingUp } from "lucide-react";
import { subDays } from "date-fns";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Insights",
};

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
    <section className="page-enter space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">Reports · Last 30 days</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">No-show performance</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Appointment outcomes and reminder delivery health.</p>
          </div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              failedReminders > 0
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {failedReminders > 0 ? `⚠ ${failedReminders} reminder issues need attention` : "✓ Reminder delivery is steady"}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile icon={CalendarCheck2} label="Appointments" value={total} />
          <MetricTile icon={TrendingUp} label="Completion rate" value={`${completionRate}%`} highlight={completionRate >= 80} />
          <MetricTile icon={CircleOff} label="No-show rate" value={`${noShowRate}%`} danger={noShowRate >= 15} />
          <MetricTile icon={AlertCircle} label="Failed reminders" value={failedReminders} danger={failedReminders > 0} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Outcome mix</p>
              <p className="mt-1 text-sm text-[var(--muted)]">How well appointments are being retained.</p>
            </div>
            <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">30-day window</span>
          </div>

          <div className="mt-6 space-y-5">
            <OutcomeBar label="Completed" value={completed} total={total} tint="bg-emerald-500" />
            <OutcomeBar label="No-shows" value={noShows} total={total} tint="bg-amber-500" />
            <OutcomeBar label="Other statuses" value={Math.max(total - completed - noShows, 0)} total={total} tint="bg-slate-400" />
          </div>
        </div>

        <div className="rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <p className="text-sm font-semibold text-[var(--text)]">Suggested follow-up</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li
              className={`rounded-2xl px-4 py-3 ${
                noShowRate >= 15
                  ? "bg-amber-50 text-amber-800"
                  : "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
              }`}
            >
              {noShowRate >= 15
                ? "Consider calling high-risk patients the day before their visit."
                : "No-show rate is within a manageable range right now."}
            </li>
            <li className="rounded-2xl border border-[var(--border)] px-4 py-3 text-[var(--muted)]">
              {failedReminders > 0
                ? "Review phone numbers or email settings for failed reminder jobs."
                : "Reminder delivery is healthy — no failures in this window."}
            </li>
            <li className="rounded-2xl border border-[var(--border)] px-4 py-3 text-[var(--muted)]">
              {completed < total / 2
                ? "Completion looks low. Confirm tomorrow's schedule earlier in the day."
                : "Completion is strong. Keep confirmation habits consistent."}
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
  danger = false,
  highlight = false,
}: {
  icon: typeof CalendarCheck2;
  label: string;
  value: string | number;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border px-4 py-4 transition-all hover:shadow-sm ${
        danger
          ? "border-rose-200 bg-rose-50"
          : highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-[var(--border)] bg-white/70"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            danger
              ? "bg-rose-100 text-rose-600"
              : highlight
              ? "bg-emerald-100 text-emerald-600"
              : "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      </div>
      <p
        className={`mt-4 text-3xl font-semibold tracking-tight ${
          danger ? "text-rose-700" : highlight ? "text-emerald-700" : "text-[var(--text)]"
        }`}
      >
        {value}
      </p>
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
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--text)]">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-[var(--muted)]">{value} visits</span>
          <span className="w-10 text-right font-semibold text-[var(--text)]">{percentage}%</span>
        </div>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`bar-animate h-full rounded-full ${tint}`}
          style={{ "--bar-width": `${percentage}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
