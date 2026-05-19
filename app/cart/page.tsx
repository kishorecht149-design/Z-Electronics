"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Loader2, PackageOpen, Plus, ShieldCheck, Ticket, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/order.service";
import { productsService } from "@/services/products.service";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const { items, updateQuantity, clearStore } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cart-products", items.map((i) => i.productId).join(",")],
    queryFn: async () => {
      if (items.length === 0) return [];
      const results = await Promise.all(
        items.map((item) =>
          productsService.getProductById(item.productId).catch(() => null)
        )
      );
      return results
        .map((res: any, idx) => res?.data ? { ...res.data, cartQty: items[idx]?.quantity } : null)
        .filter(Boolean);
    },
    enabled: items.length > 0
  });

  const cartProducts: any[] = data || [];

  const couponMutation = useMutation({
    mutationFn: () => {
      const subtotal = cartProducts.reduce((s, p) => s + p.price * p.cartQty, 0);
      return orderService.validateCoupon(couponCode, subtotal);
    },
    onSuccess: (res) => {
      setAppliedCoupon(res.data);
      toast.success(`Coupon applied! You save ${formatCurrency(res.data.discountAmount)}`);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Invalid coupon")
  });

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.cartQty, 0);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : subtotal > 0 ? 49 : 0;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  if (!isLoading && items.length === 0) {
    return (
      <div className="page-shell py-24 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <PackageOpen className="h-10 w-10 text-white/30" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-white/60 mb-8 max-w-md">Looks like you haven't added any components yet. Let's get building!</p>
        <Link href="/shop"><Button size="lg">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="page-shell py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Your Cart</h1>
        <p className="text-white/60 mt-2">{totalItems} item{totalItems !== 1 ? "s" : ""} in your order</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Free Shipping Progress */}
          <GlassCard className="p-5 border-emerald-500/30 bg-emerald-900/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                {remainingForFreeShipping === 0 ? (
                  <Check className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Truck className="h-5 w-5 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {remainingForFreeShipping === 0
                    ? "You've unlocked free shipping!"
                    : `Add ${formatCurrency(remainingForFreeShipping)} more for free shipping`}
                </p>
                <p className="text-xs text-white/60">Standard delivery: 2–4 business days.</p>
              </div>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </GlassCard>

          {/* Cart Items */}
          <div className="space-y-4">
            <h2 className="font-semibold text-white text-lg">Order Items</h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (
              cartProducts.map((product) => {
                const line = items.find((i) => i.productId === product._id);
                return (
                  <div key={product._id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-xl bg-white/5 overflow-hidden">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
                            {typeof product.brand === "object" ? product.brand?.name : product.brand}
                          </p>
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-medium text-white text-base hover:text-violet-300 transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                        </div>
                        <p className="font-bold text-white text-lg">{formatCurrency(product.price * (line?.quantity ?? 1))}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white/50">Qty:</span>
                          <select
                            className="appearance-none rounded-lg border border-white/10 bg-black/40 py-1 pl-3 pr-8 text-sm text-white outline-none focus:border-violet-500/50"
                            value={line?.quantity ?? 1}
                            onChange={(e) => updateQuantity(product._id, Number(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5, 10, 25, 50].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => updateQuantity(product._id, 0)}
                          className="text-xs text-white/40 hover:text-pink transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column — Order Summary */}
        <div className="space-y-6">
          <GlassCard className="sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm text-white/70 mb-6">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>−{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingFee === 0 ? (
                  <span className="font-medium text-emerald-400">Free</span>
                ) : (
                  <span className="font-medium text-white">{formatCurrency(shippingFee)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-medium text-white">Calculated at checkout</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
                  <span className="text-sm text-emerald-400 font-medium">{couponCode.toUpperCase()} applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-white/40 hover:text-white text-xs">✕</button>
                </div>
              ) : (
                <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-20 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                  <button
                    onClick={() => couponMutation.mutate()}
                    disabled={!couponCode || couponMutation.isPending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors disabled:opacity-40"
                  >
                    {couponMutation.isPending ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex items-end justify-between">
                <span className="text-lg font-semibold text-white">Subtotal</span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(Math.max(subtotal - discountAmount + shippingFee, 0))}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full text-base h-12 shadow-lg shadow-violet-500/20">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/5 p-4">
              <Truck className="h-5 w-5 text-white/40 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Free Shipping on orders ≥ ₹999</p>
                <p className="text-xs text-white/50 mt-1">Express options available at checkout.</p>
              </div>
            </div>

            <div className="mt-4 flex justify-center items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="h-4 w-4" /> Secure SSL Encrypted Checkout
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
