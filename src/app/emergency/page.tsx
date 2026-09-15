import QRCode from "qrcode";
import { PrintButton } from "@/components/print-button";
import { EmptyState } from "@/components/states";
import { getOwnPatient } from "@/lib/access";
import { bloodGroupLabel, genotypeLabel } from "@/lib/labels";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Emergency card" };

export default async function EmergencyCardPage() {
  const session = await requirePatient("/emergency");
  const patient = await getOwnPatient(session.user.id);
  if (!patient) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="No chart yet" body="Add your details before printing an emergency card." />
      </div>
    );
  }

  const url = `${process.env.AUTH_URL ?? "http://localhost:3000"}/e/${patient.emergencyToken}`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 220, color: { dark: "#07091a", light: "#ffffff" } });
  const blood = patient.bloodGroup ? bloodGroupLabel[patient.bloodGroup] : "—";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between no-print">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">In case of emergency</p>
          <h1 className="font-display text-5xl">ICE card</h1>
          <p className="text-sm text-[var(--muted)]">Blood group and who to call. Never the visit notes.</p>
        </div>
        <PrintButton label="Print card" />
      </div>
      <article className="print-card overflow-hidden rounded-[2rem] bg-[var(--ink)] text-white shadow-[0_30px_80px_rgba(7,9,26,0.35)]">
        <div className="flex items-center justify-between px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-cyan-200">
          <span>MediVault ICE</span>
          <span>Scan at the bay</span>
        </div>
        <div className="grid gap-6 px-6 pb-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-7xl font-extrabold leading-none">{blood}</p>
            <h2 className="mt-3 font-display text-3xl">{patient.user.name}</h2>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-white/50">Genotype</dt>
                <dd className="font-semibold">{patient.genotype ? genotypeLabel[patient.genotype] : "Not set"}</dd>
              </div>
              <div>
                <dt className="text-white/50">Allergies</dt>
                <dd className="font-semibold">
                  {patient.allergies.length > 0
                    ? patient.allergies.map((item) => item.substance).join(", ")
                    : "None recorded"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-white/50">Call</dt>
                <dd className="font-semibold">
                  {patient.emergencyName || "Not set"}
                  {patient.emergencyPhone ? ` · ${patient.emergencyPhone}` : ""}
                </dd>
              </div>
            </dl>
          </div>
          <div className="justify-self-center rounded-3xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Emergency QR code" className="h-40 w-40" />
          </div>
        </div>
      </article>
    </div>
  );
}
