"use client";

import { useActionState } from "react";
import { createTeamMemberAction, type TeamFormState } from "@/app/actions/team";

const initialState: TeamFormState = {};

export function TeamMemberForm() {
  const [state, formAction, isPending] = useActionState(createTeamMemberAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-[26px] border border-[var(--border)] bg-white/80 px-6 py-6">
      <div>
        <p className="text-sm font-medium text-[var(--text)]">Add staff account</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Create a login for a front-desk team member inside this clinic workspace.</p>
      </div>

      <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
        <span>Staff name</span>
        <input name="name" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
      </label>

      <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
        <span>Email</span>
        <input name="email" type="email" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
      </label>

      <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
        <span>Temporary password</span>
        <input name="password" type="password" required className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
      </label>

      {state.error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.success}</p> : null}

      <button type="submit" disabled={isPending} className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70">
        {isPending ? "Creating staff account..." : "Create staff account"}
      </button>
    </form>
  );
}
