import { MetricSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function PatientsLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="surface rounded-[26px] border border-[var(--border)] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-11 w-32 rounded-2xl" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
      </div>
      <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-white/80">
        <ul className="divide-y divide-[var(--border)]">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="grid gap-4 px-6 py-5 xl:grid-cols-[1.25fr_0.9fr_0.9fr_auto] xl:items-center">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16 rounded-2xl" />
                <Skeleton className="h-9 w-20 rounded-2xl" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
