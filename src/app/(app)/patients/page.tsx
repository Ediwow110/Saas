import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, UserRoundPlus, Users2 } from "lucide-react";
import { DeletePatientForm } from "@/components/forms/delete-patient-form";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Patients",
};

export default async function PatientsPage() {
  const user = await requireUser();
  const patients = await db.patient.findMany({
    where: { clinicId: user.clinicId },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
  });

  const smsOptInCount = patients.filter((p) => p.smsOptIn && p.phone).length;
  const emailOptInCount = patients.filter((p) => p.emailOptIn && p.email).length;

  return (
    <section className="page-enter space-y-6">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Patients</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Contact book and consent</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Keep reminder channels clean before the front desk gets busy.</p>
          </div>
          <Link
            href="/patients/new"
            className="btn-primary"
          >
            <UserRoundPlus className="h-4 w-4" />
            <span>New patient</span>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <PatientMetric label="Total patients" value={patients.length} />
          <PatientMetric label="SMS-ready" value={smsOptInCount} accent />
          <PatientMetric label="Email-ready" value={emailOptInCount} accent />
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-white/80">
        {patients.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users2}
              title="No patients yet"
              body="Create a patient record first so bookings and reminders have a clean starting point."
              action={
                <Link href="/patients/new" className="btn-primary">
                  <UserRoundPlus className="h-4 w-4" />
                  Add first patient
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]" role="list" aria-label="Patient roster">
            {patients.map((patient) => {
              const patientName = `${patient.firstName} ${patient.lastName}`;
              return (
                <li
                  key={patient.id}
                  className="grid gap-4 px-6 py-5 transition-colors hover:bg-[var(--accent-wash)] xl:grid-cols-[1.25fr_0.9fr_0.9fr_auto] xl:items-center"
                >
                  <div>
                    <p className="text-base font-semibold text-[var(--text)]">
                      {patient.lastName}, {patient.firstName}
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--muted)] line-clamp-2">
                      {patient.notes || "No internal notes on file."}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                      <span className="truncate">{patient.phone || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                      <span className="truncate">{patient.email || "No email"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                        patient.smsOptIn && patient.phone
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      SMS {patient.smsOptIn && patient.phone ? "ready" : "off"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                        patient.emailOptIn && patient.email
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      Email {patient.emailOptIn && patient.email ? "ready" : "off"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <Link
                      href={`/patients/${patient.id}/edit`}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Edit
                    </Link>
                    <DeletePatientForm patientId={patient.id} patientName={patientName} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function PatientMetric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4 transition hover:shadow-sm">
      <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${accent ? "text-[var(--accent-strong)]" : "text-[var(--text)]"}`}>
        {value}
      </p>
    </div>
  );
}
