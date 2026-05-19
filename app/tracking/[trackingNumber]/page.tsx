"use client";

import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Package, Truck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth-store";

const STATUS_STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function TrackingPage() {
  const params = useParams();
  const trackingId = String(params.trackingNumber);
  const { isAuthenticated } = useAuthStore();

  const { data: res, isLoading } = useQuery({
    queryKey: ["track", trackingId],
    queryFn: () => orderService.trackOrder(trackingId),
    enabled: isAuthenticated,
    retry: false
  });

  if (!isAuthenticated) {
    return (
      <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/60">Please sign in to track your order.</p>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const order = res?.data;
  if (!order) return notFound();

  const progressIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page-shell py-16 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-violet-400 font-medium mb-2">Order Tracking</p>
        <h1 className="text-4xl font-semibold text-white">Track Your Order</h1>
        <p className="mt-3 text-sm text-white/60">
          Order <span className="font-mono text-white">{order.number}</span>
          {order.createdAt && ` · Placed on ${format(new Date(order.createdAt), "dd MMM yyyy")}`}
        </p>
      </div>

      {/* Status Progress */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
          <Truck className="h-4 w-4 text-violet-400" /> Shipment Status
        </h2>
        <div className="relative">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-700"
              style={{ width: progressIdx >= 0 ? `${(progressIdx / (STATUS_STEPS.length - 1)) * 100}%` : "0%" }}
            />
          </div>
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= progressIdx;
              return (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-violet-600 border-violet-500" : "bg-black/40 border-white/20"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> : <span className="h-2 w-2 rounded-full bg-white/30" />}
                  </div>
                  <span className={`text-[10px] text-center max-w-[55px] leading-tight ${done ? "text-white" : "text-white/30"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Tracking Metadata */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-white/45">Order Number</p>
          <p className="mt-2 font-mono text-lg font-semibold text-white">{order.number}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-white/45">Status</p>
          <p className="mt-2 text-lg font-semibold text-white">{order.status}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-widest text-white/45">Payment</p>
          <p className={`mt-2 text-lg font-semibold capitalize ${order.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}>
            {order.paymentStatus}
          </p>
        </GlassCard>
      </div>

      {/* Timeline */}
      {order.timeline?.length > 0 && (
        <GlassCard className="p-6 mb-8">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-violet-400" /> Activity Log
          </h2>
          <div className="space-y-4">
            {[...order.timeline].reverse().map((event: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-violet-500 mt-1 flex-shrink-0" />
                  {i < order.timeline.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-white">{event.status}</p>
                  {event.message && <p className="text-xs text-white/50 mt-0.5">{event.message}</p>}
                  {event.date && (
                    <p className="text-xs text-white/30 mt-1">{format(new Date(event.date), "dd MMM yyyy, hh:mm a")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="flex justify-center gap-4">
        <Link href="/dashboard"><Button variant="outline">My Orders</Button></Link>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
