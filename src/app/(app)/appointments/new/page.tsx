import Link from "next/link";
import { AppointmentIntakeForm } from "@/components/forms/appointment-intake-form";
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

      <AppointmentIntakeForm patients={patients} />
    </section>
  );
}
