import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { coupons } from "@/lib/mock-data";

export default function AdminMarketingPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="Coupons & Offers">
        <div className="grid gap-4 md:grid-cols-2">
          {coupons.map((coupon) => (
            <GlassCard key={coupon.code}>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300">{coupon.code}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{coupon.title}</p>
              <p className="mt-3 text-sm text-white/55">Min order {coupon.minimumOrderValue}</p>
            </GlassCard>
          ))}
        </div>
      </AdminShell>
    </div>
  );
}
