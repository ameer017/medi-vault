import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RedeemCodeForm } from "@/components/forms";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { listClinicianPatients } from "@/lib/access";
import { firstName } from "@/lib/auth-redirect";
import { greetingWAT } from "@/lib/datetime";
import { bloodGroupLabel } from "@/lib/labels";
import { requireClinician } from "@/lib/session";
import { prisma } from "@/lib/db";

export const metadata = { title: "Clinic" };

export default async function ClinicHomePage() {
  const session = await requireClinician("/clinic");
  const grants = await listClinicianPatients(session.user.id);
  const profile = await prisma.clinicianProfile.findUnique({
    where: { userId: session.user.id },
    include: { facility: true },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="rounded-[2rem] bg-[var(--ink)] p-7 text-white lg:col-span-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          {profile?.facility.code ?? "Clinic"} · {profile?.specialty ?? "Clinician"}
        </p>
        <h1 className="mt-3 font-display text-4xl">
          {greetingWAT()}, {firstName(session.user.name)}
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Only patients who handed you a key appear here. Redeem a walk-in code to open a new chart.
        </p>
        <div className="mt-6 [&_label]:text-cyan-200">
          <RedeemCodeForm />
        </div>
      </section>
      <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-7">
        <h2 className="font-display text-3xl">Granted charts</h2>
        {grants.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No open charts"
              body="Ask the patient for a 24-hour MediVault code, or have them grant your email from Access."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {grants.map((grant) => (
              <li key={grant.id}>
                <Link
                  href={`/clinic/patients/${grant.patientId}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--paper)] px-4 py-4 hover:bg-[var(--teal-soft)]"
                >
                  <div>
                    <p className="font-semibold">{grant.patient.user.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {grant.patient.bloodGroup ? bloodGroupLabel[grant.patient.bloodGroup] : "Blood group unset"}
                      {grant.patient.allergies.length > 0
                        ? ` · ${grant.patient.allergies.length} allerg${grant.patient.allergies.length === 1 ? "y" : "ies"}`
                        : ""}
                      {grant.patient._count.documents
                        ? ` · ${grant.patient._count.documents} file${grant.patient._count.documents === 1 ? "" : "s"}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="ink">Open</Badge>
                    <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
