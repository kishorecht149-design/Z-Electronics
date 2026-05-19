"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, PackageOpen, Plus, ShieldCheck, Ticket, Trash2, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const cartLines = useCartStore((state) => state.items);
  const items = cartLines.map((line) => ({
    ...line,
    product: products.find((product) => product.id === line.productId)!
  })).filter(item => item.product);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1500;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
  
  const upsells = products.slice(3, 5);

  if (items.length === 0) {
    return (
      <div className="page-shell py-24 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <PackageOpen className="h-10 w-10 text-white/30" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-white/60 mb-8 max-w-md">Looks like you haven't added any components to your cart yet. Let's get building!</p>
        <Link href="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Your Cart</h1>
        <p className="text-white/60 mt-2">{items.reduce((acc, i) => acc + i.quantity, 0)} items in your order</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Cart Items & Upsells */}
        <div className="space-y-8">
          {/* Shipping Progress */}
          <GlassCard className="p-5 border-emerald-500/30 bg-emerald-900/10">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                   {remainingForFreeShipping === 0 ? <Check className="h-5 w-5 text-emerald-400" /> : <Truck className="h-5 w-5 text-emerald-400" />}
                </div>
                <div>
                   <p className="font-semibold text-white">
                     {remainingForFreeShipping === 0 
                        ? "You've unlocked free express shipping!" 
                        : `You're ${formatCurrency(remainingForFreeShipping)} away from free shipping`}
                   </p>
                   <p className="text-xs text-white/60">Standard delivery usually takes 2-4 business days.</p>
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
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 relative group">
                <div className="relative h-24 w-24 shrink-0 rounded-xl bg-white/5 overflow-hidden">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">{item.product.brand}</p>
                       <Link href={`/product/${item.product.slug}`} className="font-medium text-white text-base hover:text-violet-300 transition-colors line-clamp-1">
                          {item.product.name}
                       </Link>
                     </div>
                     <p className="font-bold text-white text-lg">{formatCurrency(item.product.price * item.quantity)}</p>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="text-sm text-white/50">Qty:</span>
                        <select 
                          className="appearance-none rounded-lg border border-white/10 bg-black/40 py-1 pl-3 pr-8 text-sm text-white outline-none focus:border-violet-500/50"
                          defaultValue={item.quantity}
                        >
                          {[1, 2, 3, 4, 5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                     </div>
                     <button className="text-xs text-white/40 hover:text-pink transition-colors flex items-center gap-1">
                       <Trash2 className="h-3.5 w-3.5" /> Remove
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upsells */}
          <div className="pt-8 border-t border-white/10">
            <h2 className="font-semibold text-white text-lg mb-4">Frequently Bought Together</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {upsells.map(product => (
                <div key={product.id} className="flex gap-4 rounded-xl border border-white/5 bg-black/40 p-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg bg-white/5 overflow-hidden">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                     <p className="font-medium text-white text-sm line-clamp-1">{product.name}</p>
                     <p className="text-white/60 text-xs mt-1">{formatCurrency(product.price)}</p>
                     <button className="mt-2 text-xs font-medium text-violet-300 flex items-center gap-1 hover:text-violet-200">
                       <Plus className="h-3 w-3" /> Add to Order
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <GlassCard className="sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-white/70 mb-6">
              <div className="flex justify-between">
                 <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                 <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                 <span>Shipping</span>
                 {remainingForFreeShipping === 0 ? (
                   <span className="font-medium text-emerald-400">Free</span>
                 ) : (
                   <span className="font-medium text-white">{formatCurrency(99)}</span>
                 )}
              </div>
              <div className="flex justify-between">
                 <span>Estimated Tax</span>
                 <span className="font-medium text-white">Calculated at checkout</span>
              </div>
            </div>

            {/* Coupon Area */}
            <div className="mb-6">
               <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-20 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors">
                     Apply
                  </button>
               </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex items-end justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(subtotal + (remainingForFreeShipping === 0 ? 0 : 99))}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full text-base h-12 shadow-lg shadow-violet-500/20">
                 Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Delivery Estimate */}
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/5 p-4">
              <Truck className="h-5 w-5 text-white/40 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Estimated Delivery</p>
                <p className="text-xs text-white/50 mt-1">Order now and receive it between <span className="font-medium text-white/70">Oct 24 - Oct 26</span></p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-white/40">
               <ShieldCheck className="h-4 w-4" /> Secure SSL Encrypted Checkout
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
