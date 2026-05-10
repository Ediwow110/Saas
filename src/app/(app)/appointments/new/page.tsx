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
      <section className="mx-auto max-w-2xl space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Book appointment</h1>
        <p className="text-sm text-slate-500">Add a patient first so the appointment can be tied to the right reminder settings.</p>
        <div>
          <Link href="/patients/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Create patient
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Book appointment</h1>
        <p className="text-sm text-slate-500">Create a visit and let ClinicFlow queue reminder jobs automatically.</p>
      </div>

      <form action={createAppointment} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Patient</span>
          <select
            name="patientId"
            required
            defaultValue=""
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          >
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
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Start time</span>
            <input
              name="startsAt"
              type="datetime-local"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>End time</span>
            <input
              name="endsAt"
              type="datetime-local"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Reason</span>
          <input
            name="reason"
            placeholder="Cleaning, consultation, follow-up"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          />
        </label>

        <div className="flex justify-end">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Save appointment
          </button>
        </div>
      </form>
    </section>
  );
}
