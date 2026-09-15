import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  await redirectIfAuthenticated();
  const { callbackUrl } = await searchParams;
  const next = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "";

  return (
    <div className="mx-auto grid max-w-7xl overflow-hidden px-4 py-8 lg:grid-cols-2 lg:gap-0 lg:rounded-[2.5rem] lg:border lg:border-white/70 lg:bg-white/40">
      <aside className="relative hidden overflow-hidden bg-[var(--ink)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="font-display text-3xl">Pulse in. Chart out.</p>
        <div>
          <p className="font-display text-5xl leading-none">Three desks.</p>
          <p className="mt-4 max-w-sm text-sm text-white/65">
            Patients land on the vault. Clinicians land on granted charts. Operators land on the network desk.
          </p>
        </div>
        <svg className="h-20 w-full" viewBox="0 0 360 64" fill="none" aria-hidden>
          <path
            className="ecg"
            d="M0 32 H40 L52 32 L62 8 L74 56 L86 32 H140 L152 32 L162 14 L174 50 L186 32 H360"
            stroke="#22d3ee"
            strokeWidth="2"
          />
        </svg>
      </aside>
      <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm lg:rounded-none lg:bg-transparent lg:p-12 lg:shadow-none">
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mb-6 mt-2 text-sm text-[var(--muted)]">Use a seeded account or your own vault.</p>
        <LoginForm callbackUrl={next} />
        <div className="mt-5 space-y-1 rounded-2xl bg-[var(--teal-soft)]/60 px-4 py-3 text-xs text-[var(--teal-dark)]">
          <p>Patient · amina@medivault.ng / patient123</p>
          <p>Clinician · tunde@medivault.ng / clinician123</p>
          <p>Operator · admin@medivault.ng / Vault!admin</p>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          New here?{" "}
          <Link className="font-semibold text-[var(--teal)]" href="/register">
            Create a vault
          </Link>
        </p>
      </div>
    </div>
  );
}
