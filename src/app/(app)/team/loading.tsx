export default function TeamLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded-full bg-[var(--accent-soft)]" />
        <div className="h-7 w-56 animate-pulse rounded-xl bg-[var(--accent-soft)]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form skeleton */}
        <div className="space-y-4 rounded-[26px] border border-[var(--border)] bg-white/[0.80] px-6 py-6">
          <div className="space-y-1">
            <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--accent-soft)]" />
            <div className="h-3 w-64 animate-pulse rounded-full bg-[var(--accent-soft)]" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--accent-soft)]" />
              <div className="h-11 w-full animate-pulse rounded-[18px] bg-[var(--accent-soft)]" />
            </div>
          ))}
          <div className="h-11 w-full animate-pulse rounded-[18px] bg-[var(--accent-soft)]" />
        </div>

        {/* Team list skeleton */}
        <div className="space-y-3 rounded-[26px] border border-[var(--border)] bg-white/[0.80] px-6 py-6">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--accent-soft)]" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[18px] border border-[var(--border)] px-4 py-3">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-[var(--accent-soft)]" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-32 animate-pulse rounded-full bg-[var(--accent-soft)]" />
                <div className="h-3 w-40 animate-pulse rounded-full bg-[var(--accent-soft)]" />
              </div>
              <div className="h-6 w-14 animate-pulse rounded-full bg-[var(--accent-soft)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
