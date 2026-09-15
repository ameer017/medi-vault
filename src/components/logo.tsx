import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[var(--ink)]", className)}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-[var(--mint)] shadow-[0_0_0_4px_rgba(34,211,238,0.15)] sm:h-10 sm:w-10">
        <Activity className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {compact ? null : (
        <span className="min-w-0 leading-none">
          <span className="block font-display text-lg font-bold tracking-tight sm:text-xl">MediVault</span>
          <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--muted)] sm:block">
            Live chart OS
          </span>
        </span>
      )}
    </span>
  );
}
