"use server";

import type { BloodGroup, Genotype, Sex } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeAudit } from "@/lib/audit";
import { expireStaleGrants } from "@/lib/access";
import { prisma } from "@/lib/db";
import { requirePatient } from "@/lib/session";
import { shareCode } from "@/lib/utils";

export type FormState = { error?: string; success?: string; code?: string };

const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"] as const;
const genotypes = ["AA", "AS", "SS", "AC", "SC"] as const;
const sexes = ["FEMALE", "MALE", "OTHER"] as const;

const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.enum(sexes).optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  genotype: z.enum(genotypes).optional(),
  nhiaNumber: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requirePatient("/chart/profile");
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || undefined,
    sex: formData.get("sex") || undefined,
    bloodGroup: formData.get("bloodGroup") || undefined,
    genotype: formData.get("genotype") || undefined,
    nhiaNumber: formData.get("nhiaNumber") || undefined,
    emergencyName: formData.get("emergencyName") || undefined,
    emergencyPhone: formData.get("emergencyPhone") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details" };
  }

  const patient = await prisma.patientProfile.findUnique({ where: { userId: session.user.id } });
  if (!patient) return { error: "Patient chart not found" };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name, phone: parsed.data.phone },
    }),
    prisma.patientProfile.update({
      where: { id: patient.id },
      data: {
        dateOfBirth: parsed.data.dateOfBirth ? new Date(`${parsed.data.dateOfBirth}T00:00:00.000Z`) : null,
        sex: (parsed.data.sex as Sex | undefined) ?? null,
        bloodGroup: (parsed.data.bloodGroup as BloodGroup | undefined) ?? null,
        genotype: (parsed.data.genotype as Genotype | undefined) ?? null,
        nhiaNumber: parsed.data.nhiaNumber,
        emergencyName: parsed.data.emergencyName,
        emergencyPhone: parsed.data.emergencyPhone,
      },
    }),
  ]);

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "UPDATE_PROFILE",
    detail: "Updated personal and emergency details",
  });

  revalidatePath("/dashboard");
  revalidatePath("/chart");
  revalidatePath("/chart/profile");
  revalidatePath("/emergency");
  return { success: "Profile saved" };
}

export async function generateShareCodeAction(): Promise<FormState> {
  const session = await requirePatient("/share");
  const patient = await prisma.patientProfile.findUnique({ where: { userId: session.user.id } });
  if (!patient) return { error: "Patient chart not found" };

  await expireStaleGrants();
  const code = shareCode();
  await prisma.accessGrant.create({
    data: {
      patientId: patient.id,
      code,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "GRANT_ACCESS",
    detail: `Issued share code ${code}`,
  });

  revalidatePath("/share");
  return { success: "Share code created. It expires in 24 hours.", code };
}

export async function grantByEmailAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requirePatient("/share");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Enter the clinician’s email" };

  const patient = await prisma.patientProfile.findUnique({ where: { userId: session.user.id } });
  if (!patient) return { error: "Patient chart not found" };

  const clinician = await prisma.user.findUnique({
    where: { email },
    include: { clinicianProfile: true },
  });
  if (!clinician || clinician.role !== "CLINICIAN" || !clinician.clinicianProfile) {
    return { error: "No clinician is registered with that email" };
  }

  await expireStaleGrants();
  const existing = await prisma.accessGrant.findFirst({
    where: {
      patientId: patient.id,
      clinicianId: clinician.id,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
  });
  if (existing) return { error: "That clinician already has an active grant" };

  const days = Number(formData.get("days") ?? 7);
  const duration = [1, 7, 30].includes(days) ? days : 7;

  await prisma.accessGrant.create({
    data: {
      patientId: patient.id,
      clinicianId: clinician.id,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      redeemedAt: new Date(),
    },
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "GRANT_ACCESS",
    detail: `Granted ${clinician.name} access for ${duration} day(s)`,
  });

  revalidatePath("/share");
  revalidatePath("/dashboard");
  return { success: `Access granted to ${clinician.name} for ${duration} day(s)` };
}

export async function revokeGrantAction(formData: FormData): Promise<void> {
  const session = await requirePatient("/share");
  const grantId = String(formData.get("grantId") ?? "");
  const patient = await prisma.patientProfile.findUnique({ where: { userId: session.user.id } });
  if (!patient) return;

  const grant = await prisma.accessGrant.findFirst({
    where: { id: grantId, patientId: patient.id },
    include: { clinician: true },
  });
  if (!grant || grant.status !== "ACTIVE") return;

  await prisma.accessGrant.update({
    where: { id: grant.id },
    data: { status: "REVOKED" },
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: patient.id,
    action: "REVOKE_ACCESS",
    detail: grant.clinician ? `Revoked ${grant.clinician.name}` : `Revoked unused code ${grant.code}`,
  });

  revalidatePath("/share");
  revalidatePath("/dashboard");
}
