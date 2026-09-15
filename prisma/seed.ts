import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.accessGrant.deleteMany();
  await prisma.clinicalRecord.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.allergy.deleteMany();
  await prisma.clinicianProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, patientHash, clinicianHash] = await Promise.all([
    bcrypt.hash("Vault!admin", 10),
    bcrypt.hash("patient123", 10),
    bcrypt.hash("clinician123", 10),
  ]);

  const admin = await prisma.user.create({
    data: {
      email: "admin@medivault.ng",
      passwordHash: adminHash,
      name: "MediVault Operator",
      role: "ADMIN",
    },
  });

  const amina = await prisma.user.create({
    data: {
      email: "amina@medivault.ng",
      passwordHash: patientHash,
      name: "Amina Bello",
      phone: "+2348012345678",
      role: "PATIENT",
    },
  });

  const tunde = await prisma.user.create({
    data: {
      email: "tunde@medivault.ng",
      passwordHash: clinicianHash,
      name: "Dr. Tunde Adeyemi",
      phone: "+2348098765432",
      role: "CLINICIAN",
    },
  });

  await prisma.user.create({
    data: {
      email: "fatima@medivault.ng",
      passwordHash: clinicianHash,
      name: "Dr. Fatima Yusuf",
      phone: "+2348081122334",
      role: "CLINICIAN",
    },
  });

  const [luth, nha] = await Promise.all([
    prisma.facility.create({
      data: { name: "Lagos University Teaching Hospital", city: "Lagos", code: "LUTH" },
    }),
    prisma.facility.create({
      data: { name: "National Hospital Abuja", city: "Abuja", code: "NHA" },
    }),
    prisma.facility.create({
      data: { name: "University College Hospital", city: "Ibadan", code: "UCH" },
    }),
  ]);

  await prisma.facility.create({
    data: { name: "Reddington Hospital", city: "Lagos", code: "RED" },
  });

  await prisma.clinicianProfile.create({
    data: {
      userId: tunde.id,
      licenseNumber: "MDCN-44821",
      specialty: "Cardiology",
      facilityId: luth.id,
    },
  });

  const fatima = await prisma.user.findUniqueOrThrow({ where: { email: "fatima@medivault.ng" } });
  await prisma.clinicianProfile.create({
    data: {
      userId: fatima.id,
      licenseNumber: "MDCN-55109",
      specialty: "Paediatrics",
      facilityId: nha.id,
    },
  });

  const patient = await prisma.patientProfile.create({
    data: {
      userId: amina.id,
      dateOfBirth: new Date("1994-03-12T00:00:00.000Z"),
      sex: "FEMALE",
      bloodGroup: "O_POS",
      genotype: "AA",
      nhiaNumber: "NHIA-884201",
      emergencyName: "Ibrahim Bello",
      emergencyPhone: "+2348034455667",
      emergencyToken: "emg_amina_demo_token",
    },
  });

  await prisma.allergy.create({
    data: {
      patientId: patient.id,
      substance: "Penicillin",
      reaction: "Generalised rash",
      severity: "Moderate",
      notedAt: daysAgo(400),
    },
  });

  await prisma.medication.create({
    data: {
      patientId: patient.id,
      name: "Amlodipine",
      dose: "5 mg",
      frequency: "Once daily",
      startedAt: daysAgo(90),
    },
  });

  await prisma.clinicalRecord.createMany({
    data: [
      {
        patientId: patient.id,
        authorId: tunde.id,
        facilityId: luth.id,
        type: "CONSULTATION",
        title: "Acute febrile illness",
        summary:
          "Three-day fever, headache and chills. Malaria suspected. Started artemether-lumefantrine. Follow up if fever persists after 48 hours.",
        details: {
          complaint: "Fever, headache, chills",
          findings: "Temp 38.6°C, not pale, no neck stiffness",
          plan: "RDT, ACT, review in 48 hours",
        },
        recordedAt: daysAgo(18),
      },
      {
        patientId: patient.id,
        authorId: tunde.id,
        facilityId: luth.id,
        type: "LAB",
        title: "Malaria RDT",
        summary: "Plasmodium falciparum antigen detected.",
        details: { test: "Malaria RDT", result: "Positive (Pf)", unit: "", reference: "Negative" },
        recordedAt: daysAgo(18),
      },
      {
        patientId: patient.id,
        authorId: tunde.id,
        facilityId: luth.id,
        type: "VITALS",
        title: "Clinic vitals",
        summary: "BP 138/86 · Pulse 92 · Temp 36.8°C · SpO2 98%",
        details: { systolic: 138, diastolic: 86, pulse: 92, tempC: 36.8, spo2: 98, weightKg: 68 },
        recordedAt: daysAgo(6),
      },
      {
        patientId: patient.id,
        authorId: tunde.id,
        facilityId: luth.id,
        type: "PRESCRIPTION",
        title: "Amlodipine 5 mg",
        summary: "Continue amlodipine 5 mg once daily for blood pressure.",
        details: { drug: "Amlodipine", dose: "5 mg", frequency: "Once daily", durationDays: 90 },
        recordedAt: daysAgo(90),
      },
      {
        patientId: patient.id,
        authorId: tunde.id,
        facilityId: luth.id,
        type: "ALLERGY",
        title: "Penicillin allergy",
        summary: "Documented moderate rash after oral penicillin.",
        details: { substance: "Penicillin", reaction: "Generalised rash", severity: "Moderate" },
        recordedAt: daysAgo(400),
      },
    ],
  });

  await prisma.accessGrant.create({
    data: {
      patientId: patient.id,
      clinicianId: tunde.id,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      redeemedAt: daysAgo(20),
    },
  });

  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "LOGIN", detail: "Seed operator account" },
      { actorId: tunde.id, patientId: patient.id, action: "VIEW_CHART", detail: "Follow-up vitals visit" },
      { actorId: amina.id, patientId: patient.id, action: "GRANT_ACCESS", detail: "Opened chart to Dr. Tunde Adeyemi" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
