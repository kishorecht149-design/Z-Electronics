import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { orders } from "@/lib/mock-data";

export default function AdminOrdersPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="Orders Management">
        <div className="space-y-4">
          {orders.map((order) => (
            <GlassCard key={order.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{order.number}</p>
                  <p className="text-sm text-white/50">{order.trackingNumber} • {order.deliveryPartner}</p>
                </div>
                <div className="rounded-full bg-violet-500/15 px-3 py-1 text-sm text-violet-200">{order.status}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </AdminShell>
    </div>
  );
}
