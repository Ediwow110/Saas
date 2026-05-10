import { createPatient } from "@/app/actions/patients";

export default function NewPatientPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New patient</h1>
        <p className="text-sm text-slate-500">Capture contact details and reminder preferences before the first booking.</p>
      </div>

      <form action={createPatient} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>First name</span>
            <input
              name="firstName"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Last name</span>
            <input
              name="lastName"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Phone</span>
            <input
              name="phone"
              type="tel"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Notes</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <input name="smsOptIn" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
            <span>Allow SMS reminders</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <input name="emailOptIn" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
            <span>Allow email reminders</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Save patient
          </button>
        </div>
      </form>
    </section>
  );
}
