import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Users2,
} from "lucide-react";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { AppointmentStatusForm } from "@/components/forms/appointment-status-form";
import { DeleteAppointmentForm } from "@/components/forms/delete-appointment-form";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Calendar",
};

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
    (total, appt) => total + appt.reminders.filter((r) => r.status === "FAILED").length,
    0,
  );
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pendingCount = appointments.filter((a) => a.status !== "COMPLETED" && a.status !== "NO_SHOW").length;

  return (
    <section className="page-enter space-y-6">
      <div className="clinic-gradient overflow-hidden rounded-[32px] border border-white/75 p-6 shadow-card sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
              <Clock3 className="h-4 w-4" />
              {format(selected, "EEEE, MMMM d, yyyy")}
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">Daily schedule</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Clinical timeline for bookings, reminder delivery, and patient status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/calendar?date=${toDateParam(previousDay)}`}
              className="btn-secondary gap-1 px-3 py-2.5"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Link>
            <Link
              href="/calendar"
              className="btn-secondary px-3 py-2.5"
            >
              Today
            </Link>
            <Link
              href={`/calendar?date=${toDateParam(nextDay)}`}
              className="btn-secondary gap-1 px-3 py-2.5"
              aria-label="Next day"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/appointments/new"
              className="btn-primary"
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
          <MetricTile
            icon={AlertTriangle}
            label="Reminder issues"
            value={reminderFailures}
            detail="Needs review"
            danger={reminderFailures > 0}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/75 bg-white/82 shadow-card">
        {appointments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={CalendarClock}
              title="No appointments booked"
              body="Add the first appointment for this day to start reminder tracking and keep the clinic schedule visible."
              action={
                <Link href="/appointments/new" className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Book first appointment
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]" role="list" aria-label="Appointments">
            {appointments.map((appointment) => {
              const failedCount = appointment.reminders.filter((r) => r.status === "FAILED").length;
              const sentCount = appointment.reminders.filter((r) => r.status === "SENT").length;

              return (
                <li
                  key={appointment.id}
                  className="grid gap-5 px-6 py-5 transition-colors hover:bg-[var(--accent-wash)] xl:grid-cols-[150px_1fr_280px] xl:items-center"
                >
                  {/* Time */}
                  <div className="rounded-[22px] border border-[var(--border)] bg-white/72 p-4">
                    <p className="text-xl font-semibold tracking-tight text-[var(--text)]">
                      {format(appointment.startsAt, "p")}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">to {format(appointment.endsAt, "p")}</p>
                  </div>

                  {/* Patient info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {appointment.reason || "General appointment"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-1.5 text-[var(--muted)]">
                        {sentCount} reminder{sentCount !== 1 ? "s" : ""} sent
                      </span>
                      {failedCount > 0 ? (
                        <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-600">
                          {failedCount} failed job{failedCount !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="rounded-full border border-[var(--border)] bg-white/72 px-3 py-1.5 text-[var(--muted)]">
                          No failures
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 xl:ml-auto xl:w-[280px]">
                    <AppointmentStatusForm
                      appointmentId={appointment.id}
                      currentStatus={appointment.status}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/appointments/${appointment.id}/edit`}
                        className="btn-secondary px-4 py-2 text-sm"
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "bg-emerald-100 text-emerald-700",
    NO_SHOW: "bg-rose-100 text-rose-700",
    SCHEDULED: "bg-sky-100 text-sky-700",
    CONFIRMED: "bg-teal-100 text-teal-700",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${cls}`}>
      {status.replace("_", " ")}
    </span>
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
    <div
      className={`rounded-[24px] border px-4 py-4 shadow-sm transition hover:shadow-md ${
        danger ? "border-rose-200 bg-rose-50" : "border-white/80 bg-white/72"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            danger ? "bg-rose-100 text-rose-600" : "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
          <p className="text-xs text-[var(--muted)]">{detail}</p>
        </div>
      </div>
      <p className={`mt-4 text-3xl font-semibold tracking-tight ${danger ? "text-rose-700" : "text-[var(--text)]"}`}>
        {value}
      </p>
    </div>
  );
}
