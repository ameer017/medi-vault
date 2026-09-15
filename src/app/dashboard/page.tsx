import Link from "next/link";
import { FileStack, QrCode } from "lucide-react";
import { AllergyList, MedicationList, RecordTimeline } from "@/components/chart-view";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { getOwnPatient } from "@/lib/access";
import { prisma } from "@/lib/db";
import { firstName } from "@/lib/auth-redirect";
import { ageYears, greetingWAT } from "@/lib/datetime";
import { bloodGroupLabel, genotypeLabel } from "@/lib/labels";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Your vault" };

export default async function PatientDashboardPage() {
  const session = await requirePatient("/dashboard");
  const patient = await getOwnPatient(session.user.id);

  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="No chart yet" body="Your vault is empty. Complete your profile to start." />
      </div>
    );
  }

  const activeGrants = patient.grants.filter((grant) => grant.status === "ACTIVE" && grant.clinicianId);
  const fileCount = await prisma.patientDocument.count({ where: { patientId: patient.id } });
  const age = ageYears(patient.dateOfBirth);
  const blood = patient.bloodGroup ? bloodGroupLabel[patient.bloodGroup] : "—";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-[var(--ink)] p-7 text-white lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            {greetingWAT()} · {firstName(session.user.name)}
          </p>
          <p className="mt-4 font-display text-7xl font-extrabold leading-none md:text-8xl">{blood}</p>
          <p className="mt-3 text-sm text-white/65">
            {age ? `${age} yrs` : "Age not set"}
            {patient.genotype ? ` · genotype ${genotypeLabel[patient.genotype]}` : ""}
            {patient.nhiaNumber ? ` · ${patient.nhiaNumber}` : ""}
          </p>
          <svg className="mt-8 h-14 w-full" viewBox="0 0 360 64" fill="none" aria-hidden>
            <path
              className="ecg"
              d="M0 32 H40 L52 32 L62 8 L74 56 L86 32 H140 L152 32 L162 14 L174 50 L186 32 H360"
              stroke="#22d3ee"
              strokeWidth="2"
            />
          </svg>
        </section>

        <section className="rounded-[2rem] bg-rose-50 p-6 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Watch-outs</p>
          <h2 className="mt-1 font-display text-3xl">Allergies</h2>
          <div className="mt-4">
            <AllergyList allergies={patient.allergies} />
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">On file</p>
          <h2 className="mt-1 font-display text-2xl">Medications</h2>
          <div className="mt-4">
            <MedicationList medications={patient.medications} />
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/80 p-6 lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">Live grants</p>
          <p className="mt-3 font-display text-6xl font-extrabold">{activeGrants.length}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">clinicians with the key</p>
          <Link href="/share" className="mt-4 inline-block text-sm font-semibold text-[var(--teal)]">
            Manage access →
          </Link>
        </section>

        <section className="flex flex-col justify-between rounded-[2rem] bg-[var(--ink)] p-6 text-white lg:col-span-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Cabinet</p>
            <p className="mt-3 font-display text-6xl font-extrabold">{fileCount}</p>
            <p className="mt-2 text-sm text-white/60">X-rays, scans, doctor notes</p>
          </div>
          <Link href="/files" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--mint)]">
            <FileStack className="h-4 w-4" />
            Open files →
          </Link>
        </section>

        <section className="flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-indigo-100 to-cyan-100 p-6 lg:col-span-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">In case of emergency</p>
            <h2 className="mt-1 font-display text-3xl">Print the ICE card</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">QR shows blood group and who to call — never the notes.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/emergency">
              <Button type="button" variant="navy">
                <QrCode className="h-4 w-4" /> Open ICE card
              </Button>
            </Link>
            <Link href="/chart">
              <Button type="button" variant="outline">
                Full chart
              </Button>
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/70 p-6 lg:col-span-12">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-3xl">Pulse of the chart</h2>
            <Link className="text-sm font-semibold text-[var(--teal)]" href="/chart">
              See all
            </Link>
          </div>
          <RecordTimeline records={patient.records.slice(0, 4)} compact />
        </section>
      </div>
    </div>
  );
}
