import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PatientIntakeForm } from "@/components/forms/patient-intake-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

type EditPatientPageProps = {
  params: Promise<{ patientId: string }>;
};

export default async function EditPatientPage({ params }: EditPatientPageProps) {
  const user = await requireUser();
  const { patientId } = await params;

  const patient = await db.patient.findFirst({
    where: { id: patientId, clinicId: user.clinicId },
  });

  if (!patient) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <Link href="/patients" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">
          <ArrowLeft className="h-4 w-4" />
          Back to patients
        </Link>
        <p className="mt-6 text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Edit patient</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
          {patient.firstName} {patient.lastName}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Update contact details, notes, and reminder consent.</p>
      </div>

      <PatientIntakeForm patient={patient} />
    </section>
  );
}
