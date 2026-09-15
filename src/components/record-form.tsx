"use client";

import { useActionState, useState } from "react";
import type { RecordType } from "@prisma/client";
import { createRecordAction, type ClinicState } from "@/lib/actions/clinic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ErrorBox, SuccessBox } from "@/components/states";
import { recordTypeLabel, recordTypes } from "@/lib/labels";

export function RecordForm({ patientId }: { patientId: string }) {
  const [type, setType] = useState<RecordType>("CONSULTATION");
  const [state, action, pending] = useActionState(createRecordAction, {} as ClinicState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="patientId" value={patientId} />
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <div>
        <Label htmlFor="type">Record type</Label>
        <Select
          id="type"
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value as RecordType)}
        >
          {recordTypes.map((item) => (
            <option key={item} value={item}>
              {recordTypeLabel[item]}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="Follow-up visit" />
      </div>
      <TypeFields type={type} />
      <div>
        <Label htmlFor="summary">Summary</Label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={4}
          className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none ring-[var(--teal)] focus:ring-2"
        />
      </div>
      <Button disabled={pending} type="submit">
        {pending ? "Saving to chart…" : "Add to chart"}
      </Button>
    </form>
  );
}

function TypeFields({ type }: { type: RecordType }) {
  if (type === "VITALS") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <NumberField name="systolic" label="Systolic" />
        <NumberField name="diastolic" label="Diastolic" />
        <NumberField name="pulse" label="Pulse" />
        <NumberField name="tempC" label="Temp °C" step="0.1" />
        <NumberField name="spo2" label="SpO2 %" />
        <NumberField name="weightKg" label="Weight kg" step="0.1" />
      </div>
    );
  }
  if (type === "PRESCRIPTION") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <TextField name="drug" label="Drug" />
        <TextField name="dose" label="Dose" />
        <TextField name="frequency" label="Frequency" />
        <NumberField name="durationDays" label="Days" />
      </div>
    );
  }
  if (type === "LAB") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <TextField name="test" label="Test" />
        <TextField name="result" label="Result" />
        <TextField name="unit" label="Unit" />
        <TextField name="reference" label="Reference" />
      </div>
    );
  }
  if (type === "ALLERGY") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <TextField name="substance" label="Substance" />
        <TextField name="reaction" label="Reaction" />
        <div>
          <Label htmlFor="severity">Severity</Label>
          <Select id="severity" name="severity" defaultValue="Moderate">
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </Select>
        </div>
      </div>
    );
  }
  if (type === "IMMUNIZATION") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <TextField name="vaccine" label="Vaccine" />
        <TextField name="doseNumber" label="Dose" />
        <TextField name="site" label="Site" />
      </div>
    );
  }
  if (type === "CONSULTATION") {
    return (
      <div className="grid gap-3">
        <TextField name="complaint" label="Chief complaint" />
        <TextField name="findings" label="Findings" />
        <TextField name="plan" label="Plan" />
      </div>
    );
  }
  return null;
}

function TextField({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} />
    </div>
  );
}

function NumberField({
  name,
  label,
  step,
}: {
  name: string;
  label: string;
  step?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="number" step={step} />
    </div>
  );
}
