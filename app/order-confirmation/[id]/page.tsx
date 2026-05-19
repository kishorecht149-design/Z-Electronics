"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronRight, Loader2, Package, Truck } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { orderService } from "@/services/order.service";
import { formatCurrency } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function getStatusProgress(status: string): number {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: res, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrder(id),
    refetchInterval: 30000 // Poll every 30s
  });

  const order = res?.data;

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-white/20" />
        <p className="text-white/60">Order not found</p>
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10">
          View All Orders
        </Link>
      </div>
    );
  }

  const progress = getStatusProgress(order.status);
  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="page-shell py-16 max-w-3xl mx-auto">
      {/* Header */}
      <GlassCard className="p-8 mb-8 text-center">
        <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${isPaid ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-amber-500/20 border border-amber-500/30"}`}>
          <CheckCircle2 className={`h-8 w-8 ${isPaid ? "text-emerald-400" : "text-amber-400"}`} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {isPaid ? "Order Confirmed!" : "Order Pending Payment"}
        </h1>
        <p className="text-white/60 text-sm mb-4">
          {isPaid ? "Your payment was successful. We're preparing your order." : "Complete your payment to confirm the order."}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <span className="text-xs text-white/50">Order Number</span>
          <span className="text-sm font-mono font-medium text-violet-300">{order.number}</span>
        </div>
      </GlassCard>

      {/* Progress Tracker */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
          <Truck className="h-4 w-4 text-violet-400" /> Order Status
        </h2>
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${(progress / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {/* Steps */}
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= progress;
              return (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-violet-600 border-violet-500" : "bg-black/40 border-white/20"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> : <span className="h-2 w-2 rounded-full bg-white/30" />}
                  </div>
                  <span className={`text-[10px] text-center max-w-[60px] leading-tight ${done ? "text-white" : "text-white/30"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Items */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{item.name}</p>
                <p className="text-xs text-white/50">SKU: {item.sku} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-white">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Price Summary */}
      <GlassCard className="p-6 mb-8">
        <h2 className="text-base font-semibold text-white mb-4">Payment Summary</h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          {order.discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>−{formatCurrency(order.discountAmount)}</span></div>}
          <div className="flex justify-between text-white/60"><span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}</span></div>
          <div className="flex justify-between text-white/60"><span>GST (18%)</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10"><span>Total Paid</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </GlassCard>

      <div className="flex gap-4 justify-center">
        <Link href="/shop" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10">
          Continue Shopping
        </Link>
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-pink px-5 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:brightness-110">
          <ChevronRight className="mr-2 h-4 w-4" /> View All Orders
        </Link>
      </div>
    </div>
  );
}
