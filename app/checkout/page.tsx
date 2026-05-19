import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  return (
    <div className="page-shell py-16">
      <Badge>Razorpay, Stripe, UPI</Badge>
      <h1 className="mt-4 text-5xl font-semibold text-white">Checkout</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <GlassCard className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="First name" />
            <Input placeholder="Last name" />
            <Input placeholder="Email address" />
            <Input placeholder="Phone number" />
          </div>
          <Input placeholder="Street address" />
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="City" />
            <Input placeholder="State" />
            <Input placeholder="PIN code" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PaymentCard title="Razorpay" subtitle="Cards, UPI, wallets" />
            <PaymentCard title="Stripe" subtitle="International cards" />
            <PaymentCard title="UPI" subtitle="Instant QR / VPA" />
          </div>
        </GlassCard>

        <GlassCard className="h-fit">
          <p className="text-2xl font-semibold text-white">Order Total</p>
          <p className="mt-4 text-sm leading-7 text-white/60">Coupon engine, GST support and bulk purchase messaging are wired in the architecture.</p>
          <Button className="mt-6 w-full">Place Secure Order</Button>
        </GlassCard>
      </div>
    </div>
  );
}

function PaymentCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-white/55">{subtitle}</p>
    </div>
  );
}
