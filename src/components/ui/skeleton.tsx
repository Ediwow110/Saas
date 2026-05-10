interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function MetricSkeleton() {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-2xl" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="mt-4 h-9 w-16" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <li className="grid gap-4 px-6 py-5 xl:grid-cols-[150px_1fr_280px] xl:items-center">
      <Skeleton className="h-20 w-full rounded-[20px]" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 xl:ml-auto xl:w-[280px]">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded-2xl" />
          <Skeleton className="h-9 w-20 rounded-2xl" />
        </div>
      </div>
    </li>
  );
}
