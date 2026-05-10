import { PatientIntakeForm } from "@/components/forms/patient-intake-form";

export default function NewPatientPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Patients</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Create a patient profile</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">Capture the contact details and reminder consent that the front desk needs before the first booking.</p>
      </div>

      <PatientIntakeForm />
    </section>
  );
}
