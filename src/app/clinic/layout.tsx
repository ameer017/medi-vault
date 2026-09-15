import type { ReactNode } from "react";
import Link from "next/link";
import { requireClinician } from "@/lib/session";

export default async function ClinicLayout({ children }: { children: ReactNode }) {
  await requireClinician("/clinic");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-[var(--ink)] px-4 py-3 text-white md:rounded-full md:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Ward console</p>
        <Link href="/clinic" className="text-sm font-semibold text-white">
          Granted patients
        </Link>
      </div>
      {children}
    </div>
  );
}
