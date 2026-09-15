export function homeForRole(role: "ADMIN" | "CLINICIAN" | "PATIENT" | string | undefined) {
  if (role === "ADMIN") return "/admin";
  if (role === "CLINICIAN") return "/clinic";
  return "/dashboard";
}

export function firstName(name?: string | null) {
  const value = name?.trim();
  if (!value) return "there";
  return value.split(/\s+/)[0] ?? "there";
}

function isSafePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export function resolvePostAuthPath(
  role: "ADMIN" | "CLINICIAN" | "PATIENT" | string | undefined,
  callbackUrl?: string | null,
) {
  const home = homeForRole(role);
  if (!callbackUrl || callbackUrl === "/" || !isSafePath(callbackUrl)) {
    return home;
  }

  if (role === "ADMIN") {
    if (!callbackUrl.startsWith("/admin")) return home;
    return callbackUrl;
  }

  if (role === "CLINICIAN") {
    if (!callbackUrl.startsWith("/clinic")) return home;
    return callbackUrl;
  }

  if (callbackUrl.startsWith("/admin") || callbackUrl.startsWith("/clinic")) return home;
  return callbackUrl;
}
