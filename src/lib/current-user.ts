import "server-only";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AppUser = {
  id: string;
  clinicId: string;
  role: "OWNER" | "STAFF";
  email: string;
  name: string;
};

export async function requireUser(): Promise<AppUser> {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id || !user?.clinicId) {
    redirect("/api/auth/signin");
  }

  return {
    id: user.id,
    clinicId: user.clinicId,
    role: user.role,
    email: user.email,
    name: user.name,
  };
}

export function requireOwner(role: AppUser["role"]) {
  if (role !== "OWNER") {
    throw new Error("Owner role required");
  }
}
