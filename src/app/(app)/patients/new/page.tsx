import { createPatient } from "@/app/actions/patients";

export default function NewPatientPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Patients</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Create a patient profile</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">Capture the contact details and reminder consent that the front desk needs before the first booking.</p>
      </div>

      <form action={createPatient} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Patient details</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Keep the basics complete so reminders are less likely to fail later.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>First name</span>
              <input name="firstName" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Last name</span>
              <input name="lastName" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Phone</span>
              <input name="phone" type="tel" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Email</span>
              <input name="email" type="email" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Notes</span>
            <textarea name="notes" rows={5} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
          </label>
        </div>

        <div className="space-y-6 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Reminder consent</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Set the default channels you want the app to use for reminder jobs.</p>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--text)]">
            <input name="smsOptIn" type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300" />
            <span>
              <strong className="block">Allow SMS reminders</strong>
              <span className="mt-1 block text-[var(--muted)]">Use for appointment reminders sent one day and two hours before the visit.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--text)]">
            <input name="emailOptIn" type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300" />
            <span>
              <strong className="block">Allow email reminders</strong>
              <span className="mt-1 block text-[var(--muted)]">Use when email is the preferred or backup communication channel.</span>
            </span>
          </label>

          <button type="submit" className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
            Save patient
          </button>
        </div>
      </form>
    </section>
  );
}
