export const WAT = "Africa/Lagos";

export function formatWAT(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-NG", { timeZone: WAT, ...options }).format(date);
}

export function formatDate(date: Date) {
  return formatWAT(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)} · ${formatWAT(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function todayWAT() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: WAT }).format(new Date());
}

export function greetingWAT(date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: WAT,
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .find((part) => part.type === "hour")?.value ?? "12",
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function ageYears(dateOfBirth?: Date | null) {
  if (!dateOfBirth) return null;
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const month = today.getMonth() - dateOfBirth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }
  return age;
}

export function toDateInput(date?: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: WAT }).format(date);
}
