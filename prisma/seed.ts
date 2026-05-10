import { hash } from "bcryptjs";
import { addDays, addMinutes, setHours, setMinutes } from "date-fns";
import { db } from "../src/lib/db";

async function main() {
  const passwordHash = await hash("password123", 12);

  const clinic = await db.clinic.upsert({
    where: { id: "seed-clinic" },
    update: {},
    create: {
      id: "seed-clinic",
      name: "Demo Dental Clinic",
      timezone: "Asia/Manila",
      phone: "+630000000000",
    },
  });

  await db.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      clinicId: clinic.id,
      email: "owner@example.com",
      name: "Demo Owner",
      passwordHash,
      role: "OWNER",
    },
  });

  const patient = await db.patient.create({
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

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
