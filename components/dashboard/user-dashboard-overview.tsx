"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight, CreditCard, Heart, Loader2, MapPin, PackageCheck, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { GlassCard } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-300 bg-amber-500/10 border-amber-400/20",
  Confirmed: "text-blue-300 bg-blue-500/10 border-blue-400/20",
  Packed: "text-violet-300 bg-violet-500/10 border-violet-400/20",
  Shipped: "text-violet-300 bg-violet-500/10 border-violet-400/20",
  "Out for Delivery": "text-orange-300 bg-orange-500/10 border-orange-400/20",
  Delivered: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
  Cancelled: "text-red-300 bg-red-500/10 border-red-400/20"
};

export function UserDashboardOverview() {
  const { user } = useAuthStore();
  const { items: cartItems, wishlist } = useCartStore();

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMyOrders()
  });

  const orders = ordersRes?.data || [];
  const totalOrders = orders.length;
  const wishlistCount = wishlist.length;

  const widgets = [
    { label: "Orders", value: String(totalOrders).padStart(2, "0"), icon: PackageCheck },
    { label: "Wishlist", value: String(wishlistCount).padStart(2, "0"), icon: Heart },
    { label: "Cart Items", value: String(cartItems.length).padStart(2, "0"), icon: MapPin },
    { label: "Account", value: user?.role === "admin" ? "ADM" : "STD", icon: Bell }
  ];

  return (
    <div className="grid gap-6">
      {/* Stat Widgets */}
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
        {/* Order History */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Order History</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Recent Purchases</h3>
            </div>
            <CreditCard className="h-5 w-5 text-white/40" />
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <PackageCheck className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">No orders yet</p>
                <Link href="/shop" className="text-xs text-violet-400 hover:text-violet-300 mt-1 inline-block transition-colors">
                  Start shopping →
                </Link>
              </div>
            ) : (
              orders.slice(0, 5).map((order: any) => (
                <Link
                  key={order._id}
                  href={`/order-confirmation/${order._id}` as any}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white font-mono">{order.number}</p>
                      <p className="text-xs text-white/45">
                        {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy") : "—"}
                        {" · "}{order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-white">{formatCurrency(order.total)}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] || "text-white/50 bg-white/5 border-white/10"}`}>
                        {order.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </GlassCard>

        {/* Profile Card */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-pink p-5 text-white">
              <UserRoundCog className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{user?.name || "—"}</p>
              <p className="text-sm text-white/50">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-2.5 text-sm text-white/60">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span className="text-white font-medium">{totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Wishlist Items</span>
              <span className="text-white font-medium">{wishlistCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Cart Items</span>
              <span className="text-white font-medium">{cartItems.length}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
            <Link href="/checkout" className="flex-1">
              <button className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/60 hover:text-white hover:border-violet-500/30 transition-all">
                Go to Cart
              </button>
            </Link>
            <Link href="/shop" className="flex-1">
              <button className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2 text-xs text-violet-300 hover:bg-violet-500/20 transition-all">
                Shop Now
              </button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
