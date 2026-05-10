"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteAppointmentAction, type AppointmentFormState } from "@/app/actions/appointments";

const initialState: AppointmentFormState = {};

export function DeleteAppointmentForm({ appointmentId, label = "Delete" }: { appointmentId: string; label?: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteAppointmentAction, initialState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(event) => {
          if (!window.confirm("Delete this appointment and its reminders?")) {
            event.preventDefault();
          }
        }}
        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Deleting..." : label}
      </button>
      {state.error ? <p className="text-xs text-rose-600">{state.error}</p> : null}
    </form>
  );
}
