"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";
import { patientCreateSchema } from "@/lib/validators";

function normalizePatientInput(input: unknown) {
  if (input instanceof FormData) {
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

  return input;
}

export async function createPatient(input: unknown) {
  const user = await requireUser();
  const data = patientCreateSchema.parse(normalizePatientInput(input));

  await db.patient.create({
    data: {
      clinicId: user.clinicId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      email: data.email || null,
      smsOptIn: data.smsOptIn,
      emailOptIn: data.emailOptIn,
      notes: data.notes || null,
    },
  });

  revalidatePath("/patients");
  redirect("/patients");
}
