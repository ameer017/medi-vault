"use client";

import { useActionState } from "react";
import { updateProfileAction, type FormState } from "@/lib/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ErrorBox, SuccessBox } from "@/components/states";
import { toDateInput } from "@/lib/datetime";
import { bloodGroupLabel, genotypeLabel, sexLabel } from "@/lib/labels";

export function ProfileForm({
  name,
  phone,
  dateOfBirth,
  sex,
  bloodGroup,
  genotype,
  nhiaNumber,
  emergencyName,
  emergencyPhone,
}: {
  name: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  sex?: keyof typeof sexLabel | null;
  bloodGroup?: keyof typeof bloodGroupLabel | null;
  genotype?: keyof typeof genotypeLabel | null;
  nhiaNumber?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, {} as FormState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={name} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={phone ?? ""} />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={toDateInput(dateOfBirth)} />
      </div>
      <div>
        <Label htmlFor="sex">Sex</Label>
        <Select id="sex" name="sex" defaultValue={sex ?? ""}>
          <option value="">Not set</option>
          {Object.entries(sexLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="bloodGroup">Blood group</Label>
        <Select id="bloodGroup" name="bloodGroup" defaultValue={bloodGroup ?? ""}>
          <option value="">Not set</option>
          {Object.entries(bloodGroupLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="genotype">Genotype</Label>
        <Select id="genotype" name="genotype" defaultValue={genotype ?? ""}>
          <option value="">Not set</option>
          {Object.entries(genotypeLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="nhiaNumber">NHIA number</Label>
        <Input id="nhiaNumber" name="nhiaNumber" defaultValue={nhiaNumber ?? ""} />
      </div>
      <div>
        <Label htmlFor="emergencyName">Emergency contact</Label>
        <Input id="emergencyName" name="emergencyName" defaultValue={emergencyName ?? ""} />
      </div>
      <div>
        <Label htmlFor="emergencyPhone">Emergency phone</Label>
        <Input id="emergencyPhone" name="emergencyPhone" defaultValue={emergencyPhone ?? ""} />
      </div>
      <div className="md:col-span-2">
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
