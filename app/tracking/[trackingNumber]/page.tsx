import { notFound } from "next/navigation";

import { TrackingTimeline } from "@/components/product/tracking-timeline";
import { GlassCard } from "@/components/ui/card";
import { orders } from "@/lib/mock-data";

export default async function TrackingPage({
  params
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const { trackingNumber } = await params;
  const orderData = orders.find((item) => item.trackingNumber === trackingNumber);

  if (!orderData) {
    notFound();
  }

  const order = orderData;
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Order Tracking</h1>
      <p className="mt-4 text-sm leading-7 text-white/60">Tracking number {order.trackingNumber} with {order.deliveryPartner}</p>
      <div className="mt-10 space-y-6">
        <TrackingTimeline timeline={order.timeline} />
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Tracking Number</p>
            <p className="mt-3 text-xl font-semibold text-white">{order.trackingNumber}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Estimated Delivery</p>
            <p className="mt-3 text-xl font-semibold text-white">{order.eta}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Delivery Partner</p>
            <p className="mt-3 text-xl font-semibold text-white">{order.deliveryPartner}</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
