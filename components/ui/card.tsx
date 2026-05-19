import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
