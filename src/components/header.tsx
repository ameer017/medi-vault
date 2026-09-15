import Link from "next/link";
import { auth } from "@/auth";
import { firstName, homeForRole } from "@/lib/auth-redirect";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export async function Header() {
  const session = await auth();
  const home = session ? homeForRole(session.user.role) : "/";

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/70 bg-white/75 px-3 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link href={home} aria-label="MediVault home" className="pl-1">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <HeaderLinks role={session?.user?.role} signedIn={Boolean(session)} />
          {session ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="hidden rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal-dark)] sm:inline">
                {firstName(session.user.name)}
              </span>
              <form action={signOutAction}>
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" type="button">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" type="button">
                  Open a vault
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeaderLinks({ role, signedIn }: { role?: string; signedIn: boolean }) {
  const tab = "rounded-full px-3 py-1.5 text-[var(--ink)] hover:bg-[var(--teal-soft)]";

  if (role === "ADMIN") {
    return (
      <>
        <Link className={`hidden sm:inline ${tab}`} href="/admin">
          Desk
        </Link>
        <Link className={`hidden sm:inline ${tab}`} href="/admin/audit">
          Audit
        </Link>
      </>
    );
  }

  if (role === "CLINICIAN") {
    return (
      <Link className={tab} href="/clinic">
        Ward
      </Link>
    );
  }

  if (signedIn) {
    return (
      <>
        <Link className={tab} href="/dashboard">
          Overview
        </Link>
        <Link className={`hidden sm:inline ${tab}`} href="/chart">
          Chart
        </Link>
        <Link className={tab} href="/share">
          Access
        </Link>
        <Link className={`hidden md:inline ${tab}`} href="/emergency">
          ICE
        </Link>
      </>
    );
  }

  return (
    <Link className={`hidden sm:inline ${tab}`} href="/#how">
      How it works
    </Link>
  );
}
