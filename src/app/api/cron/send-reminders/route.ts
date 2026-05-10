import { format } from "date-fns";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmailReminder } from "@/lib/reminders/email";
import { sendSmsReminder } from "@/lib/reminders/sms";

export async function POST(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const receivedSecret = request.headers.get("x-cron-secret");

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dueJobs = await db.reminderJob.findMany({
    where: {
      status: "PENDING",
      scheduledFor: { lte: new Date() },
      attempts: { lt: 3 },
    },
    include: {
      clinic: true,
      appointment: { include: { patient: true } },
    },
    orderBy: { scheduledFor: "asc" },
    take: 50,
  });

  for (const job of dueJobs) {
    try {
      const patient = job.appointment.patient;
      const when = format(job.appointment.startsAt, "PPPP p");
      const message = `Reminder: ${patient.firstName}, you have an appointment at ${job.clinic.name} on ${when}. Reply STOP to opt out.`;

      if (job.channel === "SMS") {
        if (!patient.phone || !patient.smsOptIn) throw new Error("Patient cannot receive SMS");
        await sendSmsReminder({ to: patient.phone, body: message });
      } else {
        if (!patient.email || !patient.emailOptIn) throw new Error("Patient cannot receive email");
        await sendEmailReminder({
          to: patient.email,
          subject: `Appointment reminder for ${when}`,
          html: `<p>${message}</p>`,
        });
      }

      await db.reminderJob.update({
        where: { id: job.id },
        data: { status: "SENT", sentAt: new Date(), attempts: { increment: 1 } },
      });
    } catch (error) {
      await db.reminderJob.update({
        where: { id: job.id },
        data: {
          attempts: { increment: 1 },
          status: job.attempts + 1 >= 3 ? "FAILED" : "PENDING",
          lastError: error instanceof Error ? error.message.slice(0, 500) : "Unknown error",
        },
      });
    }
  }

  return NextResponse.json({ processed: dueJobs.length });
}
