import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="page-enter flex flex-col items-center justify-center rounded-[26px] border border-dashed border-[var(--border)] bg-white/60 px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[26px] bg-[var(--accent-soft)] text-[var(--accent-strong)]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[var(--muted)]">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
