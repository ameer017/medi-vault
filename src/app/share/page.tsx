import { GrantEmailForm, ShareCodeButton } from "@/components/forms";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { expireStaleGrants, getOwnPatient } from "@/lib/access";
import { revokeGrantAction } from "@/lib/actions/patient";
import { formatDateTime } from "@/lib/datetime";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Share access" };

export default async function SharePage() {
  const session = await requirePatient("/share");
  await expireStaleGrants();
  const patient = await getOwnPatient(session.user.id);
  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="No chart yet" body="Complete your profile before sharing." />
      </div>
    );
  }

  const unusedCodes = patient.grants.filter((grant) => grant.status === "ACTIVE" && grant.code && !grant.clinicianId);
  const active = patient.grants.filter((grant) => grant.status === "ACTIVE" && grant.clinicianId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Keys</p>
      <h1 className="mt-1 font-display text-5xl">Hand someone the chart. Take it back.</h1>
      <p className="mb-6 mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Walk-in codes last 24 hours until redeemed. Named grants last 1, 7 or 30 days.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[2rem] bg-[var(--ink)] p-6 text-white">
          <h2 className="font-display text-3xl">Walk-in code</h2>
          <p className="mb-5 mt-2 text-sm text-white/60">Show this at reception. One clinician, one use.</p>
          <ShareCodeButton />
          {unusedCodes.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm">
              {unusedCodes.map((grant) => (
                <li key={grant.id} className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2">
                  <span className="font-mono tracking-widest text-[var(--mint)]">{grant.code}</span>
                  <span className="text-xs text-white/50">until {formatDateTime(grant.expiresAt)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        <section className="rounded-[2rem] bg-white/80 p-6">
          <h2 className="font-display text-3xl">Named clinician</h2>
          <p className="mb-5 mt-2 text-sm text-[var(--muted)]">Grant by email if they already have a MediVault login.</p>
          <GrantEmailForm />
        </section>
      </div>

      <section className="mt-4 rounded-[2rem] bg-white/80 p-6">
        <h2 className="font-display text-3xl">Who holds a key</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No clinician currently has access.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {active.map((grant) => (
              <li key={grant.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--paper)] px-4 py-3">
                <div>
                  <p className="font-medium">{grant.clinician?.name ?? "Pending redeem"}</p>
                  <p className="text-xs text-[var(--muted)]">Expires {formatDateTime(grant.expiresAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="teal">Live</Badge>
                  <form action={revokeGrantAction}>
                    <input type="hidden" name="grantId" value={grant.id} />
                    <Button type="submit" size="sm" variant="danger">
                      Revoke
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
