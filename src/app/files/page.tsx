import { EmptyState } from "@/components/states";
import { FileGrid, UploadFileForm } from "@/components/file-cabinet";
import { getOwnPatient } from "@/lib/access";
import { listPatientFiles } from "@/lib/files";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Files" };

export default async function FilesPage() {
  const session = await requirePatient("/files");
  const patient = await getOwnPatient(session.user.id);
  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="No chart yet" body="Complete your profile before adding files." />
      </div>
    );
  }

  const files = await listPatientFiles(patient.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Cabinet</p>
      <h1 className="mt-1 font-display text-5xl">Your files</h1>
      <p className="mb-6 mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Keep X-rays, scans, lab PDFs and doctor notes in the vault. Clinicians you grant can open them too.
      </p>
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-[2rem] bg-[var(--ink)] p-6 text-white lg:col-span-5">
          <h2 className="font-display text-3xl">Add a file</h2>
          <p className="mb-5 mt-2 text-sm text-white/60">Photos of films, discharge letters, or a typed note.</p>
          <div className="[&_label]:text-cyan-200">
            <UploadFileForm patientId={patient.id} />
          </div>
        </section>
        <section className="rounded-[2rem] bg-white/70 p-6 lg:col-span-7">
          <h2 className="mb-4 font-display text-3xl">{files.length} on file</h2>
          <FileGrid files={files} canDeleteAll />
        </section>
      </div>
    </div>
  );
}
