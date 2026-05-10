import { z } from "zod";

export const patientCreateSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  smsOptIn: z.coerce.boolean().default(true),
  emailOptIn: z.coerce.boolean().default(true),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const appointmentCreateSchema = z
  .object({
    patientId: z.string().cuid(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    reason: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine((value) => value.endsAt > value.startsAt, {
    message: "End time must be after start time",
    path: ["endsAt"],
  });

export const appointmentStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "RESCHEDULED", "COMPLETED", "NO_SHOW", "CANCELLED"]),
});
