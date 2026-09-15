import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">404</p>
      <h1 className="mt-2 font-display text-4xl">This record was not found</h1>
      <p className="mt-3 text-[var(--muted)]">The page, chart, or emergency token does not exist.</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-[var(--teal)]">
        Back home
      </Link>
    </div>
  );
}
