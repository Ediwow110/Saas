"use client";

import { useActionState } from "react";
import { updateAppointmentStatusAction, type StatusFormState } from "@/app/actions/appointments";

const initialState: StatusFormState = {};

export function AppointmentStatusForm({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: "SCHEDULED" | "CONFIRMED" | "RESCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
}) {
  const [state, formAction, isPending] = useActionState(updateAppointmentStatusAction, initialState);

  return (
    <form action={formAction} className="space-y-2 lg:ml-auto lg:max-w-[180px]">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <select
        name="status"
        defaultValue={currentStatus}
        disabled={isPending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)]"
      >
        <option value="SCHEDULED">Scheduled</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="RESCHEDULED">Rescheduled</option>
        <option value="COMPLETED">Completed</option>
        <option value="NO_SHOW">No show</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {state.error ? <p className="text-xs text-rose-600">{state.error}</p> : null}
      {state.success ? <p className="text-xs text-emerald-700">{state.success}</p> : null}
    </form>
  );
}
