import { MetricSkeleton, ListItemSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="clinic-gradient overflow-hidden rounded-[32px] border border-white/75 p-6 shadow-card sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-4 w-[480px] max-w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 w-20 rounded-2xl" />
            <Skeleton className="h-11 w-20 rounded-2xl" />
            <Skeleton className="h-11 w-20 rounded-2xl" />
            <Skeleton className="h-11 w-40 rounded-2xl" />
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
      </div>
      <div className="overflow-hidden rounded-[32px] border border-white/75 bg-white/82 shadow-card">
        <ul className="divide-y divide-[var(--border)]">
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </ul>
      </div>
    </section>
  );
}
