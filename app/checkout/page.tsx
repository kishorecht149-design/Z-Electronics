"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronRight, Loader2, ShoppingBag, Tag, Truck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orderService } from "@/services/order.service";
import { productsService } from "@/services/products.service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry", "Chandigarh"
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, clearStore } = useCartStore();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Tamil Nadu",
    postalCode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; coupon: any } | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Fetch real product details for cart items
  const { data: cartProducts, isLoading: cartLoading } = useQuery({
    queryKey: ["cart-products", items.map((i) => i.productId).join(",")],
    queryFn: async () => {
      if (items.length === 0) return [];
      const results = await Promise.all(
        items.map((item) => productsService.getProductById(item.productId).catch(() => null))
      );
      return results
        .filter(Boolean)
        .map((res: any, idx) => ({ ...res?.data, quantity: items[idx]?.quantity }));
    },
    enabled: items.length > 0
  });

  // Pricing calculations
  const subtotal = cartProducts?.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0) ?? 0;
  const shippingFee = subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const total = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  // Coupon validation mutation
  const couponMutation = useMutation({
    mutationFn: () => orderService.validateCoupon(couponCode, subtotal),
    onSuccess: (res) => {
      setAppliedCoupon({ code: couponCode, discountAmount: res.data.discountAmount, coupon: res.data.coupon });
      toast.success(`Coupon "${couponCode.toUpperCase()}" applied! Saving ${formatCurrency(res.data.discountAmount)}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Invalid coupon");
    }
  });

  const handleFormChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to place an order");
      router.push("/login");
      return;
    }

    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.postalCode) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK failed to load");

      // 2. Create order on backend
      const orderRes = await orderService.initiateOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: form,
        couponCode: appliedCoupon?.code,
        paymentMethod: "Razorpay"
      });

      const { razorpayOrderId, amount, keyId, orderId, orderNumber } = orderRes.data;

      // 3. Open Razorpay payment modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount: amount * 100,
          currency: "INR",
          name: "Z Electronics",
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          prefill: {
            name: form.fullName,
            contact: form.phone
          },
          theme: { color: "#7c3aed" },
          handler: async (response: any) => {
            try {
              // 4. Verify payment on backend
              await orderService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              });

              // 5. Clear cart & redirect
              clearStore();
              resolve();
              router.push(`/order-confirmation/${orderId}`);
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment dismissed"))
          }
        });
        rzp.open();
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Order failed";
      if (msg !== "Payment dismissed") toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-white/20 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Sign in to checkout</h1>
        <p className="text-white/60 mb-8">You need to be signed in to place an order.</p>
        <Link href="/login" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-pink px-5 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:brightness-110">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-white/20 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-white/60 mb-8">Add some products before checking out.</p>
        <Link href="/shop" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-pink px-5 py-3 text-sm font-semibold text-white shadow-glow transition duration-300 hover:brightness-110">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm text-violet-400 font-medium mb-2">Secure Checkout</p>
        <h1 className="text-4xl font-bold text-white">Complete Your Order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — Shipping & Payment */}
        <div className="space-y-6">
          {/* Shipping */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Truck className="h-4 w-4 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Shipping Details</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Full Name *</label>
                <Input placeholder="Ada Lovelace" value={form.fullName} onChange={(e) => handleFormChange("fullName", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Phone *</label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => handleFormChange("phone", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Address Line 1 *</label>
                <Input placeholder="House/Flat No., Street, Area" value={form.line1} onChange={(e) => handleFormChange("line1", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Address Line 2</label>
                <Input placeholder="Landmark, Colony (optional)" value={form.line2} onChange={(e) => handleFormChange("line2", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">City *</label>
                <Input placeholder="Chennai" value={form.city} onChange={(e) => handleFormChange("city", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">State *</label>
                <select
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
                  value={form.state}
                  onChange={(e) => handleFormChange("state", e.target.value)}
                >
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">PIN Code *</label>
                <Input placeholder="600001" value={form.postalCode} onChange={(e) => handleFormChange("postalCode", e.target.value)} maxLength={6} />
              </div>
            </div>
          </GlassCard>

          {/* Payment Method */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Payment</h2>
            </div>
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#072654] flex items-center justify-center text-white font-bold text-sm">R</div>
              <div>
                <p className="text-sm font-medium text-white">Razorpay</p>
                <p className="text-xs text-white/50">Cards · UPI · NetBanking · Wallets</p>
              </div>
              <div className="ml-auto h-4 w-4 rounded-full border-2 border-violet-500 bg-violet-500" />
            </div>
            <p className="mt-3 text-xs text-white/40">🔒 Your payment is secured by Razorpay PCI DSS Level 1</p>
          </GlassCard>
        </div>

        {/* Right — Order Summary */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cartLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-violet-400" /></div>
              ) : (
                cartProducts?.map((p: any) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{p.name}</p>
                      <p className="text-xs text-white/50">Qty: {p.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-white flex-shrink-0">{formatCurrency(p.price * p.quantity)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
                  <Tag className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-400 font-medium flex-1">{appliedCoupon.code} applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-white/40 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 text-sm uppercase"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => couponMutation.mutate()}
                    disabled={!couponCode || couponMutation.isPending}
                  >
                    {couponMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Coupon Discount</span><span>−{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-white/60">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-400">Free</span> : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>GST (18%)</span><span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2.5 mt-2">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          </GlassCard>

          <Button
            className="w-full h-13 text-base font-semibold shadow-lg shadow-violet-500/25"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cartLoading || items.length === 0}
          >
            {isPlacingOrder ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <>Pay {formatCurrency(total)} <ChevronRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>

          <p className="text-center text-xs text-white/30">
            By placing this order, you agree to our{" "}
            <Link href={"/terms-and-conditions" as any} className="underline hover:text-white/60">Terms</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
