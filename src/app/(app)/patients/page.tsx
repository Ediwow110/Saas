import { db } from "@/lib/db";
import { requireUser } from "@/lib/current-user";

export default async function PatientsPage() {
  const user = await requireUser();
  const patients = await db.patient.findMany({
    where: { clinicId: user.clinicId },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-slate-500">Manage contact details and reminder consent.</p>
        </div>
        <a href="/patients/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">New patient</a>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {patients.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No patients yet.</div>
        ) : (
          <ul className="divide-y">
            {patients.map((patient) => (
              <li key={patient.id} className="grid gap-1 p-4 sm:grid-cols-[1fr_1fr_1fr]">
                <span className="font-medium">{patient.lastName}, {patient.firstName}</span>
                <span className="text-sm text-slate-500">{patient.phone || "No phone"}</span>
                <span className="text-sm text-slate-500">{patient.email || "No email"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
