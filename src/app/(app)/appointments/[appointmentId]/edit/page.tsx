import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppointmentIntakeForm } from "@/components/forms/appointment-intake-form";
import { DeleteAppointmentForm } from "@/components/forms/delete-appointment-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

type EditAppointmentPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  const user = await requireUser();
  const { appointmentId } = await params;

  const [appointment, patients] = await Promise.all([
    db.appointment.findFirst({
      where: { id: appointmentId, clinicId: user.clinicId },
      include: { patient: true },
    }),
    db.patient.findMany({
      where: { clinicId: user.clinicId },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: 100,
    }),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/calendar" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">
          <ArrowLeft className="h-4 w-4" />
          Back to calendar
        </Link>
      </div>

      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Edit appointment</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">Change the patient, time window, or reason. Pending reminders will be refreshed automatically.</p>
          </div>
          <DeleteAppointmentForm appointmentId={appointment.id} />
        </div>
      </div>

      <AppointmentIntakeForm patients={patients} appointment={appointment} />
    </section>
  );
}
