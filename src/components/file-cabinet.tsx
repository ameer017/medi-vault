"use client";

import { useActionState } from "react";
import type { DocumentKind } from "@prisma/client";
import { FileUp } from "lucide-react";
import { deleteFileAction, uploadFileAction, type FileState } from "@/lib/actions/files";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ErrorBox, SuccessBox } from "@/components/states";
import { formatDateTime } from "@/lib/datetime";
import { documentKindLabel, documentKinds } from "@/lib/labels";
import { cn, formatBytes } from "@/lib/utils";

export type FileListItem = {
  id: string;
  kind: DocumentKind;
  title: string;
  notes: string | null;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
  uploaderId: string | null;
  uploader: { name: string; role: string } | null;
};

export function UploadFileForm({ patientId }: { patientId: string }) {
  const [state, action, pending] = useActionState(uploadFileAction, {} as FileState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="patientId" value={patientId} />
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="file-kind">Type</Label>
          <Select id="file-kind" name="kind" required defaultValue="XRAY">
            {documentKinds.map((kind) => (
              <option key={kind} value={kind}>
                {documentKindLabel[kind]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="file-title">Title</Label>
          <Input id="file-title" name="title" required placeholder="Chest X-ray PA" />
        </div>
      </div>
      <div>
        <Label htmlFor="file-notes">Note</Label>
        <Input id="file-notes" name="notes" placeholder="Taken at LUTH, no infiltrate" />
      </div>
      <div>
        <Label htmlFor="file-upload">File</Label>
        <Input
          id="file-upload"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,text/plain,.jpg,.jpeg,.png,.webp,.svg,.pdf,.txt"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">JPG, PNG, PDF or text · under 3 MB</p>
      </div>
      <Button disabled={pending} type="submit">
        <FileUp className="h-4 w-4" />
        {pending ? "Uploading…" : "Add to cabinet"}
      </Button>
    </form>
  );
}

export function FileGrid({
  files,
  canDeleteAll,
  viewerId,
}: {
  files: FileListItem[];
  canDeleteAll?: boolean;
  viewerId?: string;
}) {
  if (files.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No files yet. Add an X-ray, scan, lab report or doctor note.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {files.map((file) => {
        const image = file.mimeType.startsWith("image/");
        const canRemove = canDeleteAll || Boolean(viewerId && file.uploaderId === viewerId);
        return (
          <li key={file.id} className="overflow-hidden rounded-3xl bg-white/80">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/files/${file.id}?inline=1`}
                alt={file.title}
                className="h-44 w-full bg-[var(--ink)] object-contain"
              />
            ) : (
              <div className="flex h-28 items-center justify-center bg-[var(--ink)] px-4 text-center text-sm font-semibold text-[var(--mint)]">
                {documentKindLabel[file.kind]}
              </div>
            )}
            <div className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                {documentKindLabel[file.kind]}
              </p>
              <h3 className="font-display text-xl">{file.title}</h3>
              {file.notes ? <p className="text-sm text-[var(--muted)]">{file.notes}</p> : null}
              <p className="text-xs text-[var(--muted)]">
                {file.fileName} · {formatBytes(file.sizeBytes)} · {formatDateTime(file.createdAt)}
                {file.uploader ? ` · ${file.uploader.name}` : ""}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`/api/files/${file.id}?inline=1`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                >
                  Open
                </a>
                <a href={`/api/files/${file.id}`} className={cn(buttonVariants({ size: "sm", variant: "navy" }))}>
                  Download
                </a>
                {canRemove ? (
                  <form action={deleteFileAction}>
                    <input type="hidden" name="fileId" value={file.id} />
                    <Button type="submit" size="sm" variant="danger">
                      Remove
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
