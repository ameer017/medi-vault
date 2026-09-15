import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-4 pb-8 pt-4">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-white/70 bg-white/60 px-6 py-8 backdrop-blur md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">MediVault</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A patient-owned chart for Nigeria. Demo data only — not a live hospital system.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[var(--ink)]">Live on this demo</p>
          <p className="mt-2 text-[var(--muted)]">LUTH · National Hospital Abuja · UCH Ibadan · Reddington</p>
        </div>
        <div className="md:text-right">
          <Link href="/login" className="text-sm font-semibold text-[var(--teal)]">
            Jump into the seeded vault →
          </Link>
          <p className="mt-2 text-xs text-[var(--muted)]">WAT clocks · NHIA-style IDs · revoke-anytime grants</p>
        </div>
      </div>
    </footer>
  );
}
