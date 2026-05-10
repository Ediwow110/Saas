"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";
import { patientCreateSchema } from "@/lib/validators";

export type FormActionState = {
  error?: string;
  success?: string;
  redirectTo?: string;
};

function normalizePatientInput(input: FormData) {
  return {
    firstName: input.get("firstName"),
    lastName: input.get("lastName"),
    phone: input.get("phone"),
    email: input.get("email"),
    smsOptIn: input.get("smsOptIn") === "on",
    emailOptIn: input.get("emailOptIn") === "on",
    notes: input.get("notes"),
  };
}

export async function createPatientAction(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const user = await requireUser();
  const parsed = patientCreateSchema.safeParse(normalizePatientInput(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please review the patient details." };
  }

  await db.patient.create({
    data: {
      clinicId: user.clinicId,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      smsOptIn: parsed.data.smsOptIn,
      emailOptIn: parsed.data.emailOptIn,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/patients");
  revalidatePath("/patients/new");

  return {
    success: "Patient saved successfully.",
    redirectTo: "/patients",
  };
}

export async function updatePatientAction(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const user = await requireUser();
  const patientId = formData.get("patientId");
  const parsed = patientCreateSchema.safeParse(normalizePatientInput(formData));

  if (typeof patientId !== "string" || !patientId) {
    return { error: "Patient not found." };
  }

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please review the patient details." };
  }

  const result = await db.patient.updateMany({
    where: { id: patientId, clinicId: user.clinicId },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      smsOptIn: parsed.data.smsOptIn,
      emailOptIn: parsed.data.emailOptIn,
      notes: parsed.data.notes || null,
    },
  });

  if (result.count === 0) {
    return { error: "Patient not found." };
  }

  revalidatePath("/patients");
  revalidatePath(`/patients/${patientId}/edit`);
  revalidatePath("/calendar");
  revalidatePath("/dashboard");

  return {
    success: "Patient updated successfully.",
    redirectTo: "/patients",
  };
}

export async function deletePatientAction(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const user = await requireUser();
  const patientId = formData.get("patientId");

  if (typeof patientId !== "string" || !patientId) {
    return { error: "Patient not found." };
  }

  const patient = await db.patient.findFirst({
    where: { id: patientId, clinicId: user.clinicId },
    select: { id: true },
  });

  if (!patient) {
    return { error: "Patient not found." };
  }

  await db.patient.delete({ where: { id: patient.id } });

  revalidatePath("/patients");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");

  return {
    success: "Patient deleted.",
    redirectTo: "/patients",
  };
}
