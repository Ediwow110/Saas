import Link from "next/link";
import { createAppointment } from "@/app/actions/appointments";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export default async function NewAppointmentPage() {
  const user = await requireUser();
  const patients = await db.patient.findMany({
    where: { clinicId: user.clinicId },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
  });

  if (patients.length === 0) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-8 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Appointments</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Add a patient before booking</h2>
        <p className="mx-auto max-w-xl text-sm text-[var(--muted)]">Appointments inherit reminder consent from the patient profile, so create the patient record first.</p>
        <div>
          <Link href="/patients/new" className="inline-flex rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
            Create patient
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Appointments</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Book a new visit</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">Create the appointment once and ClinicFlow will queue the reminder jobs automatically.</p>
      </div>

      <form action={createAppointment} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Booking details</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Choose the patient, set the window, and capture the reason for the visit.</p>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Patient</span>
            <select name="patientId" required defaultValue="" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm">
              <option value="" disabled>
                Select a patient
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.lastName}, {patient.firstName}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Start time</span>
              <input name="startsAt" type="datetime-local" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>End time</span>
              <input name="endsAt" type="datetime-local" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Reason</span>
            <input name="reason" placeholder="Cleaning, consultation, follow-up" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
          </label>
        </div>

        <div className="space-y-6 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">What happens next</p>
            <p className="mt-1 text-sm text-[var(--muted)]">The save action will create the booking and schedule reminders based on patient consent.</p>
          </div>

          <div className="space-y-3 text-sm text-[var(--muted)]">
            <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-4 text-[var(--accent-strong)]">
              SMS reminders are queued one day and two hours before the visit when a mobile number is available.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4">
              Email reminders are queued one day before the visit when the patient opted in.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4">
              Overlapping bookings are blocked automatically so the calendar stays clean.
            </div>
          </div>

          <button type="submit" className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
            Save appointment
          </button>
        </div>
      </form>
    </section>
  );
}
