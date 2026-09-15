import { auth } from "@/auth";
import { firstName } from "@/lib/auth-redirect";
import { greetingWAT, todayWAT } from "@/lib/datetime";
import { prisma } from "@/lib/db";

export const metadata = { title: "Operator desk" };

export default async function AdminDashboardPage() {
  const session = await auth();
  const [patients, clinicians, facilities, activeGrants, audits] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.user.count({ where: { role: "CLINICIAN" } }),
    prisma.facility.count(),
    prisma.accessGrant.count({ where: { status: "ACTIVE", expiresAt: { gt: new Date() } } }),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    }),
  ]);

  const stats = [
    { label: "Patients", value: patients, span: "lg:col-span-3" },
    { label: "Clinicians", value: clinicians, span: "lg:col-span-3" },
    { label: "Facilities", value: facilities, span: "lg:col-span-3" },
    { label: "Open grants", value: activeGrants, span: "lg:col-span-3" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="rounded-[2rem] bg-[var(--ink)] p-7 text-white lg:col-span-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Network desk · WAT · {todayWAT()}
        </p>
        <h1 className="mt-2 font-display text-4xl">
          {greetingWAT()}, {firstName(session?.user?.name)}
        </h1>
      </section>
      {stats.map((stat) => (
        <section key={stat.label} className={`rounded-[2rem] bg-white/80 p-6 ${stat.span}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{stat.label}</p>
          <p className="mt-2 font-display text-5xl font-extrabold">{stat.value}</p>
        </section>
      ))}
      <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-12">
        <h2 className="font-display text-3xl">Latest pulse</h2>
        <ul className="mt-4 space-y-3">
          {audits.map((log) => (
            <li key={log.id} className="rounded-2xl bg-[var(--paper)] px-4 py-3 text-sm">
              <p className="font-medium">{log.action.replaceAll("_", " ")}</p>
              <p className="text-xs text-[var(--muted)]">
                {log.actor?.name ?? "Public"} {log.detail ? `· ${log.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
