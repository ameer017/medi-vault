"use server";

import type { DocumentKind } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { clinicianHasAccess } from "@/lib/access";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export type FileState = { error?: string; success?: string };

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
]);

const kinds = new Set<DocumentKind>([
  "XRAY",
  "SCAN",
  "LAB_REPORT",
  "DOCTOR_NOTE",
  "PRESCRIPTION",
  "DISCHARGE",
  "OTHER",
]);

function inferMimeType(file: File) {
  if (ALLOWED_TYPES.has(file.type)) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".svg")) return "image/svg+xml";
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".txt")) return "text/plain";
  return file.type;
}

async function resolveWritablePatientId(user: { id: string; role: string }, requestedId: string) {
  if (user.role === "PATIENT") {
    const own = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!own || own.id !== requestedId) return null;
    return own.id;
  }
  if (user.role === "CLINICIAN") {
    const allowed = await clinicianHasAccess(user.id, requestedId);
    return allowed ? requestedId : null;
  }
  return null;
}

export async function uploadFileAction(_prev: FileState, formData: FormData): Promise<FileState> {
  const session = await requireUser("/files");
  const patientId = String(formData.get("patientId") ?? "");
  const writableId = await resolveWritablePatientId(session.user, patientId);
  if (!writableId) return { error: "You cannot add files to this chart" };

  const kind = String(formData.get("kind") ?? "") as DocumentKind;
  if (!kinds.has(kind)) return { error: "Choose a file type" };

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 2) return { error: "Give the file a title" };

  const notes = String(formData.get("notes") ?? "").trim() || null;
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload" };
  if (file.size > MAX_BYTES) return { error: "Keep files under 3 MB" };
  const mimeType = inferMimeType(file);
  if (!ALLOWED_TYPES.has(mimeType)) {
    return { error: "Use a JPG, PNG, WebP, PDF, or text file" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await prisma.patientDocument.create({
    data: {
      patientId: writableId,
      uploaderId: session.user.id,
      kind,
      title,
      notes,
      fileName: file.name.slice(0, 180),
      mimeType,
      sizeBytes: file.size,
      data: buffer,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: writableId,
    action: "UPLOAD_FILE",
    detail: `${kind}: ${title}`,
  });

  revalidatePath("/files");
  revalidatePath("/dashboard");
  revalidatePath(`/clinic/patients/${writableId}`);
  return { success: "File added to the cabinet" };
}

export async function deleteFileAction(formData: FormData) {
  const session = await requireUser("/files");
  const fileId = String(formData.get("fileId") ?? "");
  const doc = await prisma.patientDocument.findUnique({
    where: { id: fileId },
    include: { patient: { select: { userId: true, id: true } } },
  });
  if (!doc) return;

  const isOwner = session.user.role === "PATIENT" && doc.patient.userId === session.user.id;
  const isUploader = doc.uploaderId === session.user.id;
  const isClinician =
    session.user.role === "CLINICIAN" && (await clinicianHasAccess(session.user.id, doc.patientId));

  if (!isOwner && !(isUploader && isClinician)) return;

  await prisma.patientDocument.delete({ where: { id: doc.id } });
  await writeAudit({
    actorId: session.user.id,
    patientId: doc.patientId,
    action: "DELETE_FILE",
    detail: doc.title,
  });

  revalidatePath("/files");
  revalidatePath("/dashboard");
  revalidatePath(`/clinic/patients/${doc.patientId}`);
}
