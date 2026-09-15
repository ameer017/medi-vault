import { auth } from "@/auth";
import { firstName, homeForRole } from "@/lib/auth-redirect";
import { NavBar } from "@/components/nav-bar";

export async function Header() {
  const session = await auth();
  const home = session ? homeForRole(session.user.role) : "/";

  return (
    <NavBar
      home={home}
      name={session ? firstName(session.user.name) : undefined}
      role={session?.user?.role}
      signedIn={Boolean(session)}
    />
  );
}
