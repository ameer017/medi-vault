import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";

const links = [
  { href: "/admin", label: "Desk" },
  { href: "/admin/facilities", label: "Facilities" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/audit", label: "Audit" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin("/admin");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-[var(--ink)] px-3 py-2">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Network</p>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
