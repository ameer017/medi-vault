import type { BloodGroup, Genotype, RecordType, Sex } from "@prisma/client";

export const bloodGroupLabel: Record<BloodGroup, string> = {
  A_POS: "A+",
  A_NEG: "A−",
  B_POS: "B+",
  B_NEG: "B−",
  AB_POS: "AB+",
  AB_NEG: "AB−",
  O_POS: "O+",
  O_NEG: "O−",
};

export const genotypeLabel: Record<Genotype, string> = {
  AA: "AA",
  AS: "AS",
  SS: "SS",
  AC: "AC",
  SC: "SC",
};

export const sexLabel: Record<Sex, string> = {
  FEMALE: "Female",
  MALE: "Male",
  OTHER: "Other",
};

export const recordTypeLabel: Record<RecordType, string> = {
  CONSULTATION: "Consultation",
  VITALS: "Vitals",
  PRESCRIPTION: "Prescription",
  LAB: "Lab result",
  ALLERGY: "Allergy",
  IMMUNIZATION: "Immunization",
  NOTE: "Note",
};

export const recordTypes: RecordType[] = [
  "CONSULTATION",
  "VITALS",
  "PRESCRIPTION",
  "LAB",
  "ALLERGY",
  "IMMUNIZATION",
  "NOTE",
];
