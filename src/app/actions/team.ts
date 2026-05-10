"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireOwner, requireUser } from "@/lib/current-user";

export type TeamFormState = {
  error?: string;
  success?: string;
};

const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Staff name is required").max(120),
  email: z.string().trim().email("Use a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function createTeamMemberAction(_: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const user = await requireUser();
  requireOwner(user.role);

  const parsed = teamMemberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please review the staff details." };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      clinicId: user.clinicId,
      name: parsed.data.name,
      email,
      passwordHash,
      role: "STAFF",
    },
  });

  revalidatePath("/team");
  return { success: "Staff member created successfully." };
}
