import { clinicianHasAccess } from "@/lib/access";
import { prisma } from "@/lib/db";

export async function listPatientFiles(patientId: string) {
  return prisma.patientDocument.findMany({
    where: { patientId },
    select: {
      id: true,
      kind: true,
      title: true,
      notes: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
      uploaderId: true,
      uploader: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function canAccessPatientFiles(user: { id: string; role: string }, patientId: string) {
  if (user.role === "ADMIN") return true;
  if (user.role === "PATIENT") {
    const own = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    return own?.id === patientId;
  }
  if (user.role === "CLINICIAN") {
    return clinicianHasAccess(user.id, patientId);
  }
  return false;
}

export function isPreviewable(mimeType: string) {
  return mimeType.startsWith("image/") || mimeType === "application/pdf" || mimeType === "text/plain";
}
