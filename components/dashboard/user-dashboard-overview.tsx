import { Bell, CreditCard, Heart, MapPin, PackageCheck, UserRoundCog } from "lucide-react";

import { orders } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const widgets = [
  { label: "Orders", value: "18", icon: PackageCheck },
  { label: "Wishlist", value: "09", icon: Heart },
  { label: "Addresses", value: "03", icon: MapPin },
  { label: "Alerts", value: "06", icon: Bell }
];

export function UserDashboardOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {widgets.map(({ label, value, icon: Icon }) => (
          <GlassCard key={label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/55">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </div>
              <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Order History</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Recent Purchases</h3>
            </div>
            <CreditCard className="h-5 w-5 text-white/40" />
          </div>
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{order.number}</p>
                    <p className="text-xs text-white/45">Expected delivery {order.eta}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Total</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(order.total)}</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-pink p-5 text-white">
              <UserRoundCog className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Aarav Iyer</p>
              <p className="text-sm text-white/50">Prototyping member since Feb 2026</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <p>Default shipping: Bangalore, Karnataka</p>
            <p>Invoice preference: GST enabled</p>
            <p>Saved payment methods: UPI, Razorpay, Stripe card</p>
            <p>Support channel: WhatsApp priority</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
