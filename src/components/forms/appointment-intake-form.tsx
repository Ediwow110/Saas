"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAppointmentAction, type AppointmentFormState } from "@/app/actions/appointments";

const initialState: AppointmentFormState = {};

type PatientOption = {
  id: string;
  firstName: string;
  lastName: string;
};

export function AppointmentIntakeForm({ patients }: { patients: PatientOption[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createAppointmentAction, initialState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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

        {state.error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p> : null}
        {state.success && !state.redirectTo ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.success}</p> : null}

        <button type="submit" disabled={isPending} className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70">
          {isPending ? "Saving appointment..." : "Save appointment"}
        </button>
      </div>
    </form>
  );
}
