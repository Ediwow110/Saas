import { ShieldCheck, UserCog, Users } from "lucide-react";
import { TeamMemberForm } from "@/components/forms/team-member-form";
import { db } from "@/lib/db";
import { requireOwner, requireUser } from "@/lib/current-user";

export default async function TeamPage() {
  const user = await requireUser();
  requireOwner(user.role);

  const teamMembers = await db.user.findMany({
    where: { clinicId: user.clinicId },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  const staffCount = teamMembers.filter((member) => member.role === "STAFF").length;

  return (
    <section className="space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Team</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Clinic access and staff setup</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Owners can create front-desk logins here without leaving the workspace.</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
            {staffCount} staff account{staffCount === 1 ? "" : "s"} active
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <TeamMetric icon={Users} label="Total accounts" value={teamMembers.length} />
          <TeamMetric icon={UserCog} label="Staff accounts" value={staffCount} />
          <TeamMetric icon={ShieldCheck} label="Owner seats" value={teamMembers.filter((member) => member.role === "OWNER").length} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <TeamMemberForm />

        <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-white/80">
          <div className="border-b border-[var(--border)] px-6 py-5">
            <p className="text-sm font-medium text-[var(--text)]">Current team</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Everyone who can sign in to this clinic workspace.</p>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {teamMembers.map((member) => (
              <li key={member.id} className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-[var(--text)]">{member.name}</p>
                  <p className="text-sm text-[var(--muted)]">{member.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${member.role === "OWNER" ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "bg-slate-200 text-slate-700"}`}>
                  {member.role.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TeamMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}
