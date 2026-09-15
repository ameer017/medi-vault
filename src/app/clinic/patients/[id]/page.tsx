import { notFound } from "next/navigation";
import { AllergyList, MedicationList, RecordTimeline } from "@/components/chart-view";
import { RecordForm } from "@/components/record-form";
import { clinicianHasAccess, getPatientChart } from "@/lib/access";
import { writeAudit } from "@/lib/audit";
import { ageYears } from "@/lib/datetime";
import { bloodGroupLabel, genotypeLabel, sexLabel } from "@/lib/labels";
import { requireClinician } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientChart(id);
  return { title: patient ? patient.user.name : "Patient" };
}

export default async function ClinicianPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireClinician("/clinic");
  const { id } = await params;
  const allowed = await clinicianHasAccess(session.user.id, id);
  if (!allowed) notFound();

  const patient = await getPatientChart(id);
  if (!patient) notFound();

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "VIEW_CHART",
    detail: "Clinician opened chart",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="rounded-[2rem] bg-[var(--ink)] p-7 text-white lg:col-span-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Granted chart</p>
        <h1 className="mt-2 font-display text-5xl">{patient.user.name}</h1>
        <p className="mt-2 text-sm text-white/65">
          {patient.sex ? sexLabel[patient.sex] : "Sex unset"}
          {ageYears(patient.dateOfBirth) != null ? ` · ${ageYears(patient.dateOfBirth)} yrs` : ""}
          {patient.bloodGroup ? ` · ${bloodGroupLabel[patient.bloodGroup]}` : ""}
          {patient.genotype ? ` · ${genotypeLabel[patient.genotype]}` : ""}
          {patient.nhiaNumber ? ` · ${patient.nhiaNumber}` : ""}
        </p>
      </section>
      <section className="rounded-[2rem] bg-rose-50 p-6 lg:col-span-4">
        <h2 className="font-display text-2xl">Allergies</h2>
        <div className="mt-3">
          <AllergyList allergies={patient.allergies} />
        </div>
      </section>
      <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-4">
        <h2 className="font-display text-2xl">Medications</h2>
        <div className="mt-3">
          <MedicationList medications={patient.medications} />
        </div>
      </section>
      <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-4">
        <h2 className="font-display text-2xl">Add a note</h2>
        <div className="mt-3">
          <RecordForm patientId={patient.id} />
        </div>
      </section>
      <section className="rounded-[2rem] bg-white/70 p-6 lg:col-span-12">
        <h2 className="mb-4 font-display text-3xl">Timeline</h2>
        <RecordTimeline records={patient.records} />
      </section>
    </div>
  );
}
