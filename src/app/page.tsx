import Link from "next/link";
import { ArrowUpRight, Fingerprint, KeyRound, QrCode, Shield } from "lucide-react";
import { auth } from "@/auth";
import { firstName, homeForRole } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:pt-14">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
              <span className="relative h-2 w-2 rounded-full bg-[var(--mint)] pulse-dot" />
              live chart OS
            </p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[0.95] md:text-7xl">
              Your body.
              <span className="block text-[var(--teal)]">Your keys.</span>
              Not the hospital’s.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Allergies, genotype, labs and notes live in one vault. You issue a
              time-boxed code to a clinician — then you can kill it. Carry an ICE
              card for blood group and who to call.
            </p>
            {session ? (
              <Link
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)]"
                href={homeForRole(session.user.role)}
              >
                Continue to your {session.user.role === "ADMIN" ? "desk" : session.user.role === "CLINICIAN" ? "ward" : "vault"}, {firstName(session.user.name)}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg" type="button">
                    Open a vault
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="navy" type="button">
                    Enter demo
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <LandingDevice />
        </div>
      </section>

      <section id="how" className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-6">
        <Bento
          className="md:col-span-3 bg-[var(--ink)] text-white"
          icon={Shield}
          kicker="Ownership"
          title="You hold the chart"
          body="NHIA number, genotype, medications and visit notes — not a hospital folder you cannot take home."
          light
        />
        <Bento
          className="md:col-span-3"
          icon={KeyRound}
          kicker="Access"
          title="Share, then revoke"
          body="24-hour walk-in codes, or named grants for 1 / 7 / 30 days. Pull the plug anytime."
        />
        <Bento
          className="md:col-span-2"
          icon={QrCode}
          kicker="ICE"
          title="Emergency QR"
          body="Blood group, allergies, who to call. Not the full notes."
        />
        <Bento
          className="md:col-span-4 bg-gradient-to-br from-indigo-50 to-cyan-50"
          icon={Fingerprint}
          kicker="Seeded demo"
          title="Amina at LUTH, already live"
          body="Patient amina@medivault.ng / patient123. Clinician tunde@medivault.ng / clinician123 has a 7-day grant."
        />
      </section>
    </div>
  );
}

function Bento({
  className,
  icon: Icon,
  kicker,
  title,
  body,
  light,
}: {
  className?: string;
  icon: typeof Shield;
  kicker: string;
  title: string;
  body: string;
  light?: boolean;
}) {
  return (
    <div className={`rounded-[2rem] border border-white/80 p-6 md:p-8 ${className ?? "bg-white/75"}`}>
      <Icon className={`mb-4 h-6 w-6 ${light ? "text-[var(--mint)]" : "text-[var(--teal)]"}`} />
      <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${light ? "text-cyan-200" : "text-[var(--teal)]"}`}>
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-3xl">{title}</h2>
      <p className={`mt-3 text-sm leading-relaxed ${light ? "text-white/70" : "text-[var(--muted)]"}`}>{body}</p>
    </div>
  );
}

function LandingDevice() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[var(--mint)]/40 blur-3xl" />
      <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-indigo-400/40 blur-3xl" />
      <div className="float-card relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-[var(--ink)] p-5 text-white shadow-[0_40px_80px_rgba(7,9,26,0.45)]">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-cyan-200">
          <span>ICE · Amina Bello</span>
          <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-cyan-200">O+ · AA</span>
        </div>
        <p className="mt-6 font-display text-5xl font-extrabold leading-none">O+</p>
        <p className="mt-2 text-sm text-white/60">Penicillin allergy · call Ibrahim</p>
        <svg className="mt-8 h-16 w-full" viewBox="0 0 360 64" fill="none" aria-hidden>
          <path
            className="ecg"
            d="M0 32 H40 L52 32 L62 8 L74 56 L86 32 H140 L152 32 L162 14 L174 50 L186 32 H360"
            stroke="#22d3ee"
            strokeWidth="2.4"
          />
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="text-white/50">BP</p>
            <p className="mt-1 font-semibold">138/86</p>
          </div>
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="text-white/50">Pulse</p>
            <p className="mt-1 font-semibold">92</p>
          </div>
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="text-white/50">SpO2</p>
            <p className="mt-1 font-semibold">98%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
