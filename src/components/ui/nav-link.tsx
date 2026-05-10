"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function NavLink({ href, label, icon: Icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition-all duration-150 ${
        isActive
          ? "bg-[var(--accent)] text-white shadow-md shadow-teal-900/15"
          : "text-[var(--text)] hover:bg-white/[0.88] hover:shadow-sm"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[16px] transition-all duration-150 ${
          isActive
            ? "bg-white/20 text-white"
            : "bg-white/[0.72] text-[var(--accent-strong)] group-hover:bg-[var(--accent)] group-hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
      )}
    </Link>
  );
}
