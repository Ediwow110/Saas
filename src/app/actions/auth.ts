"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";

export type SignUpState = {
  error?: string;
};

const signUpSchema = z
  .object({
    clinicName: z.string().trim().min(2, "Clinic name is required").max(120),
    name: z.string().trim().min(2, "Your name is required").max(120),
    email: z.string().trim().email("Use a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function createOwnerAccount(_: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    clinicName: formData.get("clinicName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check your details." };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.$transaction(async (tx) => {
    const clinic = await tx.clinic.create({
      data: {
        name: parsed.data.clinicName,
        timezone: "Asia/Manila",
      },
    });

    await tx.user.create({
      data: {
        clinicId: clinic.id,
        email,
        name: parsed.data.name,
        passwordHash,
        role: "OWNER",
      },
    });
  });

  redirect(`/login?created=1&email=${encodeURIComponent(email)}`);
}
