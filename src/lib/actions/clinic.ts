"use server";

import type { RecordType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clinicianHasAccess, expireStaleGrants } from "@/lib/access";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { requireClinician } from "@/lib/session";

export type ClinicState = { error?: string; success?: string };

export async function redeemCodeAction(
  _prev: ClinicState,
  formData: FormData,
): Promise<ClinicState> {
  const session = await requireClinician("/clinic");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (code.length < 4) return { error: "Enter the 6-character share code" };

  await expireStaleGrants();
  const grant = await prisma.accessGrant.findFirst({
    where: { code, status: "ACTIVE", expiresAt: { gt: new Date() }, clinicianId: null },
    include: { patient: { include: { user: true } } },
  });
  if (!grant) return { error: "That code is invalid, used, or expired" };

  await prisma.accessGrant.update({
    where: { id: grant.id },
    data: {
      clinicianId: session.user.id,
      redeemedAt: new Date(),
      code: null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: grant.patientId,
    action: "REDEEM_CODE",
    detail: `Opened chart for ${grant.patient.user.name}`,
  });

  revalidatePath("/clinic");
  return { success: `You now have access to ${grant.patient.user.name}` };
}

const recordSchema = z.object({
  patientId: z.string().min(1),
  type: z.enum([
    "CONSULTATION",
    "VITALS",
    "PRESCRIPTION",
    "LAB",
    "ALLERGY",
    "IMMUNIZATION",
    "NOTE",
  ]),
  title: z.string().min(2, "Add a title"),
  summary: z.string().min(4, "Add a short clinical summary"),
});

function detailsFromForm(type: RecordType, formData: FormData) {
  if (type === "VITALS") {
    return {
      systolic: Number(formData.get("systolic") || 0) || null,
      diastolic: Number(formData.get("diastolic") || 0) || null,
      pulse: Number(formData.get("pulse") || 0) || null,
      tempC: Number(formData.get("tempC") || 0) || null,
      spo2: Number(formData.get("spo2") || 0) || null,
      weightKg: Number(formData.get("weightKg") || 0) || null,
    };
  }
  if (type === "PRESCRIPTION") {
    return {
      drug: String(formData.get("drug") ?? ""),
      dose: String(formData.get("dose") ?? ""),
      frequency: String(formData.get("frequency") ?? ""),
      durationDays: Number(formData.get("durationDays") || 0) || null,
    };
  }
  if (type === "LAB") {
    return {
      test: String(formData.get("test") ?? ""),
      result: String(formData.get("result") ?? ""),
      unit: String(formData.get("unit") ?? ""),
      reference: String(formData.get("reference") ?? ""),
    };
  }
  if (type === "ALLERGY") {
    return {
      substance: String(formData.get("substance") ?? ""),
      reaction: String(formData.get("reaction") ?? ""),
      severity: String(formData.get("severity") ?? "Moderate"),
    };
  }
  if (type === "IMMUNIZATION") {
    return {
      vaccine: String(formData.get("vaccine") ?? ""),
      doseNumber: String(formData.get("doseNumber") ?? ""),
      site: String(formData.get("site") ?? ""),
    };
  }
  if (type === "CONSULTATION") {
    return {
      complaint: String(formData.get("complaint") ?? ""),
      findings: String(formData.get("findings") ?? ""),
      plan: String(formData.get("plan") ?? ""),
    };
  }
  return null;
}

export async function createRecordAction(
  _prev: ClinicState,
  formData: FormData,
): Promise<ClinicState> {
  const session = await requireClinician("/clinic");
  const parsed = recordSchema.safeParse({
    patientId: formData.get("patientId"),
    type: formData.get("type"),
    title: formData.get("title"),
    summary: formData.get("summary"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the note" };
  }

  const allowed = await clinicianHasAccess(session.user.id, parsed.data.patientId);
  if (!allowed) return { error: "You do not have access to this chart" };

  const clinician = await prisma.clinicianProfile.findUnique({
    where: { userId: session.user.id },
  });

  const details = detailsFromForm(parsed.data.type, formData);

  await prisma.$transaction(async (tx) => {
    await tx.clinicalRecord.create({
      data: {
        patientId: parsed.data.patientId,
        authorId: session.user.id,
        facilityId: clinician?.facilityId,
        type: parsed.data.type,
        title: parsed.data.title,
        summary: parsed.data.summary,
        details: details ?? undefined,
      },
    });

    if (parsed.data.type === "ALLERGY" && details && "substance" in details && details.substance) {
      await tx.allergy.create({
        data: {
          patientId: parsed.data.patientId,
          substance: String(details.substance),
          reaction: details.reaction ? String(details.reaction) : null,
          severity: String(details.severity || "Moderate"),
        },
      });
    }

    if (parsed.data.type === "PRESCRIPTION" && details && "drug" in details && details.drug) {
      await tx.medication.create({
        data: {
          patientId: parsed.data.patientId,
          name: String(details.drug),
          dose: String(details.dose || ""),
          frequency: String(details.frequency || ""),
        },
      });
    }
  });

  await writeAudit({
    actorId: session.user.id,
    patientId: parsed.data.patientId,
    action: "CREATE_RECORD",
    detail: `${parsed.data.type}: ${parsed.data.title}`,
  });

  revalidatePath(`/clinic/patients/${parsed.data.patientId}`);
  revalidatePath("/clinic");
  return { success: "Record added to the chart" };
}
