import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-violet-600 via-violet-500 to-pink text-white shadow-glow hover:brightness-110",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  ghost: "bg-transparent text-violet-200 hover:bg-white/5",
  outline: "border border-white/10 bg-transparent text-white hover:bg-white/10"
} as const;

const sizes = {
  default: "px-5 py-3 text-sm",
  sm: "px-3 py-1.5 text-xs rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl"
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "default", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
