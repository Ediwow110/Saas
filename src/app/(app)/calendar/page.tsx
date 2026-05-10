import Link from "next/link";
import { AlertTriangle, BellRing, CalendarClock, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Plus } from "lucide-react";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { AppointmentStatusForm } from "@/components/forms/appointment-status-form";
import { DeleteAppointmentForm } from "@/components/forms/delete-appointment-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string | string[];
  }>;
};

function toDateParam(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const dateParam = Array.isArray(resolvedSearchParams?.date)
    ? resolvedSearchParams?.date[0]
    : resolvedSearchParams?.date;
  const parsedDate = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();
  const selected = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const previousDay = addDays(selected, -1);
  const nextDay = addDays(selected, 1);

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
  const pendingCount = appointments.filter((appointment) => appointment.status !== "COMPLETED" && appointment.status !== "NO_SHOW").length;

  return (
    <section className="space-y-6">
      <div className="clinic-gradient overflow-hidden rounded-[32px] border border-white/75 p-6 shadow-[var(--shadow-card)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
              <Clock3 className="h-4 w-4" />
              {format(selected, "EEEE, MMMM d, yyyy")}
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">Daily schedule</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              A calm clinical timeline for bookings, reminder delivery, patient status, and front-desk follow-up.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/calendar?date=${toDateParam(previousDay)}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-white"
            >
              Today
            </Link>
            <Link
              href={`/calendar?date=${toDateParam(nextDay)}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/appointments/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[var(--accent-strong)]"
            >
              <Plus className="h-4 w-4" />
              Book appointment
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile icon={CalendarClock} label="Appointments" value={appointments.length} detail="Scheduled today" />
          <MetricTile icon={CheckCircle2} label="Completed" value={completedCount} detail="Finished visits" />
          <MetricTile icon={BellRing} label="Pending" value={pendingCount} detail="Still in flow" />
          <MetricTile icon={AlertTriangle} label="Reminder issues" value={reminderFailures} detail="Needs review" danger={reminderFailures > 0} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/75 bg-white/82 shadow-[var(--shadow-card)]">
        {appointments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <CalendarClock className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xl font-semibold text-[var(--text)]">No appointments booked</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Add the first appointment for this day to start reminder tracking and keep the clinic schedule visible.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {appointments.map((appointment) => {
              const failedReminders = appointment.reminders.filter((reminder) => reminder.status === "FAILED").length;
              const sentReminders = appointment.reminders.filter((reminder) => reminder.status === "SENT").length;

              return (
                <li key={appointment.id} className="grid gap-5 px-6 py-5 transition hover:bg-[var(--accent-wash)]/55 xl:grid-cols-[150px_1fr_280px] xl:items-center">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white/72 p-4">
                    <p className="text-xl font-semibold tracking-tight text-[var(--text)]">{format(appointment.startsAt, "p")}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">to {format(appointment.endsAt, "p")}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                        {appointment.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{appointment.reason || "General dental appointment"}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                      <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-2">{sentReminders} reminders sent</span>
                      <span className={failedReminders > 0 ? "rounded-full bg-red-50 px-3 py-2 text-[var(--danger)]" : "rounded-full border border-[var(--border)] bg-white/72 px-3 py-2"}>
                        {failedReminders} failed jobs
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 xl:ml-auto xl:w-[280px]">
                    <AppointmentStatusForm appointmentId={appointment.id} currentStatus={appointment.status} />
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/appointments/${appointment.id}/edit`}
                        className="rounded-2xl border border-[var(--border)] bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-white"
                      >
                        Edit
                      </Link>
                      <DeleteAppointmentForm appointmentId={appointment.id} />
                    </div>
                  </div>
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
  danger = false,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: number;
  detail: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/72 px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={danger ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[var(--danger)]" : "flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]"}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
          <p className="text-xs text-[var(--muted)]">{detail}</p>
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}
