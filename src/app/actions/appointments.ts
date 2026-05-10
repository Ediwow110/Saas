"use server";

import { addHours, subDays, subHours } from "date-fns";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";
import { appointmentCreateSchema, appointmentStatusSchema } from "@/lib/validators";

export type AppointmentFormState = {
  error?: string;
  success?: string;
  redirectTo?: string;
};

export type StatusFormState = {
  error?: string;
  success?: string;
};

function normalizeAppointmentInput(input: FormData) {
  return {
    patientId: input.get("patientId"),
    startsAt: input.get("startsAt"),
    endsAt: input.get("endsAt"),
    reason: input.get("reason"),
  };
}

export async function createAppointmentAction(_: AppointmentFormState, formData: FormData): Promise<AppointmentFormState> {
  const user = await requireUser();
  const parsed = appointmentCreateSchema.safeParse(normalizeAppointmentInput(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please review the appointment details." };
  }

  const data = parsed.data;

  const patient = await db.patient.findFirst({
    where: { id: data.patientId, clinicId: user.clinicId },
  });

  if (!patient) {
    return { error: "Patient not found." };
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
    return { error: "Appointment overlaps with another booking." };
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
  revalidatePath("/appointments/new");

  return {
    success: "Appointment saved successfully.",
    redirectTo: "/calendar",
  };
}

export async function updateAppointmentStatusAction(_: StatusFormState, formData: FormData): Promise<StatusFormState> {
  const user = await requireUser();
  const appointmentId = formData.get("appointmentId");
  const parsed = appointmentStatusSchema.safeParse({ status: formData.get("status") });

  if (typeof appointmentId !== "string" || !appointmentId) {
    return { error: "Appointment not found." };
  }

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Status is invalid." };
  }

  const result = await db.appointment.updateMany({
    where: { id: appointmentId, clinicId: user.clinicId },
    data: { status: parsed.data.status },
  });

  if (result.count === 0) {
    return { error: "Appointment not found." };
  }

  if (["CANCELLED", "RESCHEDULED"].includes(parsed.data.status)) {
    await db.reminderJob.updateMany({
      where: { appointmentId, clinicId: user.clinicId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
  }

  revalidatePath("/calendar");
  revalidatePath("/dashboard");

  return { success: "Status updated." };
}
