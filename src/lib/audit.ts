import type { AuditAction } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function writeAudit(input: {
  actorId?: string | null;
  patientId?: string | null;
  action: AuditAction;
  detail?: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      patientId: input.patientId ?? undefined,
      action: input.action,
      detail: input.detail,
    },
  });
}
