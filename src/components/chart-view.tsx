import type { Allergy, ClinicalRecord, Facility, Medication, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/datetime";
import { recordTypeLabel } from "@/lib/labels";

type RecordWithRelations = ClinicalRecord & {
  author: Pick<User, "name"> | null;
  facility: Pick<Facility, "name" | "code"> | null;
};

export function AllergyList({ allergies }: { allergies: Allergy[] }) {
  if (allergies.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No active allergies on file.</p>;
  }
  return (
    <ul className="space-y-2">
      {allergies.map((allergy) => (
        <li key={allergy.id} className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="font-semibold text-rose-700">{allergy.substance}</p>
          <p className="text-xs text-rose-600/80">
            {allergy.severity}
            {allergy.reaction ? ` · ${allergy.reaction}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function MedicationList({ medications }: { medications: Medication[] }) {
  if (medications.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No current medications.</p>;
  }
  return (
    <ul className="space-y-2">
      {medications.map((med) => (
        <li key={med.id} className="rounded-2xl bg-[var(--paper)] px-4 py-3">
          <p className="font-semibold">{med.name}</p>
          <p className="text-xs text-[var(--muted)]">
            {med.dose} · {med.frequency} · since {formatDate(med.startedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function RecordTimeline({
  records,
  compact = false,
}: {
  records: RecordWithRelations[];
  compact?: boolean;
}) {
  if (records.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No clinical notes yet.</p>;
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-[var(--teal-soft)] pl-6">
      {records.map((record) => (
        <li key={record.id} className="relative">
          <span className="absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--mint)] shadow-[0_0_0_4px_rgba(34,211,238,0.25)]" />
          <div className={compact ? "" : "rounded-3xl bg-white/80 p-5"}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-xl">{record.title}</p>
                <p className="text-xs text-[var(--muted)]">
                  {formatDateTime(record.recordedAt)}
                  {record.author ? ` · ${record.author.name}` : ""}
                  {record.facility ? ` · ${record.facility.code}` : ""}
                </p>
              </div>
              <Badge tone="teal">{recordTypeLabel[record.type]}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/80">{record.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
