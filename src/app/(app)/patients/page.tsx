import Link from "next/link";
import { Mail, MessageSquare, UserRoundPlus } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export default async function PatientsPage() {
  const user = await requireUser();
  const patients = await db.patient.findMany({
    where: { clinicId: user.clinicId },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
  });

  const smsOptInCount = patients.filter((patient) => patient.smsOptIn && patient.phone).length;
  const emailOptInCount = patients.filter((patient) => patient.emailOptIn && patient.email).length;

  return (
    <section className="space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Patients</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Contact book and consent</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Keep reminder channels clean before the front desk gets busy.</p>
          </div>
          <Link
            href="/patients/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <UserRoundPlus className="h-4 w-4" />
            <span>New patient</span>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <PatientMetric label="Total patients" value={patients.length} />
          <PatientMetric label="SMS-ready" value={smsOptInCount} />
          <PatientMetric label="Email-ready" value={emailOptInCount} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-white/80">
        {patients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[var(--text)]">No patients yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Create a patient record first so bookings and reminders have a clean starting point.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {patients.map((patient) => (
              <li key={patient.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1fr_1fr] lg:items-center">
                <div>
                  <p className="text-base font-semibold text-[var(--text)]">
                    {patient.lastName}, {patient.firstName}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{patient.notes || "No internal notes on file."}</p>
                </div>
                <div className="space-y-2 text-sm text-[var(--muted)]">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[var(--accent-strong)]" />
                    <span>{patient.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--accent-strong)]" />
                    <span>{patient.email || "No email"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                      patient.smsOptIn && patient.phone
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    SMS {patient.smsOptIn && patient.phone ? "ready" : "off"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                      patient.emailOptIn && patient.email
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Email {patient.emailOptIn && patient.email ? "ready" : "off"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function PatientMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4">
      <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}
