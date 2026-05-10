"use server";

import { addHours, subDays, subHours } from "date-fns";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";
import { appointmentCreateSchema, appointmentStatusSchema } from "@/lib/validators";

export async function createAppointment(input: unknown) {
  const user = await requireUser();
  const data = appointmentCreateSchema.parse(input);

  const patient = await db.patient.findFirst({
    where: { id: data.patientId, clinicId: user.clinicId },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  const overlapping = await db.appointment.findFirst({
    where: {
      clinicId: user.clinicId,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      startsAt: { lt: data.endsAt },
      endsAt: { gt: data.startsAt },
    },
  });

  if (overlapping) {
    throw new Error("Appointment overlaps with another booking");
  }

  const appointment = await db.appointment.create({
    data: {
      clinicId: user.clinicId,
      patientId: patient.id,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      reason: data.reason || null,
    },
  });

  const jobs = [];
  if (patient.smsOptIn && patient.phone) {
    jobs.push({ clinicId: user.clinicId, appointmentId: appointment.id, channel: "SMS" as const, scheduledFor: subDays(data.startsAt, 1) });
    jobs.push({ clinicId: user.clinicId, appointmentId: appointment.id, channel: "SMS" as const, scheduledFor: subHours(data.startsAt, 2) });
  }
  if (patient.emailOptIn && patient.email) {
    jobs.push({ clinicId: user.clinicId, appointmentId: appointment.id, channel: "EMAIL" as const, scheduledFor: subDays(data.startsAt, 1) });
  }

  const recentCutoff = addHours(new Date(), -1);
  const eligibleJobs = jobs.filter((job) => job.scheduledFor > recentCutoff);
  if (eligibleJobs.length > 0) {
    await db.reminderJob.createMany({ data: eligibleJobs });
  }

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}

export async function updateAppointmentStatus(appointmentId: string, input: unknown) {
  const user = await requireUser();
  const data = appointmentStatusSchema.parse(input);

  const result = await db.appointment.updateMany({
    where: { id: appointmentId, clinicId: user.clinicId },
    data: { status: data.status },
  });

  if (result.count === 0) {
    throw new Error("Appointment not found");
  }

  if (["CANCELLED", "RESCHEDULED"].includes(data.status)) {
    await db.reminderJob.updateMany({
      where: { appointmentId, clinicId: user.clinicId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
  }

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}
