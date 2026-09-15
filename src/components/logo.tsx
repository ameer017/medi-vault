import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[var(--ink)]", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ink)] text-[var(--mint)] shadow-[0_0_0_4px_rgba(34,211,238,0.15)]">
        <Activity className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {compact ? null : (
        <span className="leading-none">
          <span className="block font-display text-xl font-bold tracking-tight">MediVault</span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
            Live chart OS
          </span>
        </span>
      )}
    </span>
  );
}
