"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePatientAction, type FormActionState } from "@/app/actions/patients";

const initialState: FormActionState = {};

export function DeletePatientForm({ patientId, patientName }: { patientId: string; patientName: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deletePatientAction, initialState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="patientId" value={patientId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(event) => {
          if (!window.confirm(`Delete ${patientName}? This also removes their appointments and reminders.`)) {
            event.preventDefault();
          }
        }}
        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {state.error ? <p className="text-xs text-rose-600">{state.error}</p> : null}
    </form>
  );
}
