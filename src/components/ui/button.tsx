import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)] shadow-[0_8px_24px_rgba(79,70,229,0.35)]",
        navy: "bg-[var(--ink)] text-[var(--mint)] hover:bg-[var(--ink-2)]",
        gold: "bg-[var(--gold)] text-[var(--ink)] hover:bg-[#d97706]",
        outline:
          "border border-[var(--line)] bg-white/80 text-[var(--ink)] hover:bg-[var(--teal-soft)]",
        ghost: "text-[var(--ink)] hover:bg-[var(--teal-soft)]",
        danger: "bg-[#e11d48] text-white hover:bg-[#be123c]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
