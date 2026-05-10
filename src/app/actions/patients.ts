"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";
import { patientCreateSchema } from "@/lib/validators";

export async function createPatient(input: unknown) {
  const user = await requireUser();
  const data = patientCreateSchema.parse(input);

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
}
