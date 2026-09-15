"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isUniqueConflict } from "@/lib/prisma-errors";
import { requireAdmin } from "@/lib/session";

export type AdminState = { error?: string; success?: string };

export async function createFacilityAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin("/admin/facilities");
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (name.length < 2 || city.length < 2 || code.length < 2) {
    return { error: "Name, city, and a short code are required" };
  }

  try {
    await prisma.facility.create({ data: { name, city, code } });
  } catch (error) {
    if (isUniqueConflict(error)) return { error: "That facility code is already in use" };
    throw error;
  }

  revalidatePath("/admin/facilities");
  revalidatePath("/admin");
  return { success: "Facility added" };
}

const clinicianSchema = z.object({
  name: z.string().min(2, "Enter the clinician’s name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  licenseNumber: z.string().min(3, "Enter the MDCN licence number"),
  specialty: z.string().min(2, "Enter a specialty"),
  facilityId: z.string().min(1, "Choose a facility"),
  phone: z.string().optional(),
});

export async function createClinicianAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin("/admin/people");
  const parsed = clinicianSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    licenseNumber: formData.get("licenseNumber"),
    specialty: formData.get("specialty"),
    facilityId: formData.get("facilityId"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        role: "CLINICIAN",
        clinicianProfile: {
          create: {
            licenseNumber: parsed.data.licenseNumber,
            specialty: parsed.data.specialty,
            facilityId: parsed.data.facilityId,
          },
        },
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) return { error: "An account with this email already exists" };
    throw error;
  }

  revalidatePath("/admin/people");
  revalidatePath("/admin");
  return { success: "Clinician account created" };
}
