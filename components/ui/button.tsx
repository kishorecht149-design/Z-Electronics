import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-violet-600 via-violet-500 to-pink text-white shadow-glow hover:brightness-110",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  ghost: "bg-transparent text-violet-200 hover:bg-white/5"
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
