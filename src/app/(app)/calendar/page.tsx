import Link from "next/link";
import { AlertTriangle, BellRing, CalendarClock } from "lucide-react";
import { endOfDay, format, startOfDay } from "date-fns";
import { AppointmentStatusForm } from "@/components/forms/appointment-status-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string | string[];
  }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const dateParam = Array.isArray(resolvedSearchParams?.date)
    ? resolvedSearchParams?.date[0]
    : resolvedSearchParams?.date;
  const parsedDate = dateParam ? new Date(dateParam) : new Date();
  const selected = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const appointments = await db.appointment.findMany({
    where: {
      clinicId: user.clinicId,
      startsAt: { gte: startOfDay(selected), lte: endOfDay(selected) },
    },
    include: { patient: true, reminders: true },
    orderBy: { startsAt: "asc" },
  });

  const reminderFailures = appointments.reduce(
    (total, appointment) => total + appointment.reminders.filter((reminder) => reminder.status === "FAILED").length,
    0,
  );
  const completedCount = appointments.filter((appointment) => appointment.status === "COMPLETED").length;

  return (
    <section className="space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Calendar</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Daily schedule</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{format(selected, "EEEE, MMMM d, yyyy")}</p>
          </div>
          <Link
            href="/appointments/new"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Book appointment
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricTile icon={CalendarClock} label="Appointments" value={appointments.length} detail="Scheduled for this day" />
          <MetricTile icon={BellRing} label="Completed" value={completedCount} detail="Marked done today" />
          <MetricTile icon={AlertTriangle} label="Reminder issues" value={reminderFailures} detail="Jobs that need review" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-white/80">
        {appointments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[var(--text)]">Nothing booked yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Add the first appointment for this day to start reminder tracking.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {appointments.map((appointment) => {
              const failedReminders = appointment.reminders.filter((reminder) => reminder.status === "FAILED").length;
              const sentReminders = appointment.reminders.filter((reminder) => reminder.status === "SENT").length;

              return (
                <li key={appointment.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[140px_1fr_220px] lg:items-center">
                  <div>
                    <p className="text-lg font-semibold text-[var(--text)]">{format(appointment.startsAt, "p")}</p>
                    <p className="text-sm text-[var(--muted)]">to {format(appointment.endsAt, "p")}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-[var(--text)]">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                        {appointment.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{appointment.reason || "General dental appointment"}</p>
                    <div className="mt-2 text-sm text-[var(--muted)]">
                      <p>{sentReminders} reminders sent</p>
                      <p className={failedReminders > 0 ? "mt-1 font-medium text-[var(--danger)]" : "mt-1 text-[var(--muted)]"}>
                        {failedReminders} failed jobs
                      </p>
                    </div>
                  </div>
                  <AppointmentStatusForm appointmentId={appointment.id} currentStatus={appointment.status} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text)]">{label}</p>
          <p className="text-xs text-[var(--muted)]">{detail}</p>
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}
