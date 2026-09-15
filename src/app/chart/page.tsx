import Link from "next/link";
import { AllergyList, MedicationList, RecordTimeline } from "@/components/chart-view";
import { EmptyState } from "@/components/states";
import { getOwnPatient } from "@/lib/access";
import { writeAudit } from "@/lib/audit";
import { ageYears } from "@/lib/datetime";
import { bloodGroupLabel, genotypeLabel, sexLabel } from "@/lib/labels";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Chart" };

export default async function ChartPage() {
  const session = await requirePatient("/chart");
  const patient = await getOwnPatient(session.user.id);
  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="No chart yet" body="Complete your profile first." />
      </div>
    );
  }

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "VIEW_CHART",
    detail: "Patient opened own chart",
  });

  const blood = patient.bloodGroup ? bloodGroupLabel[patient.bloodGroup] : "—";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Clinical chart</p>
          <h1 className="font-display text-5xl">{patient.user.name}</h1>
          <p className="text-sm text-[var(--muted)]">
            {blood}
            {patient.genotype ? ` · ${genotypeLabel[patient.genotype]}` : ""}
            {patient.sex ? ` · ${sexLabel[patient.sex]}` : ""}
            {ageYears(patient.dateOfBirth) != null ? ` · ${ageYears(patient.dateOfBirth)} yrs` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--teal)]"
            href="/files"
          >
            Files
          </Link>
          <Link
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--mint)]"
            href="/chart/profile"
          >
            Edit profile
          </Link>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <section className="rounded-[2rem] bg-rose-50 p-6">
            <h2 className="font-display text-2xl">Allergies</h2>
            <div className="mt-3">
              <AllergyList allergies={patient.allergies} />
            </div>
          </section>
          <section className="rounded-[2rem] bg-white/80 p-6">
            <h2 className="font-display text-2xl">Medications</h2>
            <div className="mt-3">
              <MedicationList medications={patient.medications} />
            </div>
          </section>
          <section className="rounded-[2rem] bg-[var(--ink)] p-6 text-white">
            <h2 className="font-display text-2xl">Identity</h2>
            <p className="mt-3 text-sm text-white/70">NHIA {patient.nhiaNumber || "not set"}</p>
            <p className="mt-1 text-sm text-white/70">
              ICE: {patient.emergencyName || "not set"}
              {patient.emergencyPhone ? ` · ${patient.emergencyPhone}` : ""}
            </p>
          </section>
        </div>
        <section className="rounded-[2rem] bg-white/70 p-6 lg:col-span-8">
          <h2 className="mb-4 font-display text-3xl">Timeline</h2>
          <RecordTimeline records={patient.records} />
        </section>
      </div>
    </div>
  );
}
