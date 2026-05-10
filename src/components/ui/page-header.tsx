"use client";

import { usePathname } from "next/navigation";

const PAGE_META: Record<string, { label: string; title: string }> = {
  "/calendar": { label: "Schedule", title: "Today's appointment timeline" },
  "/patients": { label: "Patients", title: "Patient roster and reminder consent" },
  "/dashboard": { label: "Insights", title: "No-show performance & reminder health" },
  "/patients/new": { label: "New Patient", title: "Register a new patient record" },
  "/team": { label: "Team Access", title: "Manage roles and clinic permissions" },
  "/appointments/new": { label: "New Appointment", title: "Book an appointment" },
};

function getMetaForPath(pathname: string) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith("/appointments/") && pathname.endsWith("/edit"))
    return { label: "Edit Appointment", title: "Update appointment details" };
  if (pathname.startsWith("/patients/") && pathname.endsWith("/edit"))
    return { label: "Edit Patient", title: "Update patient record" };
  return { label: "ClinicFlow", title: "Clinic command center" };
}

export function PageHeader() {
  const pathname = usePathname();
  const meta = getMetaForPath(pathname);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
        {meta.label}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{meta.title}</h1>
    </div>
  );
}
