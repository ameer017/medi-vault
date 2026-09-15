import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata = { title: "Register" };

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <div className="mx-auto grid max-w-7xl overflow-hidden px-4 py-8 lg:grid-cols-2 lg:rounded-[2.5rem] lg:border lg:border-white/70 lg:bg-white/40">
      <aside className="relative hidden overflow-hidden bg-[var(--ink)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Patient vault</p>
        <div>
          <p className="font-display text-5xl leading-none">Open the lock. Keep the key.</p>
          <p className="mt-4 max-w-sm text-sm text-white/65">
            Registration creates a patient chart. Clinician accounts are issued from the operator desk.
          </p>
        </div>
        <p className="text-sm text-white/50">Blood group · genotype · NHIA · ICE contact</p>
      </aside>
      <div className="rounded-[2rem] bg-white/80 p-6 lg:rounded-none lg:bg-transparent lg:p-12">
        <h1 className="font-display text-4xl">Open your MediVault</h1>
        <p className="mb-6 mt-2 text-sm text-[var(--muted)]">Takes a name, email, and a password of 8+ characters.</p>
        <RegisterForm />
        <p className="mt-4 text-sm text-[var(--muted)]">
          Already have a vault?{" "}
          <Link className="font-semibold text-[var(--teal)]" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
