import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] outline-none ring-[var(--teal)] focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
