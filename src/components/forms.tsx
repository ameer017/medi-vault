"use client";

import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/lib/actions/auth";
import {
  generateShareCodeAction,
  grantByEmailAction,
  type FormState,
} from "@/lib/actions/patient";
import { redeemCodeAction, type ClinicState } from "@/lib/actions/clinic";
import { createClinicianAction, createFacilityAction, type AdminState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ErrorBox, SuccessBox } from "@/components/states";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(loginAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@email.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Amina Bello" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="0801 234 5678" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating vault…" : "Create my vault"}
      </Button>
    </form>
  );
}

export function ShareCodeButton() {
  const [state, action, pending] = useActionState(generateShareCodeAction, {} as FormState);

  return (
    <form action={action} className="space-y-3">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      {state.code ? (
        <p className="rounded-2xl bg-[var(--mint)] px-4 py-4 text-center font-mono text-3xl tracking-[0.35em] text-[var(--ink)]">
          {state.code}
        </p>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? "Creating code…" : "Generate 24-hour code"}
      </Button>
    </form>
  );
}

export function GrantEmailForm() {
  const [state, action, pending] = useActionState(grantByEmailAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <div>
        <Label htmlFor="email">Clinician email</Label>
        <Input id="email" name="email" type="email" required placeholder="tunde@medivault.ng" />
      </div>
      <div>
        <Label htmlFor="days">Access length</Label>
        <Select id="days" name="days" defaultValue="7">
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
        </Select>
      </div>
      <Button disabled={pending} type="submit">
        {pending ? "Granting…" : "Grant access"}
      </Button>
    </form>
  );
}

export function RedeemCodeForm() {
  const [state, action, pending] = useActionState(redeemCodeAction, {} as ClinicState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <div>
        <Label htmlFor="code">Patient share code</Label>
        <Input id="code" name="code" required placeholder="AB12CD" className="uppercase tracking-widest" />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Opening chart…" : "Redeem code"}
      </Button>
    </form>
  );
}

export function FacilityForm() {
  const [state, action, pending] = useActionState(createFacilityAction, {} as AdminState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-3">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div>
        <Label htmlFor="name">Facility</Label>
        <Input id="name" name="name" required placeholder="Lagos University Teaching Hospital" />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required placeholder="Lagos" />
      </div>
      <div>
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" required placeholder="LUTH" />
      </div>
      <div className="md:col-span-3">
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : "Add facility"}
        </Button>
      </div>
    </form>
  );
}

export function ClinicianForm({ facilities }: { facilities: { id: string; name: string; code: string }[] }) {
  const [state, action, pending] = useActionState(createClinicianAction, {} as AdminState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Dr. Adaeze Okonkwo" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div>
        <Label htmlFor="password">Temporary password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <div>
        <Label htmlFor="licenseNumber">MDCN licence</Label>
        <Input id="licenseNumber" name="licenseNumber" required placeholder="MDCN-00000" />
      </div>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Input id="specialty" name="specialty" required placeholder="Family medicine" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="facilityId">Facility</Label>
        <Select id="facilityId" name="facilityId" required>
          <option value="">Select facility</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.code} · {facility.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-2">
        <Button disabled={pending} type="submit">
          {pending ? "Creating…" : "Create clinician"}
        </Button>
      </div>
    </form>
  );
}
