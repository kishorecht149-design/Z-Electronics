"use client";

import { products } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const cartLines = useCartStore((state) => state.items);
  const items = cartLines.map((line) => ({
    ...line,
    product: products.find((product) => product.id === line.productId)!
  }));
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Cart</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <GlassCard key={item.productId} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{item.product.name}</p>
                <p className="text-sm text-white/50">Qty {item.quantity}</p>
              </div>
              <p className="text-lg font-semibold text-white">{formatCurrency(item.product.price * item.quantity)}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="h-fit">
          <p className="text-2xl font-semibold text-white">Summary</p>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(99)}</span></div>
            <div className="flex justify-between"><span>Coupon</span><span>-{formatCurrency(150)}</span></div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>{formatCurrency(total - 51)}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
