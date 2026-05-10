import Link from "next/link";
import { endOfDay, format, startOfDay } from "date-fns";
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily calendar</h1>
          <p className="text-sm text-slate-500">{format(selected, "EEEE, MMMM d, yyyy")}</p>
        </div>
        <Link href="/appointments/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Book appointment
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No appointments today.</div>
        ) : (
          <ul className="divide-y">
            {appointments.map((appointment) => {
              const failedReminders = appointment.reminders.filter((reminder) => reminder.status === "FAILED").length;
              const sentReminders = appointment.reminders.filter((reminder) => reminder.status === "SENT").length;

              return (
                <li key={appointment.id} className="grid gap-2 p-4 sm:grid-cols-[120px_1fr_160px] sm:items-center">
                  <div className="font-medium">{format(appointment.startsAt, "p")}</div>
                  <div>
                    <div className="font-medium">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </div>
                    <div className="text-sm text-slate-500">{appointment.reason || "Dental appointment"}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {sentReminders} sent reminders · {failedReminders} failed
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-xs font-medium text-slate-700">
                    {appointment.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
