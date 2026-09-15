import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ink",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "ink" | "teal" | "gold" | "muted" | "danger";
}) {
  const tones = {
    ink: "bg-[var(--ink)] text-[var(--mint)]",
    teal: "bg-[var(--teal-soft)] text-[var(--teal-dark)]",
    gold: "bg-[var(--gold-soft)] text-amber-800",
    muted: "bg-white text-[var(--muted)]",
    danger: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
