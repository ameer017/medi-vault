"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

type Role = "ADMIN" | "CLINICIAN" | "PATIENT" | string | undefined;

export function NavBar({
  home,
  name,
  role,
  signedIn,
}: {
  home: string;
  name?: string | null;
  role?: Role;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = navLinks(role, signedIn);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:rounded-full">
        <Link href={home} aria-label="MediVault home" className="min-w-0 shrink py-0.5 pl-0.5">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={tabClass(pathname, link.href)}>
              {link.label}
            </Link>
          ))}
          <AuthControls signedIn={signedIn} name={name} />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="mx-auto mt-2 max-w-7xl rounded-3xl border border-white/70 bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 hover:bg-[var(--teal-soft)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-[var(--line)] pt-3">
            <AuthControls signedIn={signedIn} name={name} stacked />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function AuthControls({
  signedIn,
  name,
  stacked = false,
}: {
  signedIn: boolean;
  name?: string | null;
  stacked?: boolean;
}) {
  if (signedIn) {
    return (
      <div className={stacked ? "flex flex-col gap-2" : "flex items-center gap-2 pl-1"}>
        {name ? (
          <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal-dark)]">
            {name}
          </span>
        ) : null}
        <form action={signOutAction} className={stacked ? "w-full" : undefined}>
          <Button variant="outline" size="sm" type="submit" className={stacked ? "w-full" : undefined}>
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={stacked ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
      <Link href="/login" className={stacked ? "min-w-0" : undefined}>
        <Button variant={stacked ? "outline" : "ghost"} size="sm" type="button" className={stacked ? "w-full" : undefined}>
          Log in
        </Button>
      </Link>
      <Link href="/register" className={stacked ? "min-w-0" : undefined}>
        <Button size="sm" type="button" className={stacked ? "w-full" : undefined}>
          Open a vault
        </Button>
      </Link>
    </div>
  );
}

function navLinks(role: Role, signedIn: boolean) {
  if (role === "ADMIN") {
    return [
      { href: "/admin", label: "Desk" },
      { href: "/admin/facilities", label: "Facilities" },
      { href: "/admin/people", label: "People" },
      { href: "/admin/audit", label: "Audit" },
    ];
  }
  if (role === "CLINICIAN") {
    return [{ href: "/clinic", label: "Ward" }];
  }
  if (signedIn) {
    return [
      { href: "/dashboard", label: "Overview" },
      { href: "/chart", label: "Chart" },
      { href: "/files", label: "Files" },
      { href: "/share", label: "Access" },
      { href: "/emergency", label: "ICE" },
    ];
  }
  return [{ href: "/#how", label: "How it works" }];
}

function tabClass(pathname: string, href: string) {
  const active = href !== "/#how" && (pathname === href || pathname.startsWith(`${href}/`));
  return `rounded-full px-3 py-1.5 text-[var(--ink)] hover:bg-[var(--teal-soft)] ${
    active ? "bg-[var(--teal-soft)] text-[var(--teal-dark)]" : ""
  }`;
}
