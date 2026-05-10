import { hash } from "bcryptjs";
import { addDays, addMinutes, setHours, setMinutes } from "date-fns";
import { db } from "../src/lib/db";

async function main() {
  const passwordHash = await hash("password123", 12);

  const clinic = await db.clinic.upsert({
    where: { id: "seed-clinic" },
    update: {
      name: "Demo Dental Clinic",
      timezone: "Asia/Manila",
      phone: "+630000000000",
    },
    create: {
      id: "seed-clinic",
      name: "Demo Dental Clinic",
      timezone: "Asia/Manila",
      phone: "+630000000000",
    },
  });

  await db.user.upsert({
    where: { email: "owner@example.com" },
    update: {
      clinicId: clinic.id,
      name: "Demo Owner",
      passwordHash,
      role: "OWNER",
    },
    create: {
      clinicId: clinic.id,
      email: "owner@example.com",
      name: "Demo Owner",
      passwordHash,
      role: "OWNER",
    },
  });

  const existingPatient = await db.patient.findFirst({
    where: {
      clinicId: clinic.id,
      email: "maria@example.com",
    },
  });

  const patient = existingPatient
    ? await db.patient.update({
        where: { id: existingPatient.id },
        data: {
          firstName: "Maria",
          lastName: "Santos",
          phone: "+639000000000",
          email: "maria@example.com",
          smsOptIn: true,
          emailOptIn: true,
        },
      })
    : await db.patient.create({
        data: {
          clinicId: clinic.id,
          firstName: "Maria",
          lastName: "Santos",
          phone: "+639000000000",
          email: "maria@example.com",
          smsOptIn: true,
          emailOptIn: true,
        },
      });

  const start = setMinutes(setHours(addDays(new Date(), 1), 9), 0);
  const existingAppointment = await db.appointment.findFirst({
    where: {
      clinicId: clinic.id,
      patientId: patient.id,
      startsAt: start,
    },
  });

  if (!existingAppointment) {
    await db.appointment.create({
      data: {
        clinicId: clinic.id,
        patientId: patient.id,
        startsAt: start,
        endsAt: addMinutes(start, 30),
        reason: "Cleaning",
        status: "SCHEDULED",
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
