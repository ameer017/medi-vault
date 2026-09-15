import { prisma } from "@/lib/db";

export async function expireStaleGrants() {
  await prisma.accessGrant.updateMany({
    where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
    data: { status: "EXPIRED" },
  });
}

export async function clinicianHasAccess(clinicianUserId: string, patientId: string) {
  await expireStaleGrants();
  const grant = await prisma.accessGrant.findFirst({
    where: {
      patientId,
      clinicianId: clinicianUserId,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
  });
  return Boolean(grant);
}

const chartInclude = {
  user: true,
  allergies: { where: { active: true }, orderBy: { notedAt: "desc" as const } },
  medications: { where: { active: true }, orderBy: { startedAt: "desc" as const } },
  records: {
    include: { author: true, facility: true },
    orderBy: { recordedAt: "desc" as const },
  },
  grants: {
    include: { clinician: true },
    orderBy: { createdAt: "desc" as const },
  },
};

export async function getOwnPatient(userId: string) {
  return prisma.patientProfile.findUnique({
    where: { userId },
    include: chartInclude,
  });
}

export async function getPatientChart(patientId: string) {
  return prisma.patientProfile.findUnique({
    where: { id: patientId },
    include: chartInclude,
  });
}

export async function listClinicianPatients(clinicianUserId: string) {
  await expireStaleGrants();
  return prisma.accessGrant.findMany({
    where: {
      clinicianId: clinicianUserId,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
    include: {
      patient: {
        include: {
          user: true,
          allergies: { where: { active: true } },
          _count: { select: { documents: true } },
        },
      },
    },
    orderBy: { redeemedAt: "desc" },
  });
}
