import { notFound } from "next/navigation";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { bloodGroupLabel, genotypeLabel } from "@/lib/labels";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const patient = await prisma.patientProfile.findUnique({
    where: { emergencyToken: token },
    include: { user: true },
  });
  if (!patient) return { title: "Emergency card" };
  return { title: `${patient.user.name} · emergency` };
}

export default async function PublicEmergencyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const patient = await prisma.patientProfile.findUnique({
    where: { emergencyToken: token },
    include: { user: true, allergies: { where: { active: true } } },
  });
  if (!patient) notFound();

  await writeAudit({
    patientId: patient.id,
    action: "VIEW_EMERGENCY",
    detail: "Public emergency card opened",
  });

  const blood = patient.bloodGroup ? bloodGroupLabel[patient.bloodGroup] : "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <article className="overflow-hidden rounded-[2rem] bg-[var(--ink)] p-7 text-white shadow-[0_30px_80px_rgba(7,9,26,0.3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Emergency summary</p>
        <p className="mt-4 font-display text-7xl font-extrabold leading-none">{blood}</p>
        <h1 className="mt-3 font-display text-4xl">{patient.user.name}</h1>
        <p className="mt-2 text-sm text-white/55">Limited public card. This is not the full clinical chart.</p>
        <dl className="mt-8 space-y-4">
          <Row label="Genotype" value={patient.genotype ? genotypeLabel[patient.genotype] : "Not recorded"} />
          <Row
            label="Allergies"
            value={
              patient.allergies.length > 0
                ? patient.allergies.map((item) => `${item.substance} (${item.severity})`).join(", ")
                : "None recorded"
            }
          />
          <Row
            label="Call"
            value={
              patient.emergencyName
                ? `${patient.emergencyName}${patient.emergencyPhone ? ` · ${patient.emergencyPhone}` : ""}`
                : "Not recorded"
            }
          />
        </dl>
      </article>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  );
}
