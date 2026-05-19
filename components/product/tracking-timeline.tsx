import { CheckCheck, Package, Truck, CircleDashed, HomeIcon } from "lucide-react";

import type { TrackingEvent } from "@/models/domain";
import { GlassCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons = {
  ordered: CircleDashed,
  packed: Package,
  shipped: Truck,
  "out-for-delivery": Truck,
  delivered: HomeIcon
};

export function TrackingTimeline({ timeline }: { timeline: TrackingEvent[] }) {
  return (
    <GlassCard className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Realtime Style Tracking</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Order Progress</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {timeline.map((step) => {
          const Icon = icons[step.status];
          return (
            <div key={step.status} className="relative">
              <div className="absolute left-7 top-7 hidden h-px w-full bg-white/10 md:block" />
              <div className="relative space-y-3">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full border text-white/40",
                    step.done && "border-violet-400 bg-violet-500/20 text-white",
                    step.current && "border-pink bg-pink/20 text-white shadow-glow"
                  )}
                >
                  {step.done ? <CheckCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{step.label}</p>
                  <p className="text-xs text-white/45">{step.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
